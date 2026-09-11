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
      type="button"
      className="btn-disconnect-danger"
      onClick={handleDisconnect}
      disabled={isPending}
    >
      {icons.trash}
      {isPending ? 'Disconnecting…' : 'Disconnect'}
    </button>
  );
}
