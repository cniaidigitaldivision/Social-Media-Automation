'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from '@/lib/crypto';
import { createClient } from '@/lib/supabase/server';
import { saveTokens } from '@/lib/token-vault';

export async function confirmMetaSelection(formData: FormData) {
  const workspaceId = formData.get('workspaceId') as string;
  const selectedPageIds = formData.getAll('selectedPages') as string[];
  
  if (!workspaceId) {
    throw new Error('Missing workspaceId');
  }
  
  if (selectedPageIds.length === 0) {
    redirect(`/workspaces/${workspaceId}/accounts?error=no_selection`);
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('meta_oauth_session');

  if (!sessionCookie) {
    redirect(`/workspaces/${workspaceId}/accounts?error=session_expired`);
  }

  const sessionId = sessionCookie.value;
  const supabase = createClient();

  console.log(`[confirmMetaSelection] Looking up session id: ${sessionId}`);
  const { data: sessionRow, error: sessionError } = await supabase
    .from('oauth_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  console.log(`[confirmMetaSelection] Supabase query result:`, { sessionRow, sessionError });

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

  let userToken = '';
  let pages = [];
  try {
    userToken = decrypt(sessionRow.user_token_encrypted);
    pages = JSON.parse(decrypt(sessionRow.pages_json));
  } catch (e) {
    console.error(`[confirmMetaSelection] Decryption error:`, e);
    redirect(`/workspaces/${workspaceId}/accounts?error=invalid_session`);
  }

  for (const pageId of selectedPageIds) {
    const page = pages.find((p: any) => p.id === pageId);
    if (!page) continue;

    // Fetch the specific page access token
    const tokenUrl = new URL(`https://graph.facebook.com/v19.0/${pageId}`);
    tokenUrl.searchParams.set('fields', 'access_token');
    tokenUrl.searchParams.set('access_token', userToken);

    const tokenRes = await fetch(tokenUrl.toString());
    const tokenData = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      console.error(`Failed to fetch access token for page ${pageId}`, tokenData.error);
      continue;
    }

    const pageAccessToken = tokenData.access_token;
    const pageAvatarUrl = page.picture?.data?.url || '';

    // Insert connected account for Facebook Page
    const { data: fbAccount, error: fbError } = await supabase
      .from('connected_accounts')
      .upsert({
        workspace_id: workspaceId,
        platform: 'facebook',
        platform_account_id: page.id,
        account_name: page.name,
        account_avatar_url: pageAvatarUrl,
        status: 'active'
      }, { onConflict: 'workspace_id, platform, platform_account_id' })
      .select('id')
      .single();

    if (fbError || !fbAccount) {
      console.error('Failed to insert FB account', fbError);
      continue;
    }

    await saveTokens(fbAccount.id, {
      accessToken: pageAccessToken,
      scopes: []
    });

    // If Instagram is linked, add it as well using the same page token
    if (page.instagram_business_account) {
      const igAccountId = page.instagram_business_account.id;
      
      // Fetch IG profile details
      const igUrl = new URL(`https://graph.facebook.com/v19.0/${igAccountId}`);
      igUrl.searchParams.set('fields', 'username,profile_picture_url');
      igUrl.searchParams.set('access_token', pageAccessToken);
      
      const igRes = await fetch(igUrl.toString());
      const igData = await igRes.json();
      
      const igUsername = igData.username || 'Instagram Account';
      const igAvatar = igData.profile_picture_url || '';

      const { data: igAccount, error: igError } = await supabase
        .from('connected_accounts')
        .upsert({
          workspace_id: workspaceId,
          platform: 'instagram',
          platform_account_id: igAccountId,
          account_name: igUsername,
          account_avatar_url: igAvatar,
          status: 'active'
        }, { onConflict: 'workspace_id, platform, platform_account_id' })
        .select('id')
        .single();

      if (!igError && igAccount) {
        await saveTokens(igAccount.id, {
          accessToken: pageAccessToken,
          scopes: []
        });
      } else {
        console.error('Failed to insert IG account', igError);
      }
    }
  }

  // Clear session from database and cookie
  await supabase.from('oauth_sessions').delete().eq('id', sessionId);
  cookieStore.delete('meta_oauth_session');
  
  redirect(`/workspaces/${workspaceId}/accounts`);
}

export async function disconnectAccount(accountId: string, workspaceId: string) {
  const supabase = createClient();
  
  console.log(`[disconnectAccount] Attempting to delete accountId=${accountId} in workspaceId=${workspaceId}`);
  
  // Both token_vault and connected_accounts will cascade or be deleted, 
  // but let's delete connected_accounts which cascades to token_vault.
  const { data, error } = await supabase
    .from('connected_accounts')
    .delete()
    .eq('id', accountId)
    .eq('workspace_id', workspaceId)
    .select(); // Ensure we can see what was deleted

  console.log(`[disconnectAccount] Supabase delete result:`, JSON.stringify({ data, error }, null, 2));

  if (error) {
    console.error(`[disconnectAccount] FULL ERROR:`, error);
    throw new Error('Failed to disconnect account');
  }
}
