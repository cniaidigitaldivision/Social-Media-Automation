import { AppShell } from '@/components/app-shell';
import { createClient } from '@/lib/supabase/server';
import { WorkspacesClient, type WorkspaceSummary } from './WorkspacesClient';

/**
 * /workspaces — All Workspaces
 *
 * This page used to run its query in the browser with the anon key. The
 * `workspaces: authenticated read` RLS policy (migration 001) only grants
 * SELECT to the `authenticated` role, and auth is not wired up yet, so the
 * anon client got back an empty array with NO error and the page rendered
 * "No workspaces yet" while real workspaces existed in the database.
 *
 * It is now a Server Component reading through lib/supabase/server (service
 * role), which is exactly how /workspaces/[workspaceId]/layout.tsx and every
 * other server page in this app already load workspace data. When real auth
 * lands, this should move back to a session-scoped client so RLS does the
 * filtering again.
 *
 * Every number on this page comes from a live query. Nothing is hardcoded —
 * where a count query fails the card says the count is unavailable instead of
 * showing a zero that would read as real.
 */

export const dynamic = 'force-dynamic';



const ACCOUNT_ACTIVE_STATUS = 'active';
const ACCOUNT_ATTENTION_STATUSES = ['needs_reconnect', 'revoked'];
const POST_SCHEDULED_STATUS = 'scheduled';
const POST_PENDING_STATUS = 'pending_approval';

type WorkspaceRow = {
  id: string;
  name: string;
  slug: string | null;
  logo_url: string | null;
  brand_color: string | null;
  status: string | null;
  created_at: string | null;
};

/** Active workspaces first, then paused/archived; alphabetical inside each group. */
const STATUS_RANK: Record<string, number> = { active: 0, paused: 1, archived: 2 };

export default async function WorkspacesPage() {
  const supabase = createClient();

  const { data: rows, error: workspacesError } = await supabase
    .from('workspaces')
    .select('id, name, slug, logo_url, brand_color, status, created_at')
    .order('created_at', { ascending: true });

  if (workspacesError) {
    console.error('[WorkspacesPage] workspaces query failed:', workspacesError);
  }

  const workspaceRows: WorkspaceRow[] = rows ?? [];
  const ids = workspaceRows.map((w) => w.id);

  // Two grouped count queries for the whole list rather than 2N per-card
  // queries. Both are scoped to the workspace ids actually on screen.
  const [accountsRes, postsRes] = ids.length
    ? await Promise.all([
        supabase.from('connected_accounts').select('workspace_id, status').in('workspace_id', ids),
        supabase.from('posts').select('workspace_id, status').in('workspace_id', ids),
      ])
    : [
        { data: [] as { workspace_id: string; status: string | null }[], error: null },
        { data: [] as { workspace_id: string; status: string | null }[], error: null },
      ];

  if (accountsRes.error) {
    console.error('[WorkspacesPage] connected_accounts query failed:', accountsRes.error);
  }
  if (postsRes.error) {
    console.error('[WorkspacesPage] posts query failed:', postsRes.error);
  }

  const accountsAvailable = !accountsRes.error;
  const postsAvailable = !postsRes.error;

  const countBy = (
    source: { workspace_id: string | null; status: string | null }[] | null,
    workspaceId: string,
    match: (status: string | null) => boolean
  ) => (source ?? []).filter((r) => r.workspace_id === workspaceId && match(r.status)).length;

  const workspaces: WorkspaceSummary[] = workspaceRows
    .map((ws) => ({
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      logoUrl: ws.logo_url,
      brandColor: ws.brand_color,
      status: ws.status ?? 'active',
      createdAt: ws.created_at,
      accountsAvailable,
      accountsActive: accountsAvailable
        ? countBy(accountsRes.data, ws.id, (s) => s === ACCOUNT_ACTIVE_STATUS)
        : null,
      accountsNeedingAttention: accountsAvailable
        ? countBy(accountsRes.data, ws.id, (s) => ACCOUNT_ATTENTION_STATUSES.includes(s ?? ''))
        : null,
      postsAvailable,
      postsScheduled: postsAvailable
        ? countBy(postsRes.data, ws.id, (s) => s === POST_SCHEDULED_STATUS)
        : null,
      postsPendingApproval: postsAvailable
        ? countBy(postsRes.data, ws.id, (s) => s === POST_PENDING_STATUS)
        : null,
    }))
    .sort((a, b) => {
      const rank = (STATUS_RANK[a.status] ?? 3) - (STATUS_RANK[b.status] ?? 3);
      return rank !== 0 ? rank : a.name.localeCompare(b.name);
    });

  return (
    // Same shell as every workspace-scoped page. No workspaceId: this route is
    // the top-level list, so the sidebar disables its workspace-scoped links.
    // The rows already fetched above feed the switcher — no extra query.
    <AppShell workspaces={workspaceRows}>
      <WorkspacesClient
        workspaces={workspaces}
        loadError={
          workspacesError
            ? 'Could not load workspaces from Supabase. The workspaces table did not respond — check the connection and try again.'
            : null
        }
      />
    </AppShell>
  );
}
