/**
 * /workspaces/[workspaceId]/post-status
 *
 * STATUS: NOT YET BUILT
 * Will show per-post delivery analytics: a pipeline view of which platforms
 * succeeded/failed/are still publishing, with retry actions per platform,
 * error detail banners, and links to the live post.
 *
 * Data: post_deliveries table (workspace_id, post_id, platform, status, error).
 */
export default function PostStatusPage() {
  return <UnbuiltFeature name="Post Status" description="Per-post delivery pipeline showing publish status across platforms, with retry actions and error detail." />;
}

function UnbuiltFeature({ name, description }: { name: string; description: string }) {
  return (
    <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--bg-hover)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <span style={{ display: 'inline-block', marginBottom: '12px', padding: '3px 10px', background: 'var(--status-pending-bg)', color: 'var(--status-pending)', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Not yet built
      </span>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>{name}</h1>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '400px', lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}
