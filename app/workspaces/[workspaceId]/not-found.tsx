import Link from 'next/link';

/**
 * Rendered by Next.js when layout.tsx calls notFound() —
 * i.e. when the workspaceId in the URL doesn't match any row in Supabase.
 */
export default function WorkspaceNotFound() {
  return (
    <div className="app-layout-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' }}>
      <div style={{ textAlign: 'center', maxWidth: '420px', padding: '40px 24px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: 'var(--status-failed-bg)', margin: '0 auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--status-failed)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
          Workspace not found
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
          The workspace you&apos;re trying to access doesn&apos;t exist or you may not have permission to view it.
        </p>

        <Link
          href="/workspaces"
          className="btn-primary-teal"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '10px 20px' }}
        >
          ← Back to all workspaces
        </Link>
      </div>
    </div>
  );
}
