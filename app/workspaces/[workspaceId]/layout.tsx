import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { WorkspaceSwitcher } from '@/components/workspace-switcher';
import { Modals } from '@/components/modals';
import { StoreHydrator } from '@/components/store-hydrator';

/**
 * Shared layout for every /workspaces/[workspaceId]/* page.
 *
 * 1. Fetches the workspace row by id using the service-role client
 *    (bypasses RLS — no auth session needed at this stage).
 * 2. Calls notFound() if the row does not exist.
 * 3. Renders the full app chrome: Sidebar + Header + main viewport.
 *    Child pages render into {children}.
 *
 * params.workspaceId MUST match the folder name [workspaceId].
 */
export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  // --- Diagnostic log (safe to remove once routing is stable) ---------------
  console.log('[WorkspaceLayout] workspaceId from params:', workspaceId);

  const supabase = createClient(); // service-role key, bypasses RLS
  const { data: workspace, error } = await supabase
    .from('workspaces')
    .select('id, name, slug, logo_url')
    .eq('id', workspaceId)
    .maybeSingle();

  const { data: allWorkspaces } = await supabase
    .from('workspaces')
    .select('id, name, slug, logo_url, brand_color, status')
    .order('name');

  console.log('[WorkspaceLayout] Supabase query result:', { workspace, error });
  console.log('[WorkspaceLayout] Client: service-role (bypasses RLS)');

  if (error) {
    console.error('[WorkspaceLayout] Supabase error:', error);
  }

  if (!workspace) {
    console.warn('[WorkspaceLayout] notFound() called for workspaceId:', workspaceId);
    notFound();
  }

  return (
    <div className="app-layout-container">
      <StoreHydrator workspaces={allWorkspaces || []} currentWorkspaceId={workspaceId} />
      {/* Left sidebar — workspace-aware links injected via data attribute */}
      <Sidebar workspaceId={workspaceId} />

      {/* Right panel: header + page content */}
      <div className="app-main-viewport">
        <Header />
        {children}
      </div>

      {/* Global workspace-switcher overlay & modals */}
      <WorkspaceSwitcher />
      <Modals />
    </div>
  );
}
