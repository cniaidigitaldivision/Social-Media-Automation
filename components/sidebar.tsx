"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { icons } from '@/lib/icons';
import { createClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  /** The workspaceId segment from the URL. When provided, all nav links
   *  are scoped to /workspaces/{workspaceId}/... When it is absent (the
   *  top-level /workspaces list) those destinations do not exist, so the
   *  links render disabled rather than pointing at a 404. */
  workspaceId?: string;
  pendingCount?: number;
}

const NO_WORKSPACE_HINT = 'Select a workspace first';

/**
 * One workspace-scoped nav row. Inside a workspace it is a real link; on a
 * top-level route it is a visibly disabled row with a tooltip explaining why,
 * so nothing looks clickable that would land on a page that does not exist.
 */
function NavItem({
  href,
  className,
  icon,
  label,
  badge,
  disabled,
}: {
  href: string;
  className: string;
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
  disabled: boolean;
}) {
  return (
    <li className="nav-item">
      {disabled ? (
        <span aria-disabled="true" title={NO_WORKSPACE_HINT} className={`${className} nav-link-disabled`}>
          <span className="nav-icon opacity-80">{icon}</span>
          <span className="nav-text">{label}</span>
        </span>
      ) : (
        <Link href={href} className={className}>
          <span className="nav-icon opacity-80">{icon}</span>
          <span className="nav-text">{label}</span>
          {badge}
        </Link>
      )}
    </li>
  );
}

export function Sidebar({ workspaceId, pendingCount }: SidebarProps) {
  const pathname = usePathname() || '';
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  /** Build an absolute path, workspace-scoped when workspaceId is known. */
  const href = (segment: string) => `/workspaces/${workspaceId}/${segment}`;

  const isActive = (segment: string) => pathname.includes(segment);

  const getLinkClasses = (segment: string, exactMatch = false) => {
    const active = exactMatch ? pathname === segment : isActive(segment);
    return `nav-link flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${active
        ? 'bg-[#007F73]/10 text-[#00A99D] font-medium border border-[#00A99D]/30 shadow-[0_0_15px_rgba(0,169,157,0.15)]'
        : 'text-slate-100/80 hover:bg-white/5 hover:text-white border border-transparent'
      }`;
  };

  /** Props for one workspace-scoped nav row, link or disabled. These are
   *  spread into sibling JSX elements, so no `key` belongs in here. */
  const navItem = (segment: string, icon: React.ReactNode, label: string, badge?: React.ReactNode) => ({
    icon,
    label,
    badge,
    className: getLinkClasses(segment),
    href: workspaceId ? href(segment) : '',
    disabled: !workspaceId,
  });

  return (
    <aside className="app-sidebar text-slate-50 border-r flex flex-col" style={{ borderColor: 'rgba(255,255,255,0.1)' }} id="app-sidebar">
      {/* Sidebar Brand */}
      <div className="sidebar-brand-wrapper">
        <Link href={workspaceId ? href('dashboard') : '/workspaces'} className="sidebar-brand">
          <div className="sidebar-brand-logo-container" style={{ width: '180px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

        </Link>
      </div>

      {/* Primary Action Button */}
      <div className="sidebar-action-wrapper p-4">
        {workspaceId ? (
          <Link href={href('composer')} className="btn-create-post flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 text-white py-2.5 px-4 rounded-xl transition-colors shadow-sm font-medium" id="btn-sidebar-create-post" style={{ textDecoration: 'none' }}>
            <span className="btn-icon">{icons.plus}</span>
            <span className="btn-text">Create Post</span>
          </Link>
        ) : (
          <button
            type="button"
            disabled
            title={NO_WORKSPACE_HINT}
            className="btn-create-post nav-link-disabled flex items-center justify-center gap-2 bg-teal-700 text-white py-2.5 px-4 rounded-xl shadow-sm font-medium w-full"
            id="btn-sidebar-create-post"
          >
            <span className="btn-icon">{icons.plus}</span>
            <span className="btn-text">Create Post</span>
          </button>
        )}
      </div>

      {/* Navigation Menu Items */}
      <nav className="sidebar-nav flex-1 overflow-y-auto px-3 py-2">
        <ul className="nav-list flex flex-col gap-1">
          <NavItem {...navItem('dashboard', icons.dashboard, 'Dashboard')} />
          <NavItem {...navItem('composer', icons.composer, 'Composer')} />
          <NavItem {...navItem('calendar', icons.calendar, 'Calendar')} />
          <NavItem
            {...navItem(
              'approvals',
              icons.approvals,
              'Approvals',
              pendingCount && pendingCount > 0 ? (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold py-0.5 px-2 rounded-full">
                  {pendingCount}
                </span>
              ) : null
            )}
          />
          <NavItem {...navItem('accounts', icons.accounts, 'Accounts')} />
          <li className="nav-item">
            <Link href="/workspaces" className={getLinkClasses('/workspaces', true)}>
              <span className="nav-icon opacity-80">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </span>
              <span className="nav-text">All Workspaces</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Sidebar Footer — simple logout */}
      <div className="sidebar-footer border-t border-white/10 p-3">
        <button
          id="btn-sidebar-logout"
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-300 transition-colors duration-150 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={16} className="flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
