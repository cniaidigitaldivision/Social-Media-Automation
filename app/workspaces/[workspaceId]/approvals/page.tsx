import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { icons } from '@/lib/icons';
import { approvePost, rejectPost } from './actions';

/**
 * /workspaces/[workspaceId]/approvals
 *
 * Every post and count on this page comes from a live Supabase query scoped to
 * this workspace_id (posts · status = pending_approval). Nothing is hardcoded:
 * when the query returns zero rows the page renders an honest empty state
 * rather than a stand-in figure.
 *
 * This pass is styling only — the Approve/Reject server actions and the post
 * preview data are unchanged.
 */

const isVideo = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url);

export default async function ApprovalsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = await params;
  const workspaceId = resolvedParams.workspaceId;
  const supabase = createClient();

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      scheduled_at,
      post_variants (
        id,
        platform,
        caption,
        media_urls,
        connected_accounts ( account_name )
      )
    `)
    .eq('workspace_id', workspaceId)
    .eq('status', 'pending_approval')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching approvals:', error);
  }

  // Fetch workspace timezone
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('timezone')
    .eq('id', workspaceId)
    .single();

  const timezone = workspace?.timezone || 'UTC';
  const pendingCount = posts?.length ?? 0;

  return (
    <div className="page-content-wrapper">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="appr-page-header">
        <h1 className="page-main-title">Approvals</h1>
        <p className="page-subtitle">
          {error
            ? 'Pending posts could not be loaded — see the server log for details.'
            : pendingCount > 0
              ? `${pendingCount} post${pendingCount === 1 ? '' : 's'} waiting on your review · posts · status = pending_approval`
              : 'Posts submitted for review land here before they go out.'}
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        /* ── Empty state (same shell as "No workspaces yet") ───────────────── */
        <div className="ws-empty">
          <div className="ws-empty-icon appr-empty-glyph">{icons.approvals}</div>
          <div>
            <p className="ws-empty-title">No posts awaiting approval</p>
            <p className="ws-empty-body">
              All caught up. When someone submits a post for review it will appear here with its
              full preview and Approve / Reject actions.
            </p>
          </div>
        </div>
      ) : (
        <div className="appr-stack">
          {posts.map((post: any) => {
            const onApprove = approvePost.bind(null, post.id, workspaceId);
            const onReject = rejectPost.bind(null, post.id, workspaceId);
            const variants = post.post_variants || [];

            return (
              <article key={post.id} className="appr-card">
                {/* ── Card header: schedule + actions ───────────────────────── */}
                <header className="appr-card-head">
                  <div className="appr-sched">
                    <div className="appr-sched-label">
                      <span className="appr-sched-label-icon">{icons.calendar}</span>
                      Scheduled For
                    </div>
                    {post.scheduled_at ? (
                      <div className="appr-sched-value">
                        {new Date(post.scheduled_at).toLocaleString('en-US', {
                          timeZone: timezone,
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                        <span className="appr-sched-tz"> ({timezone})</span>
                      </div>
                    ) : (
                      <span className="appr-badge-unscheduled">
                        <span className="appr-badge-icon">{icons.warning}</span>
                        Not scheduled
                      </span>
                    )}
                  </div>

                  <div className="appr-head-actions">
                    <form action={onReject}>
                      <button type="submit" className="appr-btn-reject">Reject</button>
                    </form>
                    <form action={onApprove}>
                      <button type="submit" className="btn-new-post-header appr-btn-approve">
                        Approve
                      </button>
                    </form>
                  </div>
                </header>

                {/* ── Variant previews: what will actually be published ─────── */}
                <div className="appr-card-body">
                  {variants.map((variant: any) => (
                    <div key={variant.id} className="appr-variant">
                      <div className="appr-variant-head">
                        <span className="appr-platform-icon">
                          {variant.platform === 'facebook' ? icons.facebook : variant.platform === 'linkedin' ? icons.linkedin : icons.instagram}
                        </span>
                        <div className="appr-variant-identity">
                          <span className="appr-account-name">
                            {variant.connected_accounts?.account_name || 'Unknown Account'}
                          </span>
                          <span className="appr-account-meta">{variant.platform}</span>
                        </div>
                      </div>

                      <div className="appr-caption">
                        {variant.caption || <span className="appr-caption-empty">No caption</span>}
                      </div>

                      {variant.media_urls && variant.media_urls.length > 0 && (
                        <div className="appr-media-row">
                          {variant.media_urls.map((url: string, i: number) => (
                            <div key={i} className="appr-thumb">
                              {isVideo(url) ? (
                                <video src={url} />
                              ) : (
                                <img src={url} alt="Post media" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
