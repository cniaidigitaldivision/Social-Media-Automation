"use client";

import React from 'react';
import { icons } from '@/lib/icons';
import { useAppStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import { ProfileDropdown } from '@/components/ProfileDropdown';

interface HeaderProps {
  /** Label for the workspace picker when no workspace is current. */
  workspaceLabel?: string;
}

export function Header({ workspaceLabel }: HeaderProps = {}) {
  const { state, toggleWorkspaceSwitcher } = useAppStore();
  const pathname = usePathname();
  const isLeadsScreen = pathname?.includes('leads');
  const pickerLabel = state.currentWorkspace || workspaceLabel || 'Select workspace';

  return (
    <header className="app-header bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-30 relative sticky top-0">
      <div className="header-left">
        {/* Mobile sidebar toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => document.body.classList.toggle('sidebar-open')}
          title="Toggle Menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Workspace Switcher Button */}
        <div className="workspace-picker-wrapper">
          <button
            className="workspace-picker-btn"
            id="btn-workspace-switcher"
            onClick={() => toggleWorkspaceSwitcher()}
          >
            <span className="workspace-name">{pickerLabel}</span>
            <span className="workspace-caret">{icons.chevronDown}</span>
          </button>
        </div>
      </div>


      {/* Header Actions */}
      <div className="header-right">
        {/* Apps Grid Icon */}
        <button
          className="header-icon-btn"
          onClick={() => toggleWorkspaceSwitcher()}
          title="Workspaces & Apps"
        >
          {icons.grid}
        </button>

        {/* User Dropdown */}
        <div className="relative ml-2">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
