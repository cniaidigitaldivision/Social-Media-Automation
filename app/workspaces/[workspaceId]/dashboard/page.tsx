import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { countPendingApprovals } from '@/lib/queries/posts';
import { icons } from '@/lib/icons';

/**
 * /workspaces/[workspaceId]/dashboard
 *
 * Every number, list and trend line on this page comes from a Supabase query
 * scoped to this workspace_id. Nothing here is hardcoded, sampled or
 * placeholder — if a query returns zero rows the panel says so rather than
 * showing a stand-in, and a card with no available history shows no sparkline
 * rather than a decorative one. Each KPI card prints the table and filter it
 * was derived from.
 */

const RECENT_ACTIVITY_STATUSES = ['published', 'failed', 'cancelled'];
const ATTENTION_ACCOUNT_STATUSES = ['needs_reconnect', 'revoked'];
const UPCOMING_LIMIT = 5;
const ACTIVITY_LIMIT = 8;
const FAILED_WINDOW_DAYS = 7;
const ACCOUNT_TREND_WEEKS = 8;
const SCHEDULE_TREND_DAYS = 14;

const POST_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  pending_approval: 'Pending approval',
  scheduled: 'Scheduled',
  publishing: 'Publishing',
  published: 'Published',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

const POST_BADGE_CLASS: Record<string, string> = {
  published: 'badge-published',
  failed: 'badge-failed',
  cancelled: 'badge-draft',
  draft: 'badge-draft',
  pending_approval: 'badge-pending',
  scheduled: 'badge-pending',
  publishing: 'badge-pending',
};

const ACCOUNT_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  needs_reconnect: 'Needs reconnect',
  revoked: 'Revoked',
};

const pad = (n: number) => String(n).padStart(2, '0');

function safeTimeZone(timeZone: string | null | undefined): string {
  if (!timeZone) return 'UTC';
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
    return timeZone;
  } catch {
    return 'UTC';
  }
}

function previewOf(caption: string | null | undefined): string {
  const text = (caption || '').replace(/\s+/g, ' ').trim();
  if (!text) return 'No caption';
  return text.length > 90 ? `${text.slice(0, 90)}…` : text;
}

const isVideo = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url);

function platformGlyph(platform: string) {
  const glyph = (icons as Record<string, React.ReactNode>)[platform];
  return <span className="dash-platform-glyph">{glyph ?? icons.globe}</span>;
}

/** Cumulative account count at the end of each of the last N weeks. */
function weeklyCumulative(isoDates: string[], weeks: number): number[] {
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  const stamps = isoDates.map((iso) => new Date(iso).getTime()).filter((t) => Number.isFinite(t));

  return Array.from({ length: weeks }, (_, index) => {
    const edge = now - (weeks - 1 - index) * week;
    return stamps.filter((t) => t <= edge).length;
  });
}

