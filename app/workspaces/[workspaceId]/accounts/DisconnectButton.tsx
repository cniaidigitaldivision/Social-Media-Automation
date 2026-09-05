'use client';

import { useTransition } from 'react';
import { icons } from '@/lib/icons';
import { disconnectAccount } from './meta/actions';

export function DisconnectButton({ accountId, workspaceId, accountName }: { accountId: string, workspaceId: string, accountName: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDisconnect = () => {
    if (window.confirm(`Are you sure you want to disconnect ${accountName}?`)) {
      startTransition(async () => {
        try {
          await disconnectAccount(accountId, workspaceId);
        } catch (e) {
          alert('Failed to disconnect');
        }
      });
    }
  };

  return (
    <button
      className="btn-reconnect-teal"
      onClick={handleDisconnect}
      disabled={isPending}
      style={{
        background: 'transparent',
        border: '1px solid var(--status-failed)',
        color: 'var(--status-failed)',
        opacity: isPending ? 0.6 : 1
      }}
    >
      <span style={{ marginRight: '6px' }}>{icons.trash}</span>
      {isPending ? 'Disconnecting...' : 'Disconnect'}
    </button>
  );
}
