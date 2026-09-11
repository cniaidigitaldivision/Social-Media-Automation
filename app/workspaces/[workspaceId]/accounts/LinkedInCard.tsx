'use client';

import { useState } from 'react';
import { icons } from '@/lib/icons';
import { DisconnectButton } from './DisconnectButton';
import { LinkedInConnectModal } from './LinkedInConnectModal';

interface ConnectedAccount {
  id: string;
  platform: string;
  platform_account_id: string;
  account_name: string;
  account_avatar_url: string | null;
  status: string;
  connected_at: string;
}

const STATUS_BADGE: Record<string, string> = {
  active: 'badge-connected',
  needs_reconnect: 'badge-reconnect-required',
  revoked: 'badge-failed',
};

const CARD_BORDER: Record<string, string> = {
  needs_reconnect: 'card-expired-border',
  revoked: 'card-expired-border',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  needs_reconnect: 'Needs reconnect',
  revoked: 'Revoked',
};

interface LinkedInCardProps {
  workspaceId: string;
  connectedAccount: ConnectedAccount | null;
}

export function LinkedInCard({ workspaceId, connectedAccount }: LinkedInCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (connectedAccount) {
    // ── Connected state — identical to FB/IG connected card layout ──────────
    const badgeClass  = STATUS_BADGE[connectedAccount.status] ?? 'badge-not-connected';
    const borderClass = CARD_BORDER[connectedAccount.status] ?? '';
    const connectedDate = new Date(connectedAccount.connected_at).toLocaleDateString();

    return (
      <div className={`account-platform-card acct-card-linked ${borderClass}`}>
        {/* Card Header */}
        <div className="account-card-header">
          <div className="platform-logo-box">{icons.linkedin}</div>
          <span className={`acct-status-badge ${badgeClass}`}>
            <span className="acct-badge-dot" />
            {STATUS_LABEL[connectedAccount.status] ?? connectedAccount.status}
          </span>
        </div>

        {/* Card Body */}
        <div className="account-card-body">
          <div className="acct-identity-row">
            <p className="platform-display-name" title={connectedAccount.account_name}>
              {connectedAccount.account_name}
            </p>
          </div>

          <div className="acct-meta-block">
            <span className="acct-meta-line">
              <span className="acct-meta-label">ID</span>
              <span className="acct-meta-value" title={connectedAccount.platform_account_id}>
                {connectedAccount.platform_account_id}
              </span>
            </span>
            <span className="acct-meta-line">
              {icons.clock}
              <span className="acct-meta-value">Connected {connectedDate}</span>
            </span>
          </div>
        </div>

        {/* Action button */}
        <DisconnectButton
          accountId={connectedAccount.id}
          workspaceId={workspaceId}
          accountName={connectedAccount.account_name}
        />
      </div>
    );
  }

  // ── Not connected state — identical to FB/IG not-connected card layout ────
  return (
    <>
      <div className="account-platform-card">
        <div className="account-card-header">
          <div className="platform-logo-box">{icons.linkedin}</div>
          <span className="acct-status-badge badge-not-connected">
            <span className="acct-badge-dot" />
            Not connected
          </span>
        </div>

        <div className="account-card-body">
          <p className="platform-display-name">LinkedIn</p>
        </div>

        <button
          type="button"
          id="li-connect-btn"
          className="btn-connect-primary"
          onClick={() => setModalOpen(true)}
        >
          {icons.plus} Connect
        </button>
      </div>

      <LinkedInConnectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        workspaceId={workspaceId}
      />
    </>
  );
}
