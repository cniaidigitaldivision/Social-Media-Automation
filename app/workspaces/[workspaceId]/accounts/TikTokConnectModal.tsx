'use client';

import { useEffect, useCallback, useState } from 'react';
import { X } from 'lucide-react';
import { connectTikTok } from './tiktok/actions';

interface TikTokConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export function TikTokConnectModal({ isOpen, onClose, workspaceId }: TikTokConnectModalProps) {
  const [channelName, setChannelName] = useState('');
  const [bufferChannelId, setBufferChannelId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const canSave = channelName.trim().length > 0 && bufferChannelId.trim().length > 0 && !isSubmitting;

  const requestClose = useCallback(() => {
    if (isSubmitting) return;
    setChannelName('');
    setBufferChannelId('');
    setApiError('');
    onClose();
  }, [isSubmitting, onClose]);

  // Close on Escape key — mirrors LinkedInConnectModal pattern exactly
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, requestClose]);

  const handleSave = async () => {
    setIsSubmitting(true);
    setApiError('');
    try {
      const result = await connectTikTok(workspaceId, channelName.trim(), bufferChannelId.trim());
      if (result?.error) {
        setApiError(result.error);
      } else {
        // Success — close modal; page revalidates via server action
        requestClose();
      }
    } catch {
      setApiError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop — click anywhere outside modal-dialog to close
    <div
      className="modal-backdrop"
      onClick={requestClose}
    >
      {/* Stop propagation so clicks inside the dialog don't bubble up to the backdrop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tt-modal-title"
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="modal-header">
          <h2 id="tt-modal-title" className="modal-title">Connect TikTok</h2>
          <button
            type="button"
            onClick={requestClose}
            className="modal-close-btn"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div className="modal-body">
          {apiError && (
            <div className="ws-error-banner" style={{ marginBottom: '16px' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>{apiError}</p>
            </div>
          )}

          {/* Account / Channel name */}
          <div className="form-field-block">
            <label htmlFor="tt-channel-name" className="field-label">
              Account / Channel name <span style={{ color: 'var(--status-failed)' }}>*</span>
            </label>
            <input
              id="tt-channel-name"
              type="text"
              autoFocus
              className="field-input"
              placeholder="e.g. Acme Corp"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </div>

          {/* Buffer Channel ID */}
          <div className="form-field-block" style={{ marginTop: '16px' }}>
            <label htmlFor="tt-buffer-id" className="field-label">
              Buffer Channel ID <span style={{ color: 'var(--status-failed)' }}>*</span>
            </label>
            <input
              id="tt-buffer-id"
              type="text"
              className="field-input"
              placeholder="e.g. 64a1b2c3d4e5f6a7b8c9d0e1"
              value={bufferChannelId}
              onChange={(e) => setBufferChannelId(e.target.value)}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Find this in your Buffer dashboard under Channels, after connecting this TikTok account to Buffer.
            </p>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={requestClose}
            className="btn-secondary-outline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            id="tt-save-btn"
            onClick={handleSave}
            className="btn-primary-teal"
            disabled={!canSave}
          >
            {isSubmitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
