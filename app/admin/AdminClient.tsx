'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { icons } from '@/lib/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type PlatformCount = { name: string; count: number };
type DateCount = { date: string; count: number };
type StatusCount = { name: string; count: number };

type WorkspaceRow = {
  id: string;
  name: string;
  logo_url?: string;
  status: string;
  connectedAccounts: number;
  totalPublished: number;
  scheduled: number;
  pendingApprovals: number;
  failed: number;
  platforms: Record<string, number>;
  lastActivity: string;
};

type RecentActivity = {
  id: string;
  platform: string;
  caption: string;
  status: string;
  updated_at: string;
  workspaceName: string;
  workspaceId: string;
};

type AttentionAccount = {
  id: string;
  platform: string;
  account_name: string;
  status: string;
  workspaceId: string;
  workspaceName: string;
};

type AdminData = {
  range: string;
  trends: Record<string, number>;
  totalWorkspaces: number;
  totalConnectedAccounts: number;
  accountsNeedingAttentionCount: number;
  totalPosts: number;
  totalPostsPublished: number;
  scheduledPosts: number;
  pendingApprovals: number;
  failedPosts: number;
  platformChartData: PlatformCount[];
  statusChartData: StatusCount[];
  activityChartData: DateCount[];
  workspaceTableData: WorkspaceRow[];
  recentActivityData: RecentActivity[];
  attentionAccounts: AttentionAccount[];
  globalPlatformDist: Record<string, number>;
};

const CHART_COLORS = ['#007F73', '#005952', '#00A99D', '#0F5132', '#10b981', '#fbbf24', '#ef4444'];
const STATUS_COLORS: Record<string, string> = {
  published: '#10b981',
  scheduled: '#0ea5e9',
  pending_approval: '#fbbf24',
  draft: '#64748b',
  failed: '#ef4444',
  rejected: '#f43f5e'
};

