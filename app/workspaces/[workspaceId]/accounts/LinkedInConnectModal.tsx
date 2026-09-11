'use client';

import { useEffect, useCallback, useState } from 'react';
import { X } from 'lucide-react';
import { connectLinkedIn } from './linkedin/actions';

interface LinkedInConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export function LinkedInConnectModal({ isOpen, onClose, workspaceId }: LinkedInConnectModalProps) {
  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const canSave = orgName.trim().length > 0 && orgId.trim().length > 0 && !isSubmitting;

  const requestClose = useCallback(() => {
    if (isSubmitting) return;
    setOrgName('');
    setOrgId('');
    setApiError('');
    onClose();
  }, [isSubmitting, onClose]);

  // Close on Escape key — mirrors NewWorkspaceModal pattern exactly
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
      const result = await connectLinkedIn(workspaceId, orgName.trim(), orgId.trim());
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
    // Backdrop — click anywhere outside modal-dialog to close, mirrors NewWorkspaceModal
    <div
      className="modal-backdrop"
      onClick={requestClose}
    >
      {/* Stop propagation so clicks inside the dialog don't bubble up to the backdrop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="li-modal-title"
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="modal-header">
          <h2 id="li-modal-title" className="modal-title">Connect LinkedIn</h2>
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

          {/* Organization / Page name */}
          <div className="form-field-block">
            <label htmlFor="li-org-name" className="field-label">
              Organization / Page name <span style={{ color: 'var(--status-failed)' }}>*</span>
            </label>
            <input
              id="li-org-name"
              type="text"
              autoFocus
              className="field-input"
              placeholder="e.g. Acme Corp"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          {/* Organization ID */}
          <div className="form-field-block" style={{ marginTop: '16px' }}>
            <label htmlFor="li-org-id" className="field-label">
              Organization ID <span style={{ color: 'var(--status-failed)' }}>*</span>
            </label>
            <input
              id="li-org-id"
              type="text"
              inputMode="numeric"
              className="field-input"
              placeholder="e.g. 12345678"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Find this in your LinkedIn Company Page admin URL, e.g.{' '}
              <code style={{ fontFamily: 'monospace' }}>linkedin.com/company/12345678/admin</code>
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
            id="li-save-btn"
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
