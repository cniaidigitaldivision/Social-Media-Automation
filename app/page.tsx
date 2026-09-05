import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Root route — server-side redirect into the first real workspace.
 *
 * Queries the workspaces table (service-role, bypasses RLS) and redirects
 * to the first result's /accounts page. This means the root URL always
 * resolves to a real workspace UUID, never a placeholder.
 *
 * Edge cases:
 *  - No workspaces yet → redirect to /workspaces so the user can create one.
 *  - Supabase error → redirect to /workspaces as a safe fallback.
 *
 * When Supabase auth is wired in, replace the plain .select() with a query
 * filtered by the authenticated user's workspace_members rows, and use the
 * last-active workspace_id from the user's session/profile.
 */
export default async function HomePage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('workspaces')
    .select('id')
    .eq('status', 'active')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[HomePage] Supabase error fetching first workspace:', error);
    redirect('/workspaces');
  }

  if (!data) {
    // No workspaces exist yet — show the grid so user can create one
    redirect('/workspaces');
  }

  redirect(`/workspaces/${data.id}/accounts`);
}
