import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { CalendarClient, type DayCell, type PostView } from './CalendarClient';

/**
 * /workspaces/[workspaceId]/calendar
 *
 * Month grid of this workspace's posts, keyed off posts.scheduled_at and
 * rendered in the WORKSPACE's timezone (not the browser's, not raw UTC).
 *
 * Only the currently visible window is fetched: the grid of whole weeks the
 * user is looking at, converted from workspace-local midnight boundaries to
 * UTC instants before hitting Supabase.
 *
 * ?month=YYYY-MM   which month is shown (defaults to "today" in workspace tz)
 * ?cancelled=1     also include cancelled posts (hidden by default)
 * ?status=a,b,c    restrict to these post statuses (absent = every status in
 *                  scope; present-but-empty = none, which renders an honest
 *                  "no statuses selected" grid rather than silently showing all)
 */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const ACTIVE_STATUSES = [
  'draft',
  'pending_approval',
  'scheduled',
  'publishing',
  'published',
  'failed',
];

const ALL_STATUSES = [...ACTIVE_STATUSES, 'cancelled'];

// --- Timezone helpers -------------------------------------------------------
// Read the wall-clock parts of an instant in a given zone, and invert that to
// turn a workspace-local calendar date back into the UTC instant it starts at.

function safeTimeZone(timeZone: string | null | undefined): string {
  if (!timeZone) return 'UTC';
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
    return timeZone;
  } catch {
    return 'UTC';
  }
}

function zonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour') % 24, // midnight comes back as 24 in some locales
    minute: get('minute'),
    second: get('second'),
  };
}

