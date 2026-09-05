import React from 'react';
import { icons } from '@/lib/icons';
import { createClient } from '@/lib/supabase/server';
import { DisconnectButton } from './DisconnectButton';

// Map status → badge class (defined in cni-styles.css)
const STATUS_BADGE: Record<string, string> = {
  active: 'badge-connected',
  needs_reconnect: 'badge-reconnect-required',
  revoked: 'badge-failed',
};

const CARD_BORDER: Record<string, string> = {
  needs_reconnect: 'card-expired-border',
  revoked: 'card-expired-border',
};

// Define all supported platforms based on icons and product spec
const SUPPORTED_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', canConnect: true },
  { id: 'instagram', name: 'Instagram', canConnect: true },
  { id: 'linkedin', name: 'LinkedIn', canConnect: false },
  { id: 'twitter', name: 'X (Twitter)', canConnect: false },
  { id: 'tiktok', name: 'TikTok', canConnect: false },
  { id: 'youtube', name: 'YouTube', canConnect: false },
  { id: 'googleBusiness', name: 'Google Business', canConnect: false },
];

export default async function AccountsPage({
  params,
  searchParams
}: {
  params: Promise<{ workspaceId: string }> | { workspaceId: string },
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined }
}) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  
  const workspaceId = resolvedParams.workspaceId;
  const oauthError = resolvedSearchParams.oauth_error as string | undefined;

  const supabase = createClient();
  const { data: accounts } = await supabase
    .from('connected_accounts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('connected_at', { ascending: false });

  const connectedAccounts = accounts || [];
  const connectedCount = connectedAccounts.filter(a => a.status === 'active').length;
  const alertCount = connectedAccounts.filter(a => a.status !== 'active').length;

  return (
    <div className="page-content-wrapper" style={{ padding: '28px 32px' }}>
      {/* ── Error Banner ────────────────────────────────────────────────────── */}
      {oauthError && (
        <div style={{
          marginBottom: '24px', padding: '12px 16px', borderRadius: '8px',
          background: 'var(--status-failed-bg)', color: 'var(--status-failed)',
          border: '1px solid var(--status-failed)', display: 'flex', alignItems: 'center'
        }}>
          <span style={{ marginRight: '8px', display: 'flex' }}>{icons.warning}</span>
          <span>{oauthError}</span>
        </div>
      )}

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Connected Accounts
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Manage the social platforms connected to this workspace.
          </p>
        </div>

        {/* Summary pills */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{
            fontSize: '13px', fontWeight: 600, padding: '5px 12px',
            background: 'var(--status-published-bg)', color: 'var(--status-published)',
            borderRadius: 'var(--radius-full)'
          }}>
            {connectedCount} connected
          </span>
          {alertCount > 0 && (
            <span style={{
              fontSize: '13px', fontWeight: 600, padding: '5px 12px',
              background: 'var(--status-failed-bg)', color: 'var(--status-failed)',
              borderRadius: 'var(--radius-full)'
            }}>
              {alertCount} need attention
            </span>
          )}
        </div>
      </div>

      {/* ── Accounts Grid ───────────────────────────────────────────────────── */}
      <div className="accounts-cards-grid">
        {SUPPORTED_PLATFORMS.map((platform) => {
          // Find if there's a connected account for this platform
          const connectedAcc = connectedAccounts.find(a => a.platform === platform.id);
          const platformIcon = (icons as Record<string, React.ReactNode>)[platform.id] || icons.globe;

          if (connectedAcc) {
            // Connected State
            const badgeClass   = STATUS_BADGE[connectedAcc.status] ?? 'badge-not-connected';
            const borderClass  = CARD_BORDER[connectedAcc.status]  ?? '';
            const connectedDate = new Date(connectedAcc.connected_at).toLocaleDateString();

            return (
              <div key={platform.id} className={`account-platform-card ${borderClass}`}>
                {/* Card Header */}
                <div className="account-card-header">
                  <div className="platform-logo-box" style={{ background: 'var(--bg-hover)' }}>
                    {platformIcon}
                  </div>
                  <span className={`status-badge ${badgeClass}`} style={{ fontSize: '11px', padding: '3px 8px' }}>
                    {connectedAcc.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="account-card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    {connectedAcc.account_avatar_url && (
                      <img src={connectedAcc.account_avatar_url} alt={connectedAcc.account_name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    )}
                    <p className="platform-display-name">{connectedAcc.account_name}</p>
                  </div>
                  <p className="account-handle-text">ID: {connectedAcc.platform_account_id}</p>
                  
                  <p className="account-expiry-status" style={{ color: 'var(--text-light)', marginTop: '8px' }}>
                    <span className="expiry-line">
                      <span style={{ width: '12px', height: '12px', display: 'inline-flex' }}>
                        {icons.clock}
                      </span>
                      Connected {connectedDate}
                    </span>
                  </p>
                </div>

                {/* Action button */}
                <DisconnectButton accountId={connectedAcc.id} workspaceId={workspaceId} accountName={connectedAcc.account_name} />
              </div>
            );
          } else {
            // Not Connected State
            return (
              <div key={platform.id} className="account-platform-card">
                <div className="account-card-header">
                  <div className="platform-logo-box" style={{ background: 'var(--bg-hover)' }}>
                    {platformIcon}
                  </div>
                  <span className="status-badge badge-not-connected" style={{ fontSize: '11px', padding: '3px 8px', borderRadius: 'var(--radius-full)' }}>
                    Not connected
                  </span>
                </div>

                <div className="account-card-body">
                  <p className="platform-display-name">{platform.name}</p>
                  <p className="account-handle-text">
                    {platform.canConnect ? `Connect your ${platform.name} account` : 'Integration coming soon'}
                  </p>
                </div>

                {platform.canConnect ? (
                  <a 
                    href={`/api/oauth/meta/start?workspace_id=${workspaceId}`} 
                    className="btn-connect-outline"
                    style={{ textDecoration: 'none' }}
                  >
                    {icons.plus} Connect {platform.name}
                  </a>
                ) : (
                  <button type="button" className="btn-connect-disabled" disabled>
                    Coming soon
                  </button>
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
