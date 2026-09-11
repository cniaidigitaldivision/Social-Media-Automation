'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * Manually connect a LinkedIn Organization to a workspace.
 *
 * NOTE: No token_vault row is created here.
 * LinkedIn posting goes through n8n's own shared LinkedIn credential
 * (one admin account with access to every client's Company Page).
 * When real LinkedIn OAuth is built later, that flow will add a token_vault entry.
 */
export async function connectLinkedIn(
  workspaceId: string,
  orgName: string,
  orgId: string
): Promise<{ error?: string } | undefined> {
  if (!workspaceId || !orgName || !orgId) {
    return { error: 'All fields are required.' };
  }

  const supabase = createClient();

  const { error } = await supabase.from('connected_accounts').insert({
    workspace_id: workspaceId,
    platform: 'linkedin',
    platform_account_id: orgId,
    account_name: orgName,
    status: 'active',
    connected_at: new Date().toISOString(),
  });

  if (error) {
    // Unique constraint violation — this org is already connected
    if (error.code === '23505') {
      return { error: 'This LinkedIn Organization is already connected to this workspace.' };
    }
    console.error('[connectLinkedIn] Supabase error:', error);
    return { error: 'Failed to save. Please try again.' };
  }

  revalidatePath(`/workspaces/${workspaceId}/accounts`);
  return undefined; // success
}
