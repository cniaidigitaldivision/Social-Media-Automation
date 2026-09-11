'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { icons } from '@/lib/icons';
import { approvePost, rejectPost } from '../approvals/actions';

export type VariantView = {
  id: string;
  platform: string;
  accountName: string;
  status: string;
  caption: string;
  mediaUrls: string[];
  liveUrl: string | null;
  error: string | null;
  publishedAtLabel: string | null;
};

export type PostView = {
  id: string;
  status: string;
  dayKey: string;
  timeLabel: string;
  stampLabel: string;
  preview: string;
  variants: VariantView[];
};

export type DayCell = {
  key: string;
  dayNumber: number;
  inMonth: boolean;
  isToday: boolean;
  label: string;
};

type Props = {
  workspaceId: string;
  timezone: string;
  monthLabel: string;
  monthKey: string;
  prevMonthKey: string;
  nextMonthKey: string;
  todayMonthKey: string;
  showCancelled: boolean;
  /** Statuses the chips can offer — depends on the "Show cancelled" toggle. */
  statusesInScope: string[];
  /** Statuses currently switched on. Drives the ?status= param and the query. */
  selectedStatuses: string[];
  days: DayCell[];
  postsByDay: Record<string, PostView[]>;
  totalPosts: number;
  loadFailed: boolean;
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const POST_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  pending_approval: 'Pending approval',
  scheduled: 'Scheduled',
  publishing: 'Publishing',
  published: 'Published',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

const VARIANT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  publishing: 'Publishing',
  published: 'Published',
  failed: 'Failed',
};

const LEGEND: Array<{ status: string; label: string }> = [
  { status: 'draft', label: 'Draft' },
  { status: 'pending_approval', label: 'Pending approval' },
  { status: 'scheduled', label: 'Scheduled' },
  { status: 'publishing', label: 'Publishing' },
  { status: 'published', label: 'Published' },
  { status: 'failed', label: 'Failed' },
  { status: 'cancelled', label: 'Cancelled' },
];

const MAX_PILLS_PER_DAY = 3;

const isVideo = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url);

function platformGlyph(platform: string) {
  const glyph = (icons as Record<string, React.ReactNode>)[platform];
  if (!glyph) return null;
  return <span className="cal-platform-glyph">{glyph}</span>;
}