/** Posts per workspace-local day, starting today. */
function dailyCounts(isoDates: string[], days: number, timeZone: string): number[] {
  const dayKey = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const buckets = new Map<string, number>();
  for (const iso of isoDates) {
    const key = dayKey.format(new Date(iso));
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const [year, month, day] = dayKey.format(new Date()).split('-').map(Number);

  return Array.from({ length: days }, (_, index) => {
    const cursor = new Date(Date.UTC(year, month - 1, day + index));
    const key = `${cursor.getUTCFullYear()}-${pad(cursor.getUTCMonth() + 1)}-${pad(cursor.getUTCDate())}`;
    return buckets.get(key) ?? 0;
  });
}

/**
 * Sparkline drawn from a real series. Renders nothing when the series is flat
 * at zero — an invented trend line is worse than no trend line.
 */
function Sparkline({ series, tone }: { series: number[]; tone: 'navy' | 'gold' | 'blue' }) {
  if (series.length < 2 || series.every((value) => value === 0)) return null;

  const width = 120;
  const height = 30;
  const max = Math.max(...series);
  const step = width / (series.length - 1);

  const points = series.map((value, index) => {
    const x = index * step;
    const y = height - 3 - (value / max) * (height - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const line = `M${points.join(' L')}`;
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg
      className={`dash-sparkline dash-spark-${tone}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className="dash-spark-area" d={area} />
      <path className="dash-spark-line" d={line} />
    </svg>
  );
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const supabase = createClient();

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('name, timezone')
    .eq('id', workspaceId)
    .maybeSingle();

  const timezone = safeTimeZone(workspace?.timezone);
  const now = new Date();
  const nowIso = now.toISOString();
  const failedSinceIso = new Date(now.getTime() - FAILED_WINDOW_DAYS * 86400000).toISOString();
  const trendEndIso = new Date(now.getTime() + SCHEDULE_TREND_DAYS * 86400000).toISOString();

  const postSelection = `
    id,
    status,
    scheduled_at,
    updated_at,
    post_variants (
      id,
      platform,
      caption,
      media_urls,
      status,
      live_url,
      error,
      connected_accounts ( account_name )
    )
  `;

  const [
    activeAccounts,
    attentionAccounts,
    pendingApprovals,
    upcomingCount,
    failedRecently,
    totalPosts,
    upcoming,
    activity,
    accounts,
    accountHistory,
    scheduleHistory,
  ] = await Promise.all([
    // Connected accounts: connected_accounts where status = 'active'
    supabase
      .from('connected_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('status', 'active'),

    // Accounts needing attention: status in ('needs_reconnect','revoked')
    supabase
      .from('connected_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .in('status', ATTENTION_ACCOUNT_STATUSES),

    // Pending approvals: shared helper, same count as the sidebar badge
    countPendingApprovals(workspaceId),

    // Scheduled and still ahead of us
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('status', 'scheduled')
      .gt('scheduled_at', nowIso),

    // Failed variants in the last 7 days (joined back to posts for the workspace scope)
    supabase
      .from('post_variants')
      .select('id, posts!inner(workspace_id)', { count: 'exact', head: true })
      .eq('posts.workspace_id', workspaceId)
      .eq('status', 'failed')
      .gte('updated_at', failedSinceIso),

    // Any post at all — decides whether this is a brand-new workspace
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId),

    // Next few scheduled posts. scheduled_at IS NULL rows are excluded from the
    // view only — they are never modified or removed here.
    supabase
      .from('posts')
      .select(postSelection)
      .eq('workspace_id', workspaceId)
      .eq('status', 'scheduled')
      .not('scheduled_at', 'is', null)
      .gt('scheduled_at', nowIso)
      .order('scheduled_at', { ascending: true })
      .limit(UPCOMING_LIMIT),

    // Recently settled posts
    supabase
      .from('posts')
      .select(postSelection)
      .eq('workspace_id', workspaceId)
      .in('status', RECENT_ACTIVITY_STATUSES)
      .order('updated_at', { ascending: false })
      .limit(ACTIVITY_LIMIT),

    supabase
      .from('connected_accounts')
      .select('id, platform, account_name, status, last_verified_at')
      .eq('workspace_id', workspaceId)
      .order('status', { ascending: true })
      .order('account_name', { ascending: true }),

    // Sparkline source: when each account was connected
    supabase
      .from('connected_accounts')
      .select('connected_at')
      .eq('workspace_id', workspaceId)
      .not('connected_at', 'is', null)
      .order('connected_at', { ascending: true }),

    // Sparkline source: scheduled posts across the next two weeks
    supabase
      .from('posts')
      .select('scheduled_at')
      .eq('workspace_id', workspaceId)
      .eq('status', 'scheduled')
      .not('scheduled_at', 'is', null)
      .gte('scheduled_at', nowIso)
      .lt('scheduled_at', trendEndIso),
  ]);

  for (const [label, result] of [
    ['active accounts', activeAccounts],
    ['accounts needing attention', attentionAccounts],
    ['upcoming count', upcomingCount],
    ['failed variants', failedRecently],
    ['total posts', totalPosts],
    ['upcoming posts', upcoming],
    ['recent activity', activity],
    ['connected accounts', accounts],
    ['account trend', accountHistory],
    ['schedule trend', scheduleHistory],
  ] as Array<[string, { error: unknown }]>) {
    if (result?.error) console.error(`[Dashboard] ${label} query failed:`, result.error);
  }

  const activeAccountCount = activeAccounts.count ?? 0;
  const attentionAccountCount = attentionAccounts.count ?? 0;
  const upcomingPostCount = upcomingCount.count ?? 0;
  const failedVariantCount = failedRecently.count ?? 0;
  const totalPostCount = totalPosts.count ?? 0;

  const upcomingPosts = (upcoming.data || []) as any[];
  const activityPosts = (activity.data || []) as any[];
  const accountRows = (accounts.data || []) as any[];

  const accountTrend = weeklyCumulative(
    ((accountHistory.data || []) as any[]).map((row) => row.connected_at),
    ACCOUNT_TREND_WEEKS
  );
  const scheduleTrend = dailyCounts(
    ((scheduleHistory.data || []) as any[]).map((row) => row.scheduled_at),
    SCHEDULE_TREND_DAYS,
    timezone
  );

  const stampFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
  });
  const monthFormatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone, month: 'short' });
  const dayFormatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone, day: '2-digit' });
  const monthKeyFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
  });

  const calendarMonthHref = (iso: string) => {
    const parts = monthKeyFormatter.formatToParts(new Date(iso));
    const year = parts.find((p) => p.type === 'year')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    return `/workspaces/${workspaceId}/calendar?month=${year}-${month}`;
  };

  const accountsHref = `/workspaces/${workspaceId}/accounts`;
  const composerHref = `/workspaces/${workspaceId}/composer`;
  const approvalsHref = `/workspaces/${workspaceId}/approvals`;
  const calendarHref = `/workspaces/${workspaceId}/calendar`;

  const isBrandNew = totalPostCount === 0 && accountRows.length === 0;

  const accountNamesOf = (variants: any[]) =>
    variants.length === 0
      ? 'No platform variants'
      : variants.map((v) => v.connected_accounts?.account_name || v.platform).join(', ');

  return (
    <div className="dash-page page-content-wrapper">
      <div className="dash-page-header">
        <div>
          <h1 className="dash-title page-main-title">Dashboard</h1>
          <p className="dash-subtitle" style={{ fontSize: '13px', color: '#64748B', marginTop: '6px', fontWeight: 500 }}>
            {workspace?.name || 'Workspace'} <span style={{ opacity: 0.5, margin: '0 4px' }}>•</span> Times shown in {timezone}
          </p>
        </div>
        <Link href={composerHref} className="btn-new-post-header dash-header-cta">
          New post
        </Link>
      </div>

      {isBrandNew ? (
        <div className="dash-card dash-getstarted">
          <h2 className="panel-title">Get started</h2>
          <p className="dash-getstarted-text">
            This workspace has no connected accounts and no posts yet, so there is nothing to
            measure. Connect a Facebook or Instagram account first, then write your first post —
            the numbers here fill in on their own.
          </p>
          <div className="dash-getstarted-actions">
            <Link href={accountsHref} className="btn-new-post-header dash-header-cta">
              Connect an account
            </Link>
            <Link href={composerHref} className="btn-open-calendar dash-getstarted-secondary">
              Create your first post
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="dash-metrics-grid">
            <Link href={accountsHref} className="dash-card dash-metric-card">
              <div className="dash-metric-head">
                <span className="dash-metric-label">Connected accounts</span>
                <span className="dash-metric-icon tint-blue">{icons.accounts}</span>
              </div>
              <div className="dash-metric-value-row">
                <span className="dash-metric-number">{activeAccountCount}</span>
              </div>
            </Link>



            <Link href={approvalsHref} className="dash-card dash-metric-card">
              <div className="dash-metric-head">
                <span className="dash-metric-label">Pending approvals</span>
                <span className="dash-metric-icon tint-purple">{icons.approvals}</span>
              </div>
              <div className="dash-metric-value-row">
                <span className="dash-metric-number">{pendingApprovals}</span>
              </div>
            </Link>

            <Link href={calendarHref} className="dash-card dash-metric-card">
              <div className="dash-metric-head">
                <span className="dash-metric-label">Scheduled ahead</span>
                <span className="dash-metric-icon tint-gold">{icons.calendar}</span>
              </div>
              <div className="dash-metric-value-row">
                <span className="dash-metric-number">{upcomingPostCount}</span>
              </div>
            </Link>

            <Link
              href={calendarHref}
              className={`dash-card dash-metric-card${failedVariantCount > 0 ? ' dash-metric-alert' : ''}`}
            >
              <div className="dash-metric-head">
                <span className="dash-metric-label">Failed publishes</span>
                <span className="dash-metric-icon tint-rose">{icons.refresh}</span>
              </div>
              <div className="dash-metric-value-row">
                <span className="dash-metric-number">{failedVariantCount}</span>
                {failedVariantCount > 0 && (
                  <>
                    <span className="kpi-dot-red-pulse" />
                    <span className="btn-review-pill">Needs a look</span>
                  </>
                )}
              </div>
            </Link>
          </div>

          <div className="dash-two-column-layout">
            {/* LEFT COLUMN: Recent Activity */}
            <div className="dash-col-main">
              <section className="dash-card dash-section dash-recent-activity-card">
                <div className="panel-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 className="panel-title" style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>Recent activity</h2>
                  <div className="dash-tabs-container" style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '24px' }}>
                    <span className="dash-tab active" style={{ background: 'rgba(0, 169, 157, 0.2)', color: '#00A99D', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, border: '1px solid rgba(0, 169, 157, 0.3)', boxShadow: '0 0 10px rgba(0, 169, 157, 0.3)' }}>Published</span>
                    <span className="dash-tab" style={{ color: 'rgba(255,255,255,0.5)', padding: '4px 12px', fontSize: '12px', fontWeight: 500 }}>Failed</span>
                    <span className="dash-tab" style={{ color: 'rgba(255,255,255,0.5)', padding: '4px 12px', fontSize: '12px', fontWeight: 500 }}>Cancelled</span>
                  </div>
                </div>

                {activityPosts.length === 0 ? (
                  <p className="dash-empty-note text-slate-400">
                    Nothing has published, failed or been cancelled in this workspace yet.
                  </p>
                ) : (
                  <div className="dash-table-wrap">
                    <table className="dash-table dark-table">
                      <thead>
                        <tr>
                          <th>Post</th>
                          <th>Accounts</th>
                          <th>Status</th>
                          <th>Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityPosts.map((post) => {
                          const variants = (post.post_variants || []) as any[];
                          const first = variants[0];

                          return (
                            <tr key={post.id}>
                              <td>
                                <span className="dash-cell-post">
                                  {platformGlyph(first?.platform || 'globe')}
                                  <span className="dash-cell-caption">{previewOf(first?.caption)}</span>
                                </span>

                                {variants.map((variant) =>
                                  variant.error ? (
                                    <span key={`${variant.id}-error`} className="activity-error-hint">
                                      <span className="dash-inline-icon">{icons.alertCircle}</span>
                                      {variant.platform}: {variant.error}
                                    </span>
                                  ) : null
                                )}

                                {variants.map((variant) =>
                                  variant.live_url ? (
                                    <a
                                      key={`${variant.id}-live`}
                                      className="dash-live-link"
                                      href={variant.live_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <span className="dash-inline-icon">{icons.externalLink}</span>
                                      View live {variant.platform} post
                                    </a>
                                  ) : null
                                )}
                              </td>
                              <td className="dash-cell-muted">{accountNamesOf(variants)}</td>
                              <td>
                                <span className={`status-badge ${POST_BADGE_CLASS[post.status] || 'badge-draft'}`}>
                                  {POST_STATUS_LABELS[post.status] || post.status}
                                </span>
                              </td>
                              <td className="dash-cell-muted dash-cell-nowrap">
                                {stampFormatter.format(new Date(post.updated_at))}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN: Upcoming & Health */}
            <div className="dash-col-side">
              <section className="dash-card dash-section dash-upcoming-card-wrapper" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0', borderRadius: '20px' }}>
                <div className="panel-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
                  <h2 className="panel-title" style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
                    <span style={{ color: 'var(--cni-teal-primary)', display: 'flex', alignItems: 'center', width: '18px', height: '18px' }}>
                      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </span>
                    Upcoming posts
                  </h2>
                  <Link href={calendarHref} className="dash-text-link" style={{ fontSize: '13px', color: 'var(--cni-teal-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    Calendar <span style={{ marginLeft: '2px' }}>→</span>
                  </Link>
                </div>

                {upcomingPosts.length === 0 ? (
                  <p className="dash-empty-note">
                    No scheduled posts ahead. Anything you schedule in the Composer shows up here.
                  </p>
                ) : (
                  <div className="dash-upcoming-rail vertical">
                    {upcomingPosts.map((post) => {
                      const variants = (post.post_variants || []) as any[];
                      const first = variants[0];
                      const scheduled = new Date(post.scheduled_at);

                      return (
                        <div key={post.id} className="dash-upcoming-preview-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', marginBottom: '12px', background: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {platformGlyph(first?.platform || 'globe')}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{monthFormatter.format(scheduled)} {dayFormatter.format(scheduled)}, {scheduled.getFullYear()}, {timeFormatter.format(scheduled)}</span>
                                <span style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{accountNamesOf(variants)}</span>
                              </div>
                            </div>
                            <Link href={calendarMonthHref(post.scheduled_at)} style={{ color: '#94A3B8', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                              <span style={{ fontSize: '18px', fontWeight: 300 }}>›</span>
                            </Link>
                          </div>
                          <div style={{ fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                            {previewOf(first?.caption)}
                          </div>
                        </div>
                      );
                    })}
                    <Link href={calendarHref} className="btn-new-post-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', marginTop: '12px', padding: '12px', borderRadius: '12px', textDecoration: 'none' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      Open calendar
                    </Link>
                  </div>
                )}
              </section>

              <section className="dash-card dash-section dash-health-card-wrapper" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0', borderRadius: '20px' }}>
                <div className="panel-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
                  <h2 className="panel-title" style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
                    <span style={{ color: 'var(--cni-teal-primary)', display: 'flex', alignItems: 'center', width: '18px', height: '18px' }}>
                      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </span>
                    Account health
                  </h2>
                  <Link href={accountsHref} className="dash-text-link" style={{ fontSize: '13px', color: 'var(--cni-teal-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    Manage <span style={{ marginLeft: '2px' }}>→</span>
                  </Link>
                </div>

                {accountRows.length === 0 ? (
                  <p className="dash-empty-note">
                    No connected accounts yet.{' '}
                    <Link href={accountsHref} className="dash-inline-link">
                      Connect one
                    </Link>{' '}
                    to start publishing.
                  </p>
                ) : (
                  <div className="dash-account-list">
                    {accountRows.map((account, idx) => {
                      const healthy = account.status === 'active';
                      return (
                        <div key={account.id} className="dash-account-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: idx === accountRows.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                          <span className="dash-account-name" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 500, color: '#0F172A' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {platformGlyph(account.platform)}
                            </div>
                            {account.account_name || 'Unnamed account'}
                          </span>
                          <span className="dash-account-right">
                            {healthy ? (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.8)' }}></span>
                                Active
                              </span>
                            ) : (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(239,68,68,0.2)' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 6px rgba(239,68,68,0.8)' }}></span>
                                {ACCOUNT_STATUS_LABELS[account.status] || account.status}
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
