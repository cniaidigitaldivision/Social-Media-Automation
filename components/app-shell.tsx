import React from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { WorkspaceSwitcher } from '@/components/workspace-switcher';
import { Modals } from '@/components/modals';
import { StoreHydrator } from '@/components/store-hydrator';

/**
 * The app chrome — sidebar, top bar, workspace switcher and modal root.
 *
 * Extracted from app/workspaces/[workspaceId]/layout.tsx so that the
 * top-level /workspaces page renders the exact same shell instead of a
 * bare page. There is one shell in the app; both callers use it.
 *
 * Pass `workspaceId` when the route is scoped to a workspace. Omit it for
 * top-level routes: the sidebar then disables the workspace-scoped links
 * (there is no /dashboard, /composer, … outside a workspace) and the top bar
 * shows "All Workspaces" as the current context in the workspace picker.
 */

export type ShellWorkspace = {
  id: string;
  name: string;
  logo_url?: string | null;
  brand_color?: string | null;
};

export function AppShell({
  workspaceId,
  workspaces,
  pendingCount,
  children,
}: {
  workspaceId?: string;
  /** Real rows, used to populate the workspace switcher. */
  workspaces: ShellWorkspace[];
  pendingCount?: number;
  children: React.ReactNode;
}) {
  const isWorkspaceScoped = Boolean(workspaceId);

  return (
    <div className="app-layout-container">
      <StoreHydrator workspaces={workspaces} currentWorkspaceId={workspaceId ?? ''} />

      <Sidebar workspaceId={workspaceId} pendingCount={pendingCount} />

      <div className="app-main-viewport">
        <Header workspaceLabel={isWorkspaceScoped ? undefined : 'All Workspaces'} />
        {children}
      </div>

      <WorkspaceSwitcher />
      <Modals />
    </div>
  );
}