export function CalendarClient({
  workspaceId,
  timezone,
  monthLabel,
  monthKey,
  prevMonthKey,
  nextMonthKey,
  todayMonthKey,
  showCancelled,
  statusesInScope,
  selectedStatuses,
  days,
  postsByDay,
  totalPosts,
  loadFailed,
}: Props) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const basePath = `/workspaces/${workspaceId}/calendar`;

  const selected = new Set(selectedStatuses);
  const allSelected = statusesInScope.every((status) => selected.has(status));

  const scopeOf = (cancelled: boolean) =>
    LEGEND.map((entry) => entry.status).filter((status) => cancelled || status !== 'cancelled');

  /**
   * Every control on this page is a plain link that rewrites the query string,
   * so navigation, the cancelled toggle and the status chips all stay
   * shareable and server-rendered.
   *
   * `statuses` omitted  -> keep whatever is selected now
   * `statuses` = all    -> drop ?status= entirely (the "everything" default)
   * `statuses` = []     -> ?status= (explicitly nothing selected)
   */
  const hrefFor = (
    month: string,
    cancelled: boolean = showCancelled,
    statuses: string[] = selectedStatuses,
  ) => {
    const scope = scopeOf(cancelled);
    const next = scope.filter((status) => statuses.includes(status));
    const params = [`month=${month}`];
    if (cancelled) params.push('cancelled=1');
    // Only pin ?status= when it actually narrows the scope.
    if (next.length !== scope.length) params.push(`status=${next.join(',')}`);
    return `${basePath}?${params.join('&')}`;
  };

  // Flipping "Show cancelled" keeps the other chips as they are and just
  // adds/removes Cancelled from the selection.
  const hrefForCancelledToggle = () =>
    hrefFor(monthKey, !showCancelled, showCancelled ? selectedStatuses : [...selectedStatuses, 'cancelled']);

  const hrefForChip = (status: string) =>
    hrefFor(
      monthKey,
      showCancelled,
      selected.has(status)
        ? selectedStatuses.filter((entry) => entry !== status)
        : [...selectedStatuses, status],
    );

  const hrefClearFilters = () => hrefFor(monthKey, showCancelled, statusesInScope);

  // A day selected in a previous month must not keep the drawer open.
  const dayKeys = new Set(days.map((day) => day.key));
  const activeDayKey = selectedDay && dayKeys.has(selectedDay) ? selectedDay : null;
  const activeDay = activeDayKey ? days.find((day) => day.key === activeDayKey) : null;
  const activeDayPosts = activeDayKey ? postsByDay[activeDayKey] || [] : [];

  const openDay = (dayKey: string, postId: string | null = null) => {
    setSelectedDay(dayKey);
    setSelectedPostId(postId);
  };

  const closeDrawer = () => {
    setSelectedDay(null);
    setSelectedPostId(null);
  };

  return (
    <>
      <div className="cal-page-header">
        <h1 className="page-main-title">Content Calendar</h1>
      </div>

      <div className="cal-toolbar">
        <div className="cal-control-group">
          <Link className="nav-arrow-btn" href={hrefFor(prevMonthKey)} aria-label="Previous month" scroll={false}>
            {icons.chevronLeft}
          </Link>
          <span className="current-month-label">{monthLabel}</span>
          <Link className="nav-arrow-btn" href={hrefFor(nextMonthKey)} aria-label="Next month" scroll={false}>
            {icons.chevronRight}
          </Link>
          <span className="cal-group-divider" aria-hidden="true" />
          <Link className="btn-today-pill" href={hrefFor(todayMonthKey)} scroll={false}>
            Today
          </Link>
        </div>

        <div className="cal-secondary-group">
          <span className="cal-meta-text">
            {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} · times shown in {timezone}
          </span>
          <span className="cal-group-divider" aria-hidden="true" />
          <span className="approval-toggle-wrapper">
            <span className="toggle-label-text">Show cancelled</span>
            <Link
              href={hrefForCancelledToggle()}
              className={`custom-toggle-switch ${showCancelled ? 'checked' : ''}`}
              role="switch"
              aria-checked={showCancelled}
              aria-label="Show cancelled posts"
              style={{ display: 'inline-block' }}
              scroll={false}
            >
              <span className="toggle-knob" />
            </Link>
          </span>
        </div>
      </div>

      <div className="cal-filter-chips" role="group" aria-label="Filter by post status">
        {LEGEND.map((entry) => {
          const inScope = statusesInScope.includes(entry.status);

          // Cancelled posts are not even fetched unless the toggle is on, so
          // its chip stays visibly disabled rather than pretending to filter.
          if (!inScope) {
            return (
              <span
                key={entry.status}
                className={`cal-chip cal-status-${entry.status} is-disabled`}
                title={'Turn on "Show cancelled" to include cancelled posts.'}
                aria-disabled="true"
              >
                <span className="cal-chip-dot" />
                {entry.label}
              </span>
            );
          }

          const isOn = selected.has(entry.status);
          return (
            <Link
              key={entry.status}
              href={hrefForChip(entry.status)}
              className={`cal-chip cal-status-${entry.status}${isOn ? ' is-active' : ''}`}
              role="switch"
              aria-checked={isOn}
              title={isOn ? `Hide ${entry.label.toLowerCase()} posts` : `Show ${entry.label.toLowerCase()} posts`}
              scroll={false}
            >
              <span className="cal-chip-dot" />
              {entry.label}
            </Link>
          );
        })}

        {!allSelected && (
          <Link className="cal-chip-clear" href={hrefClearFilters()} scroll={false}>
            Clear filters
          </Link>
        )}
      </div>

      {loadFailed && (
        <div className="brand-warn-banner" style={{ marginBottom: '16px' }}>
          <span className="cal-inline-icon">{icons.alertCircle}</span>
          Could not load posts for this month. The calendar below may be incomplete.
        </div>
      )}

      <div className={`calendar-workspace-layout ${activeDayKey ? 'drawer-expanded' : ''}`}>
        <div className="calendar-grid-card">
          <div className="calendar-weekdays-header">
            {WEEKDAYS.map((weekday) => (
              <div key={weekday} className="weekday-col">{weekday}</div>
            ))}
          </div>

          <div className="calendar-month-cells">
            {days.map((day) => {
              const dayPosts = postsByDay[day.key] || [];
              const visible = dayPosts.slice(0, MAX_PILLS_PER_DAY);
              const hidden = dayPosts.length - visible.length;

              return (
                <div
                  key={day.key}
                  className={`day-cell${day.inMonth ? '' : ' muted-cell'}${day.isToday ? ' today-cell' : ''}${day.key === activeDayKey ? ' selected-cell' : ''}`}
                  onClick={() => openDay(day.key)}
                >
                  <span className={day.isToday ? 'day-number-badge' : 'day-number'}>{day.dayNumber}</span>

                  <div className="cal-day-pills">
                    {visible.map((post) => (
                      <button
                        key={post.id}
                        type="button"
                        className={`cal-post-pill cal-pill-${post.status}`}
                        title={`${post.timeLabel} · ${POST_STATUS_LABELS[post.status] || post.status} · ${post.preview}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          openDay(day.key, post.id);
                        }}
                      >
                        <span className="cal-pill-dot" />
                        <span className="cal-pill-time">{post.timeLabel}</span>
                        <span className="cal-pill-text">{post.preview}</span>
                      </button>
                    ))}

                    {hidden > 0 && (
                      <button
                        type="button"
                        className="cal-more-link"
                        onClick={(event) => {
                          event.stopPropagation();
                          openDay(day.key);
                        }}
                      >
                        +{hidden} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {activeDay && (
          <aside className="calendar-detail-drawer">
            <div className="drawer-header-row">
              <div>
                <div className="drawer-date-title">{activeDay.label}</div>
                <div className="drawer-posts-count">
                  {activeDayPosts.length} {activeDayPosts.length === 1 ? 'post' : 'posts'} · {timezone}
                </div>
              </div>
              <button type="button" className="drawer-close-btn" onClick={closeDrawer} aria-label="Close details">
                {icons.close}
              </button>
            </div>

            <div className="drawer-posts-list">
              {activeDayPosts.length === 0 ? (
                <p className="cal-drawer-empty">Nothing scheduled on this day.</p>
              ) : (
                activeDayPosts.map((post) => (
                  <PostDetailCard
                    key={post.id}
                    post={post}
                    workspaceId={workspaceId}
                    selected={post.id === selectedPostId}
                  />
                ))
              )}
            </div>
          </aside>
        )}
      </div>

      {totalPosts === 0 && !loadFailed && (
        <p className="cal-empty-note">
          {selectedStatuses.length === 0
            ? 'No statuses selected — pick at least one filter chip above to see posts.'
            : allSelected
              ? `No posts scheduled in ${monthLabel}.`
              : `No posts in ${monthLabel} match the selected status filters.`}
        </p>
      )}
    </>
  );
}

function PostDetailCard({
  post,
  workspaceId,
  selected,
}: {
  post: PostView;
  workspaceId: string;
  selected: boolean;
}) {
  const canApprove = post.status === 'pending_approval';
  const canEdit = post.status === 'draft' || post.status === 'scheduled';

  return (
    <div className={`drawer-post-card${selected ? ' cal-card-selected' : ''}`}>
      <div className="post-card-top">
        <span className="post-time-clock">
          {icons.clock} {post.timeLabel}
        </span>
        <span className={`status-badge cal-badge-${post.status}`}>
          {POST_STATUS_LABELS[post.status] || post.status}
        </span>
      </div>

      <div className="cal-card-stamp">{post.stampLabel}</div>

      <div className="cal-variant-list">
        {post.variants.length === 0 && (
          <p className="cal-drawer-empty">This post has no platform variants yet.</p>
        )}

        {post.variants.map((variant) => (
          <div key={variant.id} className="cal-variant-card">
            <div className="cal-variant-head">
              <span className="cal-variant-account">
                {platformGlyph(variant.platform)}
                {variant.accountName}
              </span>
              <span className={`status-badge cal-badge-${variant.status}`}>
                {VARIANT_STATUS_LABELS[variant.status] || variant.status}
              </span>
            </div>

            <p className="cal-variant-caption">{variant.caption || 'No caption'}</p>

            {variant.mediaUrls.length > 0 && (
              <div className="cal-media-strip">
                {variant.mediaUrls.map((url, index) => (
                  <div key={`${variant.id}-${index}`} className="cal-media-thumb">
                    {isVideo(url) ? <video src={url} /> : <img src={url} alt="Post media" />}
                  </div>
                ))}
              </div>
            )}

            {variant.error && (
              <div className="cal-variant-error">
                <span className="cal-inline-icon">{icons.alertCircle}</span>
                {variant.error}
              </div>
            )}

            {variant.liveUrl && (
              <a className="cal-live-link" href={variant.liveUrl} target="_blank" rel="noopener noreferrer">
                <span className="cal-inline-icon">{icons.externalLink}</span>
                View live post
              </a>
            )}

            {variant.publishedAtLabel && (
              <div className="cal-variant-meta">Published {variant.publishedAtLabel}</div>
            )}
          </div>
        ))}
      </div>

      {(canApprove || canEdit) && (
        <div className="cal-card-actions">
          {canApprove && (
            <>
              <form action={rejectPost.bind(null, post.id, workspaceId)}>
                <button type="submit" className="cal-btn-reject">Reject</button>
              </form>
              <form action={approvePost.bind(null, post.id, workspaceId)}>
                <button type="submit" className="btn-new-post-header cal-btn-approve">Approve</button>
              </form>
            </>
          )}

          {canEdit && (
            <button
              type="button"
              className="cal-btn-soon"
              disabled
              title="The Composer cannot load an existing post yet, so editing from the calendar is not wired up."
            >
              <span className="cal-inline-icon">{icons.edit}</span>
              Edit — coming soon
            </button>
          )}
        </div>
      )}
    </div>
  );
}
