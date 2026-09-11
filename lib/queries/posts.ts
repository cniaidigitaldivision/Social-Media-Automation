import 'server-only';

import { createClient } from '@/lib/supabase/server';

/**
 * Shared post queries.
 *
 * The pending-approval number appears in three places (the sidebar badge, the
 * Approvals queue, and the Dashboard KPI). It is defined here exactly once so
 * those places can never drift apart.
 */

export const PENDING_APPROVAL_STATUS = 'pending_approval';

/** Number of posts in this workspace waiting for a human decision. */
export async function countPendingApprovals(workspaceId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .eq('status', PENDING_APPROVAL_STATUS);

  if (error) {
    console.error('[countPendingApprovals] Supabase error:', error);
    return 0;
  }

  return count ?? 0;
}