export function AdminClient({ data }: { data: AdminData }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof WorkspaceRow>('totalPublished');
  const [sortAsc, setSortAsc] = useState(false);

  const {
    range,
    trends,
    totalWorkspaces,
    totalConnectedAccounts,
    accountsNeedingAttentionCount,
    totalPosts,
    totalPostsPublished,
    scheduledPosts,
    pendingApprovals,
    failedPosts,
    platformChartData,
    statusChartData,
    activityChartData,
    workspaceTableData,
    recentActivityData,
    attentionAccounts,
    globalPlatformDist
  } = data;

  const handleRangeChange = (newRange: string) => {
    router.push(`/admin?range=${newRange}`);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(date);
    } catch { return isoString; }
  };

  const platformGlyph = (platform: string) => {
    const glyph = (icons as any)[platform.toLowerCase()];
    if (!glyph) return <span className="cal-inline-icon">{icons.dashboard}</span>;
    return <span className="cal-inline-icon opacity-80" style={{ width: 14, height: 14 }}>{glyph}</span>;
  };

  const TrendIndicator = ({ value }: { value: number }) => {
    if (value === 0) return <div className="kpi-card-trend trend-neutral">{icons.minus} 0%</div>;
    return (
      <div className={`kpi-card-trend ${value > 0 ? 'trend-up' : 'trend-down'}`}>
        {value > 0 ? icons.arrowUp : icons.arrowDown} {Math.abs(value)}%
      </div>
    );
  };

  const filteredWorkspaces = useMemo(() => {
    let ws = [...workspaceTableData];
    if (search) {
      const s = search.toLowerCase();
      ws = ws.filter(w => w.name.toLowerCase().includes(s));
    }
    ws.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return ws;
  }, [workspaceTableData, search, sortField, sortAsc]);

  const handleSort = (field: keyof WorkspaceRow) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  const isGlobalEmpty = totalPosts === 0 && totalWorkspaces <= 1 && totalConnectedAccounts === 0;

  return (
    <div className="page-content-wrapper" style={{ paddingBottom: 64 }}>
      {/* Header & Global Filters */}
      <div className="cal-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-main-title">Admin Dashboard</h1>
          <p className="text-slate-500 mt-2 text-sm">Cross-workspace analytics and mission control.</p>
        </div>
        <div className="admin-date-filter">
          {['today', '7d', '30d', '3m'].map(r => (
            <button 
              key={r} 
              className={`admin-date-btn ${range === r ? 'active' : ''}`}
              onClick={() => handleRangeChange(r)}
            >
              {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '3 Months'}
            </button>
          ))}
        </div>
      </div>

      {isGlobalEmpty && (
        <div className="empty-state-card" style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#fff', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-xl)', marginBottom: 32 }}>
          <div style={{ color: 'var(--text-light)', marginBottom: 16 }}>{icons.dashboard}</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)' }}>Welcome to the Admin Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8, maxWidth: 500, margin: '8px auto 24px' }}>
            It looks like there is no activity yet. Create a workspace, connect your accounts, and start scheduling posts to see your global analytics light up.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/workspaces" className="quick-action-btn quick-action-primary">
              {icons.plus} Create Workspace
            </Link>
          </div>
        </div>
      )}


      {/* 1. Premium Top Overview (KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Workspaces</span>
            <div className="kpi-card-icon">{icons.dashboard}</div>
          </div>
          <div className="kpi-card-value">{totalWorkspaces}</div>
          <TrendIndicator value={trends.workspaces} />
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Connected Accounts</span>
            <div className="kpi-card-icon">{icons.accounts}</div>
          </div>
          <div className="kpi-card-value">{totalConnectedAccounts}</div>
          <TrendIndicator value={trends.accounts} />
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Posts</span>
            <div className="kpi-card-icon">{icons.edit}</div>
          </div>
          <div className="kpi-card-value">{totalPosts}</div>
          <TrendIndicator value={trends.totalPosts} />
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Published</span>
            <div className="kpi-card-icon" style={{ color: '#10b981', background: '#ecfdf5' }}>{icons.checkCircle}</div>
          </div>
          <div className="kpi-card-value">{totalPostsPublished}</div>
          <TrendIndicator value={trends.published} />
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Pending Approval</span>
            <div className="kpi-card-icon" style={{ color: '#fbbf24', background: '#fef3c7' }}>{icons.clock}</div>
          </div>
          <div className="kpi-card-value">{pendingApprovals}</div>
          <TrendIndicator value={trends.pendingApprovals} />
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Failed Posts</span>
            <div className="kpi-card-icon" style={{ color: '#ef4444', background: '#fef2f2' }}>{icons.xCircle}</div>
          </div>
          <div className="kpi-card-value">{failedPosts}</div>
          <TrendIndicator value={trends.failed} />
        </div>
      </div>

      {/* 2. Proper Analytics Section */}
      {!isGlobalEmpty && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, marginBottom: 32 }}>
          
          {/* Publishing Overview (Area Chart) */}
          <div className="cni-card" style={{ gridColumn: 'span 8', padding: 24, backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Publishing Overview</h3>
            {activityChartData.length > 0 && activityChartData.some(d => d.count > 0) ? (
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--cni-teal-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--cni-teal-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="count" stroke="var(--cni-teal-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No publishing activity in this period.
              </div>
            )}
          </div>

          {/* Content Status Breakdown (Donut) */}
          <div className="cni-card" style={{ gridColumn: 'span 4', padding: 24, backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Content Status</h3>
            {statusChartData.length > 0 ? (
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusChartData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="count">
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No content data available.
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 16 }}>
              {statusChartData.map((entry, i) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: STATUS_COLORS[entry.name] || CHART_COLORS[i % CHART_COLORS.length] }}></span>
                  {entry.name.replace('_', ' ')}
                </div>
              ))}
            </div>
          </div>

          {/* Platform Performance */}
          <div className="cni-card" style={{ gridColumn: 'span 8', padding: 24, backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Platform Performance</h3>
            {platformChartData.length > 0 ? (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} textAnchor="end" height={60} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {platformChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No platform data available.
              </div>
            )}
          </div>

          {/* Platform Distribution */}
          <div className="cni-card" style={{ gridColumn: 'span 4', padding: 24, backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Connected Accounts</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {Object.keys(globalPlatformDist).length > 0 ? (
                Object.entries(globalPlatformDist).sort((a,b)=>b[1]-a[1]).map(([platform, count]) => {
                  const max = Math.max(...Object.values(globalPlatformDist));
                  const percentage = (count / max) * 100;
                  return (
                    <div key={platform} className="platform-dist-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 90 }}>
                        {platformGlyph(platform)}
                        <span style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{platform}</span>
                      </div>
                      <div className="platform-progress-bg">
                        <div className="platform-progress-fill" style={{ width: `${percentage}%`, backgroundColor: 'var(--cni-teal-primary)' }}></div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', width: 24, textAlign: 'right' }}>
                        {count}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No connected accounts.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4 & 5. Workspace Table & Timeline (Side by Side) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, alignItems: 'start' }}>
        
        {/* Workspace Overview Table */}
        <div className="admin-table-wrapper" style={{ gridColumn: 'span 8' }}>
          <div className="admin-table-toolbar">
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Workspace Overview</h3>
            <div className="search-input-wrapper">
              {icons.search}
              <input 
                type="text" 
                placeholder="Search workspaces..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Workspace {sortField === 'name' && (sortAsc ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('connectedAccounts')}>Accounts {sortField === 'connectedAccounts' && (sortAsc ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('totalPublished')}>Published {sortField === 'totalPublished' && (sortAsc ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('pendingApprovals')}>Pending {sortField === 'pendingApprovals' && (sortAsc ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('failed')}>Failed {sortField === 'failed' && (sortAsc ? '↑' : '↓')}</th>
                <th>Platforms</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkspaces.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>No workspaces match your search.</td>
                </tr>
              ) : (
                filteredWorkspaces.map(ws => (
                  <tr key={ws.id}>
                    <td style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}>
                      {ws.logo_url ? (
                        <img src={ws.logo_url} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: 'var(--cni-teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cni-teal-primary)', fontWeight: 'bold', fontSize: 11 }}>
                          {ws.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div>{ws.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400, marginTop: 2 }}>{ws.status}</div>
                      </div>
                    </td>
                    <td>{ws.connectedAccounts}</td>
                    <td style={{ fontWeight: 600 }}>{ws.totalPublished}</td>
                    <td style={{ color: ws.pendingApprovals > 0 ? '#d97706' : 'inherit' }}>{ws.pendingApprovals}</td>
                    <td style={{ color: ws.failed > 0 ? '#ef4444' : 'inherit' }}>{ws.failed}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {Object.entries(ws.platforms).slice(0,3).map(([p, c]) => (
                          <span key={p} title={`${p}: ${c}`} style={{ background: '#f1f5f9', padding: '4px', borderRadius: 4, display: 'flex', alignItems: 'center' }}>
                            {platformGlyph(p)}
                          </span>
                        ))}
                        {Object.keys(ws.platforms).length > 3 && (
                          <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginLeft: 4 }}>+{Object.keys(ws.platforms).length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <Link href={`/workspaces/${ws.id}/dashboard`} style={{ color: 'var(--cni-teal-primary)', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}>
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Activity Timeline */}
        <div className="cni-card" style={{ gridColumn: 'span 4', backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Recent Activity</h3>
          </div>
          <div style={{ padding: 24 }}>
            {recentActivityData.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No recent activity.</div>
            ) : (
              <div className="timeline-container">
                {recentActivityData.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="timeline-item">
                    <div className="timeline-dot" style={{ borderColor: STATUS_COLORS[activity.status] || 'var(--cni-teal-primary)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: STATUS_COLORS[activity.status] || 'var(--cni-teal-primary)' }}></span>
                    </div>
                    <div className="timeline-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-main)' }}>{activity.workspaceName}</div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(activity.updated_at)}</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        {platformGlyph(activity.platform)}
                        <span>Post <strong style={{ color: STATUS_COLORS[activity.status] || 'inherit', textTransform: 'capitalize' }}>{activity.status}</strong></span>
                      </div>
                      {activity.caption && (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', background: '#f8fafc', padding: 8, borderRadius: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          "{activity.caption}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
