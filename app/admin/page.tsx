import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminClient } from './AdminClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const range = (searchParams.range as string) || '30d';

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // --- Date Range Calculation ---
  const now = new Date();
  let startDate = new Date(0); // Default to beginning of time
  let endDate = now;

  let prevStartDate = new Date(0);
  let prevEndDate = new Date(0);
  let hasTrend = false;

  if (range === 'today') {
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    hasTrend = true;
    prevEndDate = new Date(startDate);
    prevEndDate.setMilliseconds(-1);
    prevStartDate = new Date(prevEndDate);
    prevStartDate.setHours(0, 0, 0, 0);
  } else if (range === '7d') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
    hasTrend = true;
    prevEndDate = new Date(startDate);
    prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - 7);
  } else if (range === '30d') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);
    hasTrend = true;
    prevEndDate = new Date(startDate);
    prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - 30);
  } else if (range === '3m') {
    startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 3);
    hasTrend = true;
    prevEndDate = new Date(startDate);
    prevStartDate = new Date(startDate);
    prevStartDate.setMonth(prevStartDate.getMonth() - 3);
  } else if (range === 'custom') {
    const customStart = searchParams.start as string;
    const customEnd = searchParams.end as string;
    if (customStart) startDate = new Date(customStart);
    if (customEnd) endDate = new Date(customEnd);
  }

  const dateFilterStr = startDate.toISOString();
  const prevDateFilterStr = prevStartDate.toISOString();
  const prevDateEndStr = prevEndDate.toISOString();

  // 1. Total workspaces (All time)
  const { count: totalWorkspaces } = await supabase
    .from('workspaces')
    .select('id', { count: 'exact', head: true });

  const { count: prevTotalWorkspaces } = hasTrend ? await supabase
    .from('workspaces')
    .select('id', { count: 'exact', head: true })
    .lte('created_at', prevDateEndStr) : { count: 0 };

  // 2. Connected accounts (All time, active)
  const { count: totalConnectedAccounts } = await supabase
    .from('connected_accounts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active');

  const { count: prevConnectedAccounts } = hasTrend ? await supabase
    .from('connected_accounts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')
    .lte('connected_at', prevDateEndStr) : { count: 0 };

  const { count: accountsNeedingAttentionCount } = await supabase
    .from('connected_accounts')
    .select('id', { count: 'exact', head: true })
    .in('status', ['needs_reconnect', 'revoked']);

  // 3. Posts Data within Date Range
  const { data: rangeVariantsRaw } = await supabase
    .from('post_variants')
    .select('id, status, platform, published_at, updated_at')
    .gte('updated_at', dateFilterStr);

  const rangeVariants = rangeVariantsRaw || [];
  
  const totalPosts = rangeVariants.length;
  const totalPostsPublished = rangeVariants.filter(v => v.status === 'published').length;
  const scheduledPosts = rangeVariants.filter(v => v.status === 'pending' || v.status === 'publishing').length; // approximation
  const failedPosts = rangeVariants.filter(v => v.status === 'failed').length;

  const { data: rangePostsRaw } = await supabase
    .from('posts')
    .select('id, status')
    .gte('updated_at', dateFilterStr);
  const pendingApprovals = (rangePostsRaw || []).filter(p => p.status === 'pending_approval').length;

  // Trend Data (Previous Period)
  let prevTotalPosts = 0;
  let prevPublished = 0;
  let prevFailed = 0;
  let prevPendingApprovals = 0;

  if (hasTrend) {
    const { data: prevVariantsRaw } = await supabase
      .from('post_variants')
      .select('id, status')
      .gte('updated_at', prevDateFilterStr)
      .lte('updated_at', prevDateEndStr);
    
    const prevVariants = prevVariantsRaw || [];
    prevTotalPosts = prevVariants.length;
    prevPublished = prevVariants.filter(v => v.status === 'published').length;
    prevFailed = prevVariants.filter(v => v.status === 'failed').length;

    const { data: prevPostsRaw } = await supabase
      .from('posts')
      .select('id, status')
      .gte('updated_at', prevDateFilterStr)
      .lte('updated_at', prevDateEndStr);
    prevPendingApprovals = (prevPostsRaw || []).filter(p => p.status === 'pending_approval').length;
  }

  const calculateTrend = (current: number, prev: number) => {
    if (!hasTrend || prev === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - prev) / prev) * 100);
  };

  const trends = {
    workspaces: calculateTrend(totalWorkspaces || 0, prevTotalWorkspaces || 0),
    accounts: calculateTrend(totalConnectedAccounts || 0, prevConnectedAccounts || 0),
    totalPosts: calculateTrend(totalPosts, prevTotalPosts),
    published: calculateTrend(totalPostsPublished, prevPublished),
    failed: calculateTrend(failedPosts, prevFailed),
    pendingApprovals: calculateTrend(pendingApprovals, prevPendingApprovals),
  };

  // 6. Data for per-platform breakdown chart
  const platformCounts: Record<string, number> = {};
  rangeVariants.forEach((v) => {
    if (v.status === 'published') {
      platformCounts[v.platform] = (platformCounts[v.platform] || 0) + 1;
    }
  });
  
  const platformChartData = Object.entries(platformCounts).map(([name, count]) => ({
    name,
    count,
  }));

  // 6b. Content Status Breakdown (Donut Chart)
  const statusCounts: Record<string, number> = {
    draft: 0,
    pending_approval: pendingApprovals,
    scheduled: scheduledPosts,
    published: totalPostsPublished,
    failed: failedPosts,
    rejected: 0, // Need rejected variants? Not explicitly in variants usually, but maybe posts
  };
  (rangePostsRaw || []).forEach(p => {
    if (p.status === 'draft') statusCounts.draft++;
    if (p.status === 'rejected' || p.status === 'cancelled') statusCounts.rejected++;
  });
  const statusChartData = Object.entries(statusCounts).map(([name, count]) => ({
    name,
    count
  })).filter(d => d.count > 0);

  // 7. Data for activity over time chart (within range)
  const dayCount = range === 'today' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : range === '3m' ? 90 : 30; // default 30
  
  const activityOverTime: Record<string, number> = {};
  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const localDateStr = `${year}-${month}-${day}`;
    activityOverTime[localDateStr] = 0;
  }

  rangeVariants.forEach((v) => {
    if (v.status === 'published') {
      const dateVal = v.published_at || v.updated_at;
      if (dateVal) {
        const d = new Date(dateVal);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const localDateStr = `${year}-${month}-${day}`;
        if (activityOverTime[localDateStr] !== undefined) {
          activityOverTime[localDateStr]++;
        } else {
          activityOverTime[localDateStr] = 1;
        }
      }
    }
  });

  const activityChartData = Object.entries(activityOverTime)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({
      date,
      count,
    }));

  console.log("--- DEBUG START ---");
  console.log("Total Posts Published:", totalPostsPublished);
  console.log("Filtered Published Posts length:", rangeVariants.filter(v => v.status === 'published').length);
  console.log("Activity Chart Data (non-zero):", activityChartData.filter(d => d.count > 0));
  console.log("--- DEBUG END ---");

  try {
    const fs = require('fs');
    fs.writeFileSync('./scratch_debug_payload.json', JSON.stringify({
      totalPostsPublished,
      activityChartData,
      rangeVariants: rangeVariants.filter(v => v.status === 'published')
    }, null, 2));
  } catch(e) {}

  // 8. Per-workspace breakdown table data (All-time context for table)
  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id, name, logo_url, brand_color, status');
    
  const { data: allAccounts } = await supabase
    .from('connected_accounts')
    .select('workspace_id, id, platform, status');

  const { data: allPosts } = await supabase
    .from('posts')
    .select('id, workspace_id, status');

  const { data: allVariants } = await supabase
    .from('post_variants')
    .select('post_id, platform, status');

  const postToWorkspace: Record<string, string> = {};
  (allPosts || []).forEach((p) => {
    postToWorkspace[p.id] = p.workspace_id;
  });

  const workspaceStats: Record<string, any> = {};
  (workspaces || []).forEach((w) => {
    workspaceStats[w.id] = {
      id: w.id,
      name: w.name,
      logo_url: w.logo_url,
      status: w.status || 'active',
      connectedAccounts: 0,
      totalPublished: 0,
      scheduled: 0,
      pendingApprovals: 0,
      failed: 0,
      platforms: {},
      lastActivity: new Date(0).toISOString()
    };
  });

  const globalPlatformDist: Record<string, number> = {};

  (allAccounts || []).forEach((a) => {
    if (workspaceStats[a.workspace_id] && a.status === 'active') {
      workspaceStats[a.workspace_id].connectedAccounts++;
      globalPlatformDist[a.platform] = (globalPlatformDist[a.platform] || 0) + 1;
    }
  });

  (allPosts || []).forEach((p) => {
    if (p.status === 'pending_approval' && workspaceStats[p.workspace_id]) {
      workspaceStats[p.workspace_id].pendingApprovals++;
    }
  });

  (allVariants || []).forEach((v) => {
    const wsId = postToWorkspace[v.post_id];
    if (wsId && workspaceStats[wsId]) {
      if (v.status === 'published') {
        workspaceStats[wsId].totalPublished++;
        workspaceStats[wsId].platforms[v.platform] = (workspaceStats[wsId].platforms[v.platform] || 0) + 1;
      } else if (v.status === 'pending' || v.status === 'publishing') {
        workspaceStats[wsId].scheduled++;
      } else if (v.status === 'failed') {
        workspaceStats[wsId].failed++;
      }
    }
  });

  const workspaceTableData = Object.values(workspaceStats).sort((a, b) => b.totalPublished - a.totalPublished);

  // 9. Global Recent Activity Feed
  const { data: recentVariants } = await supabase
    .from('post_variants')
    .select(`
      id,
      platform,
      caption,
      status,
      updated_at,
      posts!inner (
        workspace_id,
        workspaces!inner (
          name
        )
      )
    `)
    .in('status', ['published', 'failed', 'cancelled'])
    .order('updated_at', { ascending: false })
    .limit(20);

  const recentActivityData = (recentVariants || []).map((v: any) => ({
    id: v.id,
    platform: v.platform,
    caption: v.caption,
    status: v.status,
    updated_at: v.updated_at,
    workspaceName: v.posts?.workspaces?.name || 'Unknown',
    workspaceId: v.posts?.workspace_id,
  }));

  // 10. Accounts needing attention (Global)
  const { data: attentionAccountsRaw } = await supabase
    .from('connected_accounts')
    .select(`
      id,
      platform,
      account_name,
      status,
      workspace_id,
      workspaces!inner (
        name
      )
    `)
    .in('status', ['needs_reconnect', 'revoked']);

  const attentionAccounts = (attentionAccountsRaw || []).map((a: any) => ({
    id: a.id,
    platform: a.platform,
    account_name: a.account_name,
    status: a.status,
    workspaceId: a.workspace_id,
    workspaceName: a.workspaces?.name || 'Unknown',
  }));

  const payload = {
    range,
    trends,
    totalWorkspaces: totalWorkspaces || 0,
    totalConnectedAccounts: totalConnectedAccounts || 0,
    accountsNeedingAttentionCount: accountsNeedingAttentionCount || 0,
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
    globalPlatformDist,
  };

  const { AppShell } = await import('@/components/app-shell');

  return (
    <AppShell workspaces={workspaces || []}>
      <AdminClient data={payload} />
    </AppShell>
  );
}
