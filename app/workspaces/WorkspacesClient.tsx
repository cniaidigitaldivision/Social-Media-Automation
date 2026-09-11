'use client';

/**
 * Interactive shell for /workspaces.
 *
 * All data arrives as props from the Server Component — this file never
 * queries Supabase and never invents a number. It owns the "new workspace"
 * modal, and refreshes the server-rendered list once a workspace is created
 * so the grid reflects the database rather than an optimistic guess.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Building2, CalendarClock, CheckCircle2, Plus } from 'lucide-react';
import { NewWorkspaceModal } from '@/components/new-workspace-modal/NewWorkspaceModal';

export type WorkspaceSummary = {
  id: string;
  name: string;
  slug: string | null;
  logoUrl: string | null;
  brandColor: string | null;
  status: string;
  createdAt: string | null;
  /** false when the connected_accounts query failed — counts are then null. */
  accountsAvailable: boolean;
  accountsActive: number | null;
  accountsNeedingAttention: number | null;
  /** false when the posts query failed — counts are then null. */
  postsAvailable: boolean;
  postsScheduled: number | null;
  postsPendingApproval: number | null;
};

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'badge-connected' },
  paused: { label: 'Paused', className: 'badge-pending-approval' },
  archived: { label: 'Archived', className: 'badge-not-connected' },
};

function formatCreated(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function WorkspacesClient({
  workspaces,
  loadError,
}: {
  workspaces: WorkspaceSummary[];
  loadError: string | null;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // The modal navigates into the new workspace itself; refreshing keeps this
  // server-rendered list correct for when the user comes back.
  const handleSuccess = () => router.refresh();

  const activeCount = workspaces.filter((w) => w.status === 'active').length;
  const otherCount = workspaces.length - activeCount;

  return (
    <>
      <main className="page-content-wrapper">
        {/* `/` is the app entry point: it redirects into the first active
            workspace, or back here when none exist yet. */}
        <Link href="/" className="ws-back-link">
          <ArrowLeft className="ws-icon-sm" />
          Back to Home
        </Link>

        <div className="ws-index-head">
          <div>
            <h1 className="page-main-title">All Workspaces</h1>
            <p className="ws-index-sub">
              {workspaces.length === 0
                ? 'Select a workspace to open its dashboard, or create a new one.'
                : `${activeCount} active workspace${activeCount === 1 ? '' : 's'}` +
                  (otherCount > 0 ? ` · ${otherCount} paused or archived` : '') +
                  ' · select one to open its dashboard.'}
            </p>
          </div>
          <button
            id="btn-add-workspace-page"
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="ws-primary-btn"
          >
            <Plus className="ws-icon-sm" />
            Add workspace
          </button>
        </div>

        {loadError && (
          <div className="ws-error-panel" role="alert">
            <AlertCircle className="ws-icon-md" />
            <p>{loadError}</p>
          </div>
        )}

        {!loadError && workspaces.length === 0 && (
          <div className="ws-empty">
            <div className="ws-empty-icon">
              <Plus className="ws-icon-lg" />
            </div>
            <div>
              <p className="ws-empty-title">No workspaces yet</p>
              <p className="ws-empty-body">
                The <code>workspaces</code> table returned zero rows. Create your first workspace
                to start connecting social accounts and publishing.
              </p>
            </div>
            <button type="button" onClick={() => setIsModalOpen(true)} className="ws-primary-btn">
              <Plus className="ws-icon-sm" />
              Create your first workspace
            </button>
          </div>
        )}

        {!loadError && workspaces.length > 0 && (
          <>
            <div className="ws-grid">
              {workspaces.map((ws) => (
                <WorkspaceCard key={ws.id} workspace={ws} />
              ))}

              <button type="button" onClick={() => setIsModalOpen(true)} className="ws-add-card">
                <span className="ws-add-card-icon">
                  <Plus className="ws-icon-md" />
                </span>
                <span className="ws-add-card-label">Add new workspace</span>
              </button>
            </div>

            <p className="ws-source-note">
              Counts read live from Supabase — connected_accounts · status = active (plus
              needs_reconnect / revoked for the attention line), posts · status = scheduled, and
              posts · status = pending_approval.
            </p>
          </>
        )}
      </main>

      <NewWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

function WorkspaceCard({ workspace: ws }: { workspace: WorkspaceSummary }) {
  const badge = STATUS_BADGE[ws.status] ?? {
    label: ws.status,
    className: 'badge-not-connected',
  };
  const created = formatCreated(ws.createdAt);
  const attention = ws.accountsNeedingAttention ?? 0;

  return (
    <Link href={`/workspaces/${ws.id}/dashboard`} className="ws-card">
      <div className="ws-card-head">
        {ws.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ws.logoUrl} alt="" className="ws-card-logo" />
        ) : (
          <span
            className="ws-card-logo ws-card-logo-fallback"
            style={{ backgroundColor: ws.brandColor || 'var(--cni-teal-primary)' }}
          >
            {initialsOf(ws.name)}
          </span>
        )}
        <div className="ws-card-ident">
          <p className="ws-card-name">{ws.name}</p>
          <p className="ws-card-slug">{ws.slug ?? ws.id.slice(0, 8)}</p>
        </div>
        <span className={`badge ${badge.className} ws-card-badge`}>{badge.label}</span>
      </div>

      <dl className="ws-card-stats">
        <div className="ws-card-stat">
          <dt>Accounts</dt>
          <dd title="connected_accounts · status = active">
            {ws.accountsAvailable ? ws.accountsActive : '—'}
          </dd>
        </div>
        <div className="ws-card-stat">
          <dt>Scheduled</dt>
          <dd title="posts · status = scheduled">
            {ws.postsAvailable ? ws.postsScheduled : '—'}
          </dd>
        </div>
        <div className="ws-card-stat">
          <dt>Awaiting approval</dt>
          <dd title="posts · status = pending_approval">
            {ws.postsAvailable ? ws.postsPendingApproval : '—'}
          </dd>
        </div>
      </dl>

      <div className="ws-card-foot">
        {!ws.accountsAvailable || !ws.postsAvailable ? (
          <span className="ws-card-note ws-card-note-warn">
            <AlertCircle className="ws-icon-xs" />
            Counts unavailable — query failed
          </span>
        ) : attention > 0 ? (
          <span className="ws-card-note ws-card-note-warn">
            <AlertCircle className="ws-icon-xs" />
            {attention} account{attention === 1 ? '' : 's'} need reconnecting
          </span>
        ) : ws.accountsActive === 0 ? (
          <span className="ws-card-note">
            <Building2 className="ws-icon-xs" />
            No social accounts connected yet
          </span>
        ) : ws.postsScheduled && ws.postsScheduled > 0 ? (
          <span className="ws-card-note">
            <CalendarClock className="ws-icon-xs" />
            {ws.postsScheduled} post{ws.postsScheduled === 1 ? '' : 's'} queued to publish
          </span>
        ) : (
          <span className="ws-card-note">
            <CheckCircle2 className="ws-icon-xs" />
            Connected, nothing scheduled
          </span>
        )}
        {created && <span className="ws-card-created">Created {created}</span>}
      </div>
    </Link>
  );
}