function zoneOffsetMs(date: Date, timeZone: string): number {
  const p = zonedParts(date, timeZone);
  const asIfUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asIfUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/** The UTC instant at which the given calendar date starts in `timeZone`. */
function startOfZonedDay(year: number, month: number, day: number, timeZone: string): Date {
  const naive = Date.UTC(year, month - 1, day, 0, 0, 0);
  // Two passes so DST transition days land on the right side of the shift.
  let ts = naive - zoneOffsetMs(new Date(naive), timeZone);
  ts = naive - zoneOffsetMs(new Date(ts), timeZone);
  return new Date(ts);
}

const pad = (n: number) => String(n).padStart(2, '0');

function dayKeyInZone(date: Date, timeZone: string): string {
  const p = zonedParts(date, timeZone);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

function parseMonthParam(value: string | undefined, fallbackYear: number, fallbackMonth: number) {
  const match = typeof value === 'string' ? value.match(/^(\d{4})-(\d{2})$/) : null;
  if (!match) return { year: fallbackYear, month: fallbackMonth };

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (year < 1970 || year > 2200 || month < 1 || month > 12) {
    return { year: fallbackYear, month: fallbackMonth };
  }
  return { year, month };
}

function shiftMonth(year: number, month: number, delta: number) {
  const zeroBased = year * 12 + (month - 1) + delta;
  return { year: Math.floor(zeroBased / 12), month: (zeroBased % 12) + 1 };
}

const monthParam = (year: number, month: number) => `${year}-${pad(month)}`;

function previewOf(caption: string | null | undefined): string {
  const text = (caption || '').replace(/\s+/g, ' ').trim();
  if (!text) return 'No caption';
  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}

export default async function CalendarPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { workspaceId } = await params;
  const query = await searchParams;

  const monthQuery = Array.isArray(query.month) ? query.month[0] : query.month;
  const cancelledQuery = Array.isArray(query.cancelled) ? query.cancelled[0] : query.cancelled;
  const showCancelled = cancelledQuery === '1';

  // Which statuses the filter chips can offer, and which of them are on.
  const statusesInScope = showCancelled ? ALL_STATUSES : ACTIVE_STATUSES;
  const statusQuery = Array.isArray(query.status) ? query.status[0] : query.status;
  const selectedStatuses =
    statusQuery === undefined
      ? statusesInScope
      : statusQuery
          .split(',')
          .map((value) => value.trim())
          .filter((value) => statusesInScope.includes(value));

  const supabase = createClient();

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('timezone')
    .eq('id', workspaceId)
    .maybeSingle();

  const timezone = safeTimeZone(workspace?.timezone);

  // "Today" as the workspace sees it.
  const nowParts = zonedParts(new Date(), timezone);
  const todayKey = `${nowParts.year}-${pad(nowParts.month)}-${pad(nowParts.day)}`;

  const { year, month } = parseMonthParam(monthQuery, nowParts.year, nowParts.month);

  // --- Build the visible grid (Sunday-start, whole weeks) -------------------
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const leadingBlanks = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const cellCount = Math.ceil((leadingBlanks + daysInMonth) / 7) * 7;

  const days: DayCell[] = [];
  for (let i = 0; i < cellCount; i++) {
    const cursor = new Date(Date.UTC(year, month - 1, 1 - leadingBlanks + i));
    const y = cursor.getUTCFullYear();
    const m = cursor.getUTCMonth() + 1;
    const d = cursor.getUTCDate();
    const key = `${y}-${pad(m)}-${pad(d)}`;
    days.push({
      key,
      dayNumber: d,
      inMonth: m === month && y === year,
      isToday: key === todayKey,
      label: `${MONTH_NAMES[m - 1]} ${d}, ${y}`,
    });
  }

  const firstCell = days[0];
  const lastCell = days[days.length - 1];
  const [fy, fm, fd] = firstCell.key.split('-').map(Number);
  const [ly, lm, ld] = lastCell.key.split('-').map(Number);
  const rangeStart = startOfZonedDay(fy, fm, fd, timezone);
  const rangeEnd = startOfZonedDay(ly, lm, ld + 1, timezone); // exclusive

  // --- Fetch just this window ----------------------------------------------
  const postsQuery = supabase
    .from('posts')
    .select(`
      id,
      status,
      scheduled_at,
      post_variants (
        id,
        platform,
        caption,
        media_urls,
        status,
        live_url,
        error,
        published_at,
        connected_accounts ( account_name )
      )
    `)
    .eq('workspace_id', workspaceId)
    .in('status', selectedStatuses)
    .gte('scheduled_at', rangeStart.toISOString())
    .lt('scheduled_at', rangeEnd.toISOString())
    .order('scheduled_at', { ascending: true });

  // With no status selected there is nothing to ask Postgres for.
  const { data: posts, error } =
    selectedStatuses.length > 0
      ? await postsQuery
      : { data: [] as unknown[], error: null };

  if (error) {
    console.error('[Calendar] Failed to fetch posts:', error);
  }

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
  });
  const stampFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const postsByDay: Record<string, PostView[]> = {};

  for (const post of (posts || []) as any[]) {
    if (!post.scheduled_at) continue; // unscheduled drafts have no place on a calendar
    const scheduled = new Date(post.scheduled_at);
    const key = dayKeyInZone(scheduled, timezone);

    const variants = (post.post_variants || []).map((variant: any) => ({
      id: variant.id,
      platform: variant.platform,
      accountName: variant.connected_accounts?.account_name || 'Disconnected account',
      status: variant.status,
      caption: variant.caption || '',
      mediaUrls: variant.media_urls || [],
      liveUrl: variant.live_url || null,
      error: variant.error || null,
      publishedAtLabel: variant.published_at
        ? stampFormatter.format(new Date(variant.published_at))
        : null,
    }));

    const view: PostView = {
      id: post.id,
      status: post.status,
      dayKey: key,
      timeLabel: timeFormatter.format(scheduled),
      stampLabel: stampFormatter.format(scheduled),
      preview: previewOf(variants[0]?.caption),
      variants,
    };

    (postsByDay[key] ||= []).push(view);
  }

  const totalPosts = Object.values(postsByDay).reduce((sum, list) => sum + list.length, 0);
  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);

  return (
    <div className="page-content-wrapper">
      <CalendarClient
        workspaceId={workspaceId}
        timezone={timezone}
        monthLabel={`${MONTH_NAMES[month - 1]} ${year}`}
        monthKey={monthParam(year, month)}
        prevMonthKey={monthParam(prev.year, prev.month)}
        nextMonthKey={monthParam(next.year, next.month)}
        todayMonthKey={monthParam(nowParts.year, nowParts.month)}
        showCancelled={showCancelled}
        statusesInScope={statusesInScope}
        selectedStatuses={selectedStatuses}
        days={days}
        postsByDay={postsByDay}
        totalPosts={totalPosts}
        loadFailed={Boolean(error)}
      />
    </div>
  );
}
