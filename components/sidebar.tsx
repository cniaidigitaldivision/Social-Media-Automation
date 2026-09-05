"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { icons } from '@/lib/icons';
import { useAppStore } from '@/lib/store';

interface SidebarProps {
  /** The workspaceId segment from the URL. When provided, all nav links
   *  are scoped to /workspaces/{workspaceId}/... */
  workspaceId?: string;
}

export function Sidebar({ workspaceId }: SidebarProps) {
  const pathname = usePathname() || '';
  const { state } = useAppStore();

  /** Build an absolute path, workspace-scoped when workspaceId is known. */
  const href = (segment: string) =>
    workspaceId ? `/workspaces/${workspaceId}/${segment}` : `/${segment}`;

  const getSubtitleByScreen = (path: string) => {
    if (path.includes('dashboard')) return 'Internal Admin';
    if (path.includes('composer')) return 'Enterprise Workspace';
    if (path.includes('calendar')) return 'B2B Management';
    if (path.includes('approvals')) return 'Marketing Suite';
    if (path.includes('accounts')) return 'Management Hub';
    if (path.includes('leads')) return 'SALES CRM';
    if (path.includes('post-status')) return 'Delivery Analytics';
    return 'Internal Admin';
  };

  const subtitle = getSubtitleByScreen(pathname);

  const isActive = (segment: string) => pathname.includes(segment);

  return (
    <aside className="app-sidebar" id="app-sidebar">
      {/* Sidebar Brand */}
      <div className="sidebar-brand-wrapper">
        <Link href={href('dashboard')} className="sidebar-brand">
          <div className="sidebar-brand-logo-container" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img src="/crescent-nova-logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="brand-info">
            <div className="brand-name">Crescent Nova International</div>
            <div className="brand-badge" id="sidebar-dynamic-badge">{subtitle}</div>
          </div>
        </Link>
      </div>

      {/* Primary Action Button */}
      <div className="sidebar-action-wrapper">
        <Link href={href('composer')} className="btn-create-post" id="btn-sidebar-create-post" style={{ textDecoration: 'none' }}>
          <span className="btn-icon">{icons.plus}</span>
          <span className="btn-text">Create Post</span>
        </Link>
      </div>

      {/* Navigation Menu Items */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link href={href('dashboard')} className={`nav-link ${isActive('dashboard') ? 'active' : ''}`}>
              <span className="nav-icon">{icons.dashboard}</span>
              <span className="nav-text">Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={href('composer')} className={`nav-link ${isActive('composer') ? 'active' : ''}`}>
              <span className="nav-icon">{icons.composer}</span>
              <span className="nav-text">Composer</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={href('calendar')} className={`nav-link ${isActive('calendar') ? 'active' : ''}`}>
              <span className="nav-icon">{icons.calendar}</span>
              <span className="nav-text">Calendar</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={href('approvals')} className={`nav-link ${isActive('approvals') ? 'active' : ''}`}>
              <span className="nav-icon">{icons.approvals}</span>
              <span className="nav-text">Approvals</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={href('accounts')} className={`nav-link ${isActive('accounts') ? 'active' : ''}`}>
              <span className="nav-icon">{icons.accounts}</span>
              <span className="nav-text">Accounts</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={href('leads')} className={`nav-link ${isActive('leads') ? 'active' : ''}`}>
              <span className="nav-icon">{icons.leads}</span>
              <span className="nav-text">Leads</span>
            </Link>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${isActive('settings') ? 'active' : ''}`} onClick={() => alert('Settings opened')}>
              <span className="nav-icon">{icons.settings}</span>
              <span className="nav-text">Settings</span>
            </button>
          </li>
          <li className="nav-item">
            <Link href="/workspaces" className={`nav-link ${pathname === '/workspaces' ? 'active' : ''}`}>
              <span className="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </span>
              <span className="nav-text">All Workspaces</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button className="footer-link" onClick={() => alert('User Menu opened')}>
          <span className="footer-icon">{icons.user}</span>
          <span className="footer-text">Account</span>
        </button>
      </div>
    </aside>
  );
}
