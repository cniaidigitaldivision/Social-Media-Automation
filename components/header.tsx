"use client";

import React from 'react';
import { icons } from '@/lib/icons';
import { useAppStore } from '@/lib/store';
import { usePathname } from 'next/navigation';

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
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
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

      {/* Global Search Bar */}
      <div className="header-center">
        <div className="search-input-wrapper flex items-center bg-slate-100/60 backdrop-blur-md hover:bg-slate-100/80 focus-within:bg-white focus-within:border-[#00A99D] focus-within:shadow-[0_4px_15px_rgba(0,169,157,0.15)] border border-slate-200 shadow-sm rounded-full px-4 py-1.5 transition-all duration-300 w-[420px]">
          <span className="search-icon text-slate-400 mr-3 opacity-70">{icons.search}</span>
          <input 
            type="text" 
            className="global-search-input flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-slate-700 placeholder-slate-400 text-[14px]" 
            placeholder={isLeadsScreen ? 'Search leads...' : 'Search posts, campaigns, accounts...'} 
            id="global-search-box"
            onChange={(e) => console.log('Global search:', e.target.value)}
          />
          <kbd className="search-shortcut hidden sm:flex items-center justify-center border border-slate-200/70 bg-white text-slate-400 rounded px-1.5 py-0.5 text-[11px] ml-3 font-medium shadow-sm">/</kbd>
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

        {/* User Avatar Pill */}
        <div className="user-profile-menu-wrapper ml-4">
          <button 
            className="user-avatar-btn flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.15)] transition-all" 
            onClick={() => alert('User Menu opened')} 
            title={`${state.auth.user.name} - ${state.auth.user.role}`}
          >
            <div className="avatar-circle font-medium text-sm">
              <span>{state.auth.user.avatarInitials}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
