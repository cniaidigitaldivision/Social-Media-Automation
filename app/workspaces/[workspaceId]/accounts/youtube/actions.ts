'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from '@/lib/crypto';
import { createClient } from '@/lib/supabase/server';
import { saveTokens } from '@/lib/token-vault';

export async function confirmYouTubeSelection(formData: FormData) {
  const workspaceId = formData.get('workspaceId') as string;
  const selectedChannelIds = formData.getAll('selectedChannels') as string[];
  
  if (!workspaceId) {
    throw new Error('Missing workspaceId');
  }
  
  if (selectedChannelIds.length === 0) {
    redirect(`/workspaces/${workspaceId}/accounts?error=no_selection`);
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('youtube_oauth_session');

  if (!sessionCookie) {
    redirect(`/workspaces/${workspaceId}/accounts?error=session_expired`);
  }

  const sessionId = sessionCookie.value;
  const supabase = createClient();

  const { data: sessionRow, error: sessionError } = await supabase
    .from('oauth_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (sessionError || !sessionRow) {
    redirect(`/workspaces/${workspaceId}/accounts?error=session_expired`);
  }

  if (new Date() > new Date(sessionRow.expires_at)) {
    await supabase.from('oauth_sessions').delete().eq('id', sessionId);
    redirect(`/workspaces/${workspaceId}/accounts?error=session_expired`);
  }

  if (sessionRow.workspace_id !== workspaceId) {
    redirect(`/workspaces/${workspaceId}/accounts?error=workspace_mismatch`);
  }

  let tokens;
  let channels = [];
  try {
    tokens = JSON.parse(decrypt(sessionRow.user_token_encrypted));
    channels = JSON.parse(decrypt(sessionRow.pages_json));
  } catch (e) {
    redirect(`/workspaces/${workspaceId}/accounts?error=invalid_session`);
  }

  for (const channelId of selectedChannelIds) {
    const channel = channels.find((c: any) => c.id === channelId);
    if (!channel) continue;

    const { data: account, error: accountError } = await supabase
      .from('connected_accounts')
      .upsert({
        workspace_id: workspaceId,
        platform: 'youtube',
        platform_account_id: channel.id,
        account_name: channel.snippet.title,
        account_avatar_url: channel.snippet.thumbnails?.default?.url || null,
        status: 'active'
      }, { onConflict: 'workspace_id, platform, platform_account_id' })
      .select('id')
      .single();

    if (accountError || !account) {
      console.error('Failed to insert YouTube account', accountError);
      continue;
    }

    await saveTokens(account.id, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
    });
  }

  // Clear session from database and cookie
  await supabase.from('oauth_sessions').delete().eq('id', sessionId);
  cookieStore.delete('youtube_oauth_session');
  
  redirect(`/workspaces/${workspaceId}/accounts`);
}
