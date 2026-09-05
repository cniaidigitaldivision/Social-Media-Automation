"use client";

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export function StoreHydrator({ workspaces, currentWorkspaceId }: { workspaces: any[]; currentWorkspaceId: string }) {
  const { updateState, setWorkspace } = useAppStore();
  const lastHydratedId = useRef<string | null>(null);

  useEffect(() => {
    // Only hydrate once per workspace ID to avoid infinite loops,
    // but DO re-hydrate when the workspace ID changes via client-side routing.
    if (lastHydratedId.current === currentWorkspaceId) return;
    
    if (workspaces && workspaces.length > 0) {
      // Map Supabase rows to our store's Workspace type
      const mappedWorkspaces = workspaces.map(ws => ({
        id: ws.id,
        name: ws.name,
        accountsCount: 0, // No accounts table yet
        isCurrent: ws.id === currentWorkspaceId,
        logoText: ws.name.substring(0, 2).toUpperCase(),
        logo_url: ws.logo_url,
        brand_color: ws.brand_color || '#0F5132'
      }));

      const currentWs = mappedWorkspaces.find(ws => ws.isCurrent);

      updateState({
        workspaces: mappedWorkspaces,
        currentWorkspace: currentWs ? currentWs.name : ''
      });
      lastHydratedId.current = currentWorkspaceId;
    }
  }, [workspaces, currentWorkspaceId, updateState]);

  return null;
}
