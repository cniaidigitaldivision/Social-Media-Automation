"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { icons } from '@/lib/icons';
import { useAppStore, Workspace } from '@/lib/store';
import { NewWorkspaceModal } from './new-workspace-modal/NewWorkspaceModal';

// Extends the base store Workspace type for the UI
type SwitcherWorkspace = Workspace & {
  logo_url?: string | null;
  brand_color?: string | null;
};

export function WorkspaceSwitcher() {
  const router = useRouter();
  const { state, toggleWorkspaceSwitcher, setWorkspace, updateState } = useAppStore();
  const [filter, setFilter] = useState('');

  if (!state.modals.isWorkspaceSwitcherOpen && !state.modals.isNewWorkspaceModalOpen) return null;

  const filteredWorkspaces = state.workspaces.filter((ws) =>
    ws.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelect = (wsId: string, wsName: string) => {
    setWorkspace(wsName);
    toggleWorkspaceSwitcher(false);
    setFilter('');
    router.push(`/workspaces/${wsId}/accounts`);
  };

  const handleSuccess = (created: { id: string; name: string; slug: string; logo_url: string | null }) => {
    // Add to global store
    const newWs: SwitcherWorkspace = {
      id: created.id,
      name: created.name,
      accountsCount: 0,
      isCurrent: true, // we will set it current
      logoText: created.name.substring(0, 2).toUpperCase(),
      logo_url: created.logo_url,
      brand_color: '#0F5132'
    };

    updateState({
      workspaces: [...state.workspaces, newWs],
    });
    setWorkspace(created.name);
    // Modal will close itself (via onClose prop logic if we pass it, but NewWorkspaceModal sets it internally.
    // Actually NewWorkspaceModal calls onClose to close itself.
  };

  return (
    <>
      {state.modals.isWorkspaceSwitcherOpen && (
        <div className="workspace-modal-overlay" onClick={() => { toggleWorkspaceSwitcher(false); setFilter(''); }}>
          <div className="workspace-switcher-card animate-scale-in" onClick={(e) => e.stopPropagation()}>
            {/* Brand header in modal */}
            <div className="switcher-top-brand">
              <span className="switcher-brand-title">Crescent Nova International</span>
            </div>

            {/* Search Workspace Input */}
            <div className="switcher-search-box">
              <span className="switcher-search-icon">{icons.search}</span>
              <input
                type="text"
                className="switcher-search-input"
                placeholder="Find workspace..."
                id="switcher-filter-input"
                autoFocus
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              {filter && (
                <button
                  onClick={() => setFilter('')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-light)', display: 'flex', alignItems: 'center' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            {/* Workspaces List */}
            <div className="workspace-items-list" id="workspace-items-container">
              {filteredWorkspaces.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>No workspaces found</div>
              ) : (
                filteredWorkspaces.map((ws: SwitcherWorkspace) => (
                  <div
                    key={ws.id}
                    className={`workspace-item-row ${ws.isCurrent ? 'selected-workspace' : ''}`}
                    onClick={() => handleSelect(ws.id, ws.name)}
                  >
                    <div className="workspace-item-left">
                      {ws.logo_url ? (
                        <div className="workspace-avatar-badge" style={{ padding: 0, overflow: 'hidden' }}>
                          <img src={ws.logo_url} alt={`${ws.name} logo`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div className="workspace-avatar-badge" style={{ backgroundColor: ws.brand_color || undefined }}>{ws.logoText}</div>
                      )}
                      <span className="workspace-item-name">{ws.name}</span>
                    </div>
                    <div className="workspace-item-right">
                      {ws.isCurrent && <span className="workspace-check-icon">{icons.check}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add New Workspace Footer Button */}
            <div className="switcher-footer">
              <button
                className="btn-add-workspace"
                onClick={() => {
                  updateState({
                    modals: {
                      ...state.modals,
                      isWorkspaceSwitcherOpen: false,
                      isNewWorkspaceModalOpen: true,
                    }
                  });
                }}
              >
                <span className="btn-icon">{icons.plus}</span>
                <span className="btn-text">Add new workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <NewWorkspaceModal
        isOpen={state.modals.isNewWorkspaceModalOpen}
        onClose={() => {
          updateState({
            modals: {
              ...state.modals,
              isNewWorkspaceModalOpen: false,
            }
          });
        }}
        onSuccess={handleSuccess}
      />
    </>
  );
}
