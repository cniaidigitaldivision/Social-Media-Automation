"use client";

import React from 'react';
import { icons } from '@/lib/icons';
import { useAppStore } from '@/lib/store';
import { usePathname } from 'next/navigation';

export function Header() {
  const { state, toggleWorkspaceSwitcher } = useAppStore();
  const pathname = usePathname();
  const isLeadsScreen = pathname?.includes('leads');

  return (
    <header className="app-header">
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
            <span className="workspace-name">{state.currentWorkspace}</span>
            <span className="workspace-caret">{icons.chevronDown}</span>
          </button>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="header-center">
        <div className="search-input-wrapper">
          <span className="search-icon">{icons.search}</span>
          <input 
            type="text" 
            className="global-search-input" 
            placeholder={isLeadsScreen ? 'Search leads...' : 'Search posts, campaigns, accounts...'} 
            id="global-search-box"
            onChange={(e) => console.log('Global search:', e.target.value)}
          />
          <kbd className="search-shortcut">/</kbd>
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
        <div className="user-profile-menu-wrapper">
          <button 
            className="user-avatar-btn" 
            onClick={() => alert('User Menu opened')} 
            title={`${state.auth.user.name} - ${state.auth.user.role}`}
          >
            <div className="avatar-circle">
              <span>{state.auth.user.avatarInitials}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
