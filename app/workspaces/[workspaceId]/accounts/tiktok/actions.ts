'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * Manually connect a TikTok channel (via Buffer) to a workspace.
 *
 * NOTE: No token_vault row is created here.
 * TikTok posting goes through Buffer's own TikTok integration — n8n calls
 * Buffer's API using Buffer's own credential. The Buffer Channel ID stored
 * in platform_account_id is all n8n needs to target the right channel.
 * There is no per-workspace TikTok OAuth token for us to manage.
 */
export async function connectTikTok(
  workspaceId: string,
  channelName: string,
  bufferChannelId: string
): Promise<{ error?: string } | undefined> {
  if (!workspaceId || !channelName || !bufferChannelId) {
    return { error: 'All fields are required.' };
  }

  const supabase = createClient();

  const { error } = await supabase.from('connected_accounts').insert({
    workspace_id: workspaceId,
    platform: 'tiktok',
    platform_account_id: bufferChannelId,
    account_name: channelName,
    status: 'active',
    connected_at: new Date().toISOString(),
  });

  if (error) {
    // Unique constraint violation — this Buffer channel ID is already connected
    if (error.code === '23505') {
      return { error: 'This TikTok channel is already connected to this workspace.' };
    }
    console.error('[connectTikTok] Supabase error:', error);
    return { error: 'Failed to save. Please try again.' };
  }

  revalidatePath(`/workspaces/${workspaceId}/accounts`);
  return undefined; // success
}
