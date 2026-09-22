import React from 'react';
import { icons } from '@/lib/icons';
import { createClient } from '@/lib/supabase/server';
import { DisconnectButton } from './DisconnectButton';
import { LinkedInCard } from './LinkedInCard';
import { TikTokCard } from './TikTokCard';

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

// Human-readable version of the raw connected_accounts.status value.
const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  needs_reconnect: 'Needs reconnect',
  revoked: 'Revoked',
};

// Define all supported platforms based on icons and product spec
const SUPPORTED_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', canConnect: true },
  { id: 'instagram', name: 'Instagram', canConnect: true },
  // LinkedIn uses a manual-connect flow (no OAuth yet).
  // canConnect:true so the card renders our LinkedInCard component with the modal.
  { id: 'linkedin', name: 'LinkedIn', canConnect: true },
  { id: 'tiktok', name: 'TikTok', canConnect: true },
  { id: 'youtube', name: 'YouTube', canConnect: true },
  { id: 'pinterest', name: 'Pinterest', canConnect: true },
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
    <div className="page-content-wrapper">
      {/* ── Error Banner ────────────────────────────────────────────────────── */}
      {oauthError && (
        <div className="acct-error-banner" role="alert">
          {icons.warning}
          <span>{oauthError}</span>
        </div>
      )}

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="acct-page-header">
        <div>
          <h1 className="page-main-title">Connected Accounts</h1>
          <p className="page-subtitle">
            Manage the social platforms connected to this workspace.
          </p>
        </div>

        {/* Summary pills — both counts come from the connected_accounts rows above. */}
        <div className="acct-summary-pills">
          <span className="acct-count-pill acct-count-connected">
            <span className="acct-pill-dot" />
            {connectedCount} connected
          </span>
          {alertCount > 0 && (
            <span className="acct-count-pill acct-count-attention">
              <span className="acct-pill-dot" />
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

          // LinkedIn uses a client component with a manual-connect modal (no OAuth).
          // All modal state is managed inside LinkedInCard so this server page stays static.
          if (platform.id === 'linkedin') {
            return (
              <LinkedInCard
                key="linkedin"
                workspaceId={workspaceId}
                connectedAccount={connectedAcc ?? null}
              />
            );
          }

          // TikTok uses the same manual-connect pattern as LinkedIn (Buffer Channel ID, no OAuth).
          // All modal state is managed inside TikTokCard so this server page stays static.
          if (platform.id === 'tiktok') {
            return (
              <TikTokCard
                key="tiktok"
                workspaceId={workspaceId}
                connectedAccount={connectedAcc ?? null}
              />
            );
          }

          if (connectedAcc) {
            // Connected State
            const badgeClass   = STATUS_BADGE[connectedAcc.status] ?? 'badge-not-connected';
            const borderClass  = CARD_BORDER[connectedAcc.status]  ?? '';
            const connectedDate = new Date(connectedAcc.connected_at).toLocaleDateString();

            return (
              <div key={platform.id} className={`account-platform-card acct-card-linked ${borderClass}`}>
                {/* Card Header */}
                <div className="account-card-header">
                  <div className="platform-logo-box">
                    {platformIcon}
                  </div>
                  <span className={`acct-status-badge ${badgeClass}`}>
                    <span className="acct-badge-dot" />
                    {STATUS_LABEL[connectedAcc.status] ?? connectedAcc.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="account-card-body">
                  <div className="acct-identity-row">
                    {connectedAcc.account_avatar_url && (
                      <img
                        className="acct-avatar"
                        src={connectedAcc.account_avatar_url}
                        alt={connectedAcc.account_name}
                      />
                    )}
                    <p className="platform-display-name" title={connectedAcc.account_name}>
                      {connectedAcc.account_name}
                    </p>
                  </div>

                  <div className="acct-meta-block">
                    <span className="acct-meta-line">
                      <span className="acct-meta-label">ID</span>
                      <span className="acct-meta-value" title={connectedAcc.platform_account_id}>
                        {connectedAcc.platform_account_id}
                      </span>
                    </span>
                    <span className="acct-meta-line">
                      {icons.clock}
                      <span className="acct-meta-value">Connected {connectedDate}</span>
                    </span>
                  </div>
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
                  <div className="platform-logo-box">
                    {platformIcon}
                  </div>
                  <span className="acct-status-badge badge-not-connected">
                    <span className="acct-badge-dot" />
                    Not connected
                  </span>
                </div>

                <div className="account-card-body">
                  <p className="platform-display-name">{platform.name}</p>
                  <p className="acct-subline">
                    {platform.canConnect ? `Connect your ${platform.name} account` : 'Integration coming soon'}
                  </p>
                </div>

                {platform.canConnect ? (
                  <a
                    href={`/api/oauth/${['facebook', 'instagram'].includes(platform.id) ? 'meta' : platform.id}/start?workspace_id=${workspaceId}`}
                    className="btn-connect-primary"
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
