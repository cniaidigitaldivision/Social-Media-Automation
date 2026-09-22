'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from '@/lib/crypto';
import { createClient } from '@/lib/supabase/server';
import { saveTokens } from '@/lib/token-vault';

export async function confirmPinterestSelection(formData: FormData) {
  const workspaceId = formData.get('workspaceId') as string;
  const selectedBoardIds = formData.getAll('selectedBoards') as string[];
  
  if (!workspaceId) {
    throw new Error('Missing workspaceId');
  }
  
  if (selectedBoardIds.length === 0) {
    redirect(`/workspaces/${workspaceId}/accounts?error=no_selection`);
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('pinterest_oauth_session');

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
  let boards = [];
  try {
    tokens = JSON.parse(decrypt(sessionRow.user_token_encrypted));
    boards = JSON.parse(decrypt(sessionRow.pages_json));
  } catch (e) {
    redirect(`/workspaces/${workspaceId}/accounts?error=invalid_session`);
  }

  for (const boardId of selectedBoardIds) {
    const board = boards.find((b: any) => b.id === boardId);
    if (!board) continue;

    const { data: account, error: accountError } = await supabase
      .from('connected_accounts')
      .upsert({
        workspace_id: workspaceId,
        platform: 'pinterest',
        platform_account_id: board.id,
        account_name: `${board.name} (${board.username})`,
        account_avatar_url: board.avatar || null,
        status: 'active'
      }, { onConflict: 'workspace_id, platform, platform_account_id' })
      .select('id')
      .single();

    if (accountError || !account) {
      console.error('Failed to insert Pinterest account', accountError);
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
  cookieStore.delete('pinterest_oauth_session');
  
  redirect(`/workspaces/${workspaceId}/accounts`);
}
