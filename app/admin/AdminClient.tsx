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
    if (!glyph) return <span className="inline-flex items-center justify-center w-4 h-4 text-slate-500">{icons.dashboard}</span>;
    return <span className="inline-flex items-center justify-center w-4 h-4 opacity-80">{glyph}</span>;
  };

  const TrendIndicator = ({ value }: { value: number }) => {
    if (value === 0) return <div className="flex items-center text-xs font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md gap-1">{icons.minus} 0%</div>;
    return (
      <div className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded-md gap-1 ${value > 0 ? 'text-teal-700 bg-teal-50' : 'text-red-700 bg-red-50'}`}>
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
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900 bg-slate-50 min-h-screen font-sans">
      
      {/* Header & Global Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good Morning, Laraib 👋</h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening with your workspaces today.</p>
        </div>
        <div className="flex bg-slate-200/70 p-1 rounded-full overflow-x-auto w-full md:w-auto hide-scrollbar">
          {['today', '7d', '30d', '3m'].map(r => (
            <button 
              key={r} 
              className={`flex-1 md:flex-none text-sm font-medium px-4 py-1.5 rounded-full transition-all whitespace-nowrap ${
                range === r 
                  ? 'bg-white text-teal-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              onClick={() => handleRangeChange(r)}
            >
              {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '3 Months'}
            </button>
          ))}
        </div>
      </div>

      {isGlobalEmpty && (
        <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center shadow-sm">
          <div className="text-slate-300 flex justify-center mb-4 [&>svg]:w-10 [&>svg]:h-10">{icons.dashboard}</div>
          <h2 className="text-lg font-semibold text-slate-900">Welcome to the Admin Dashboard</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto mb-6">
            It looks like there is no activity yet. Create a workspace, connect your accounts, and start scheduling posts to see your global analytics light up.
          </p>
          <div className="flex justify-center">
            <Link href="/workspaces" className="inline-flex items-center gap-2 bg-teal-800 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-teal-900 transition-colors shadow-sm">
              <span className="w-4 h-4">{icons.plus}</span> Create Workspace
            </Link>
          </div>
        </div>
      )}


      {/* 1. Premium Top Overview (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        {[
          { title: 'Workspaces', value: totalWorkspaces, icon: icons.dashboard, color: 'text-teal-700', bg: 'bg-teal-50', trend: trends.workspaces },
          { title: 'Connected Accounts', value: totalConnectedAccounts, icon: icons.accounts, color: 'text-blue-700', bg: 'bg-blue-50', trend: trends.accounts },
          { title: 'Total Posts', value: totalPosts, icon: icons.edit, color: 'text-purple-700', bg: 'bg-purple-50', trend: trends.totalPosts },
          { title: 'Published', value: totalPostsPublished, icon: icons.checkCircle, color: 'text-emerald-700', bg: 'bg-emerald-50', trend: trends.published },
          { title: 'Pending Approval', value: pendingApprovals, icon: icons.clock, color: 'text-amber-700', bg: 'bg-amber-50', trend: trends.pendingApprovals },
          { title: 'Failed Posts', value: failedPosts, icon: icons.xCircle, color: 'text-red-700', bg: 'bg-red-50', trend: trends.failed }
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                <span className="w-4 h-4">{kpi.icon}</span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold tracking-tight">{kpi.value}</div>
              <TrendIndicator value={kpi.trend} />
            </div>
          </div>
        ))}
      </div>

      {/* 2. Proper Analytics Section */}
      {!isGlobalEmpty && (
        <div className="space-y-6">
          
          {/* Row 1: Publishing Overview & Content Status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Publishing Overview (Area Chart) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col w-full max-w-full min-w-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold">Publishing Overview</h3>
                  <p className="text-xs text-slate-500 mt-1">Total posts published across all workspaces</p>
                </div>
                <div className="text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex-shrink-0 self-start sm:self-auto">
                  {range === 'today' ? 'Today' : range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 3 Months'}
                </div>
              </div>
              
              <div className="h-64 sm:h-72 md:h-80 w-full min-w-0 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#005952" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#005952" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                      tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      minTickGap={25}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                      allowDecimals={false}
                      width={35}
                    />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="count" stroke="#005952" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>

                {(!activityChartData || activityChartData.length === 0 || !activityChartData.some(d => d.count > 0)) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[1px] z-10 px-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-3 border border-slate-100 shadow-sm">
                      <span className="w-4 h-4 sm:w-5 sm:h-5">{icons.edit}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 text-center">No publishing activity yet</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-[250px] text-center leading-relaxed">Published posts will appear here once content is published.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Status Breakdown (Donut) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
              <h3 className="text-base font-semibold mb-6">Content Status</h3>
              {statusChartData.length > 0 ? (
                <div className="h-[220px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusChartData} innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="count" stroke="none">
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold">{totalPosts}</span>
                    <span className="text-xs text-slate-500">Posts</span>
                  </div>
                </div>
              ) : (
                <div className="h-[220px] w-full flex items-center justify-center text-slate-400 text-sm">
                  No content data available.
                </div>
              )}
              <div className="mt-6 space-y-3">
                {statusChartData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.name] || CHART_COLORS[i % CHART_COLORS.length] }}></span>
                      <span className="text-slate-600 capitalize">{entry.name.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{entry.count}</span>
                      <span className="text-slate-400 text-xs w-8 text-right">{Math.round((entry.count / totalPosts) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Row 2: Platform Performance & Connected Accounts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Platform Performance */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
              <div>
                <h3 className="text-base font-semibold">Platform Performance</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">Posts published per platform</p>
              </div>
              {platformChartData.length > 0 ? (
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', textTransform: 'capitalize' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {platformChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[280px] w-full flex items-center justify-center text-slate-400 text-sm">
                  No platform data available.
                </div>
              )}
            </div>

            {/* Connected Accounts */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
              <h3 className="text-base font-semibold mb-6">Connected Accounts</h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {Object.keys(globalPlatformDist).length > 0 ? (
                  Object.entries(globalPlatformDist).sort((a,b)=>b[1]-a[1]).map(([platform, count]) => {
                    const max = Math.max(...Object.values(globalPlatformDist));
                    const percentage = (count / max) * 100;
                    return (
                      <div key={platform} className="flex items-center gap-3">
                        <div className="flex items-center gap-2 w-24 flex-shrink-0">
                          {platformGlyph(platform)}
                          <span className="text-sm font-medium capitalize text-slate-700">{platform}</span>
                        </div>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-800 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="text-sm font-semibold text-slate-900 w-8 text-right">
                          {count}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-slate-400 text-sm">No connected accounts.</div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Link href="/accounts" className="text-teal-700 hover:text-teal-900 text-sm font-medium flex items-center gap-1 group">
                  Manage all accounts <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Row 3: Workspace Table & Timeline (Side by Side) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Workspace Overview Table/Cards */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-base font-semibold">Workspace Overview</h3>
                  <p className="text-xs text-slate-500 mt-1">Manage your workspaces and track performance.</p>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4">{icons.search}</span>
                  <input 
                    type="text" 
                    placeholder="Search workspaces..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent w-full sm:w-64"
                  />
                </div>
              </div>
              
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="p-4 cursor-pointer hover:bg-slate-100/50 transition-colors whitespace-nowrap" onClick={() => handleSort('name')}>
                        Workspace {sortField === 'name' && (sortAsc ? '↑' : '↓')}
                      </th>
                      <th className="p-4 cursor-pointer hover:bg-slate-100/50 transition-colors whitespace-nowrap" onClick={() => handleSort('connectedAccounts')}>
                        Accounts {sortField === 'connectedAccounts' && (sortAsc ? '↑' : '↓')}
                      </th>
                      <th className="p-4 cursor-pointer hover:bg-slate-100/50 transition-colors whitespace-nowrap" onClick={() => handleSort('totalPublished')}>
                        Published {sortField === 'totalPublished' && (sortAsc ? '↑' : '↓')}
                      </th>
                      <th className="p-4 cursor-pointer hover:bg-slate-100/50 transition-colors whitespace-nowrap" onClick={() => handleSort('pendingApprovals')}>
                        Pending {sortField === 'pendingApprovals' && (sortAsc ? '↑' : '↓')}
                      </th>
                      <th className="p-4 cursor-pointer hover:bg-slate-100/50 transition-colors whitespace-nowrap" onClick={() => handleSort('failed')}>
                        Failed {sortField === 'failed' && (sortAsc ? '↑' : '↓')}
                      </th>
                      <th className="p-4 whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredWorkspaces.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">No workspaces match your search.</td>
                      </tr>
                    ) : (
                      filteredWorkspaces.map(ws => (
                        <tr key={ws.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {ws.logo_url ? (
                                <img src={ws.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-slate-200" />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 font-bold text-xs flex-shrink-0">
                                  {ws.name.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-medium text-slate-900 truncate">{ws.name}</div>
                                <div className="text-xs text-slate-500 capitalize flex items-center gap-1 mt-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  {ws.status}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-slate-600">{ws.connectedAccounts}</td>
                          <td className="p-4 text-sm font-medium text-slate-900">{ws.totalPublished}</td>
                          <td className="p-4 text-sm">
                            {ws.pendingApprovals > 0 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                                {ws.pendingApprovals}
                              </span>
                            ) : (
                              <span className="text-slate-400">0</span>
                            )}
                          </td>
                          <td className="p-4 text-sm">
                            {ws.failed > 0 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">
                                {ws.failed}
                              </span>
                            ) : (
                              <span className="text-slate-400">0</span>
                            )}
                          </td>
                          <td className="p-4">
                            <Link href={`/workspaces/${ws.id}/dashboard`} className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 rounded-full text-xs font-medium text-teal-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm">
                              Manage →
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden flex flex-col p-4 gap-4 bg-slate-50/50">
                {filteredWorkspaces.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm bg-white rounded-xl border border-slate-100">No workspaces match your search.</div>
                ) : (
                  filteredWorkspaces.map(ws => (
                    <div key={ws.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        {ws.logo_url ? (
                          <img src={ws.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 font-bold text-sm flex-shrink-0">
                            {ws.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{ws.name}</div>
                          <div className="text-xs text-emerald-600 font-medium capitalize mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {ws.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
                        <div>
                          <div className="text-xs text-slate-500 mb-0.5">Accounts</div>
                          <div className="font-medium text-sm text-slate-900">{ws.connectedAccounts}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-0.5">Published</div>
                          <div className="font-medium text-sm text-slate-900">{ws.totalPublished}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-0.5">Pending</div>
                          <div className="font-medium text-sm text-amber-600">{ws.pendingApprovals}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-0.5">Failed</div>
                          <div className="font-medium text-sm text-red-600">{ws.failed}</div>
                        </div>
                      </div>

                      <Link href={`/workspaces/${ws.id}/dashboard`} className="flex w-full items-center justify-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-teal-700 bg-white shadow-sm hover:bg-slate-50 transition-colors">
                        Manage Workspace →
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Recent Activity & CTA */}
            <div className="lg:col-span-4 space-y-6 flex flex-col">
              
              {/* Recent Activity Timeline */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col flex-1">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-base font-semibold">Recent Activity</h3>
                </div>
                <div className="p-5">
                  {recentActivityData.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-sm">No recent activity.</div>
                  ) : (
                    <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                      {recentActivityData.slice(0, 5).map((activity, i) => (
                        <div key={activity.id} className="relative pl-6">
                          <div 
                            className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white"
                            style={{ backgroundColor: STATUS_COLORS[activity.status] || '#005952' }}
                          ></div>
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium text-sm text-slate-900 truncate pr-2">{activity.workspaceName}</div>
                            <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(activity.updated_at).split(',')[1] || formatDate(activity.updated_at)}</span>
                          </div>
                          <div className="text-xs text-slate-600 flex items-center gap-1.5 mb-1.5">
                            {platformGlyph(activity.platform)}
                            <span>Post <span style={{ color: STATUS_COLORS[activity.status] || 'inherit' }} className="font-medium capitalize">{activity.status.replace('_', ' ')}</span></span>
                          </div>
                          {activity.caption && (
                            <div className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-md truncate border border-slate-100">
                              "{activity.caption}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {recentActivityData.length > 5 && (
                  <div className="p-4 border-t border-slate-100 text-center mt-auto">
                    <button className="text-teal-700 hover:text-teal-900 text-sm font-medium">View All Activity →</button>
                  </div>
                )}
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-teal-900 to-teal-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex-shrink-0">
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold mb-2 tracking-tight">Grow Your Brand</h3>
                  <p className="text-teal-50/80 text-sm mb-5 leading-relaxed pr-8">Create, schedule and manage your social media effortlessly with Postly.</p>
                  <Link href="/workspaces" className="inline-flex bg-white text-teal-900 text-sm font-semibold px-4 py-2 rounded-full shadow-sm hover:bg-teal-50 transition-colors">
                    Create Post →
                  </Link>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-teal-600 rounded-full blur-2xl opacity-40"></div>
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-teal-500 rounded-full blur-xl opacity-30"></div>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}
