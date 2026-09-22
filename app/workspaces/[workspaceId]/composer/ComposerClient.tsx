'use client';

import React, { useState, useRef, useEffect } from 'react';
import { submitPost, getUploadSignedUrl, AccountTarget } from './actions';
import { CAPTION_LIMITS } from '@/lib/schemas/post';
import { Hash, Type, UploadCloud, Trash2, Calendar, AlertTriangle, CheckCircle, RefreshCcw, Send } from 'lucide-react';
import { icons } from '@/lib/icons';
import Link from 'next/link';

type SuccessInfo = {
  status: string;
  scheduledAt: string | null;
  accountCount: number;
};

const SUCCESS_LABELS: Record<string, string> = {
  scheduled: 'Post scheduled successfully',
  pending_approval: 'Sent for approval',
  draft: 'Draft saved',
};

const SUCCESS_BADGE_CLASS: Record<string, string> = {
  scheduled: 'badge-published',
  pending_approval: 'badge-pending',
  draft: 'badge-draft',
};

function successHeadline({ status, accountCount }: SuccessInfo) {
  const label = SUCCESS_LABELS[status] || `Post saved with status "${status.replace(/_/g, ' ')}"`;
  return `${label} — ${accountCount} account${accountCount === 1 ? '' : 's'}`;
}

/** Returns the correct icon element for a given platform string */
function platformIcon(platform: string): React.ReactNode {
  const map: Record<string, React.ReactNode> = {
    facebook: icons.facebook,
    instagram: icons.instagram,
    linkedin: icons.linkedin,
    tiktok: icons.tiktok,
    youtube: icons.youtube,
  };
  return map[platform] ?? null;
}

export function ComposerClient({ workspace, accounts, brandKit }: any) {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [isPerPlatform, setIsPerPlatform] = useState(false);
  const [sharedCaption, setSharedCaption] = useState('');
  const [platformCaptions, setPlatformCaptions] = useState<Record<string, string>>({});
  // YouTube-specific per-account title state
  const [platformTitles, setPlatformTitles] = useState<Record<string, string>>({});

  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [scheduledAt, setScheduledAt] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [successInfo, setSuccessInfo] = useState<SuccessInfo | null>(null);
  const [bannedWordWarn, setBannedWordWarn] = useState(false);

  const [activePreviewTab, setActivePreviewTab] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const leftPaneRef = useRef<HTMLDivElement>(null);

  // Set default preview tab when selection changes
  useEffect(() => {
    if (selectedAccounts.length > 0 && !selectedAccounts.includes(activePreviewTab || '')) {
      setActivePreviewTab(selectedAccounts[0]);
    } else if (selectedAccounts.length === 0) {
      setActivePreviewTab(null);
    }
  }, [selectedAccounts, activePreviewTab]);

  // Debounced banned words check
  useEffect(() => {
    const checkWords = () => {
      if (!brandKit?.banned_words || brandKit.banned_words.length === 0) return;
      const allText = [sharedCaption, ...Object.values(platformCaptions), ...Object.values(platformTitles)].join(' ').toLowerCase();
      const hasBannedWord = brandKit.banned_words.some((word: string) => allText.includes(word.toLowerCase()));
      setBannedWordWarn(hasBannedWord);
    };
    const timeout = setTimeout(checkWords, 500);
    return () => clearTimeout(timeout);
  }, [sharedCaption, platformCaptions, platformTitles, brandKit]);

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const insertText = (text: string) => {
    if (!isPerPlatform) {
      setSharedCaption(prev => prev + ' ' + text);
    } else {
      if (activePreviewTab) {
        setPlatformCaptions(prev => ({
          ...prev,
          [activePreviewTab]: (prev[activePreviewTab] || '') + ' ' + text
        }));
      }
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(10);
    setServerError('');
    try {
      const newUrls = [...mediaUrls];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const { signedUrl, publicUrl } = await getUploadSignedUrl(workspace.id, file.name, file.type);
        await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        newUrls.push(publicUrl);
        setUploadProgress(10 + Math.floor(80 * ((i + 1) / e.target.files.length)));
      }
      setMediaUrls(newUrls);
    } catch {
      setServerError('Failed to upload media. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeMedia = (index: number) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSelectedAccounts([]);
    setIsPerPlatform(false);
    setSharedCaption('');
    setPlatformCaptions({});
    setPlatformTitles({});
    setMediaUrls([]);
    setScheduledAt('');
    setErrors({});
    setServerError('');
    setBannedWordWarn(false);
    setActivePreviewTab(null);
  };

  const handleSubmit = async (isDraft: boolean) => {
    setIsSubmitting(true);
    setErrors({});
    setServerError('');
    setSuccessInfo(null);

    const captions: Record<string, string> = {};
    const titles: Record<string, string> = {};

    for (const id of selectedAccounts) {
      captions[id] = isPerPlatform ? (platformCaptions[id] ?? sharedCaption) : sharedCaption;
      titles[id] = platformTitles[id] ?? '';
    }

    const accountTargets = selectedAccounts.map(id => {
      const acc = accounts.find((a: any) => a.id === id);
      return { id, platform: acc.platform, name: acc.account_name } as AccountTarget;
    });

    const scheduledDate = scheduledAt ? new Date(scheduledAt).toISOString() : null;

    try {
      const result = await submitPost(
        { accounts: accountTargets, captions, titles, mediaUrls, scheduledAt: scheduledDate },
        workspace.id,
        isDraft,
        workspace.requires_approval
      );

      if (result.success) {
        setSuccessInfo({ status: result.status || 'saved', scheduledAt: scheduledDate, accountCount: accountTargets.length });
        resetForm();
        leftPaneRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (result.errors) setErrors(result.errors);
        if (result.serverError) setServerError(result.serverError);
      }
    } catch {
      setServerError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Account groups ──────────────────────────────────────────────────────
  const fbAccounts = accounts.filter((a: any) => a.platform === 'facebook');
  const igAccounts = accounts.filter((a: any) => a.platform === 'instagram');
  const liAccounts = accounts.filter((a: any) => a.platform === 'linkedin');
  const ttAccounts = accounts.filter((a: any) => a.platform === 'tiktok');
  const ytAccounts = accounts.filter((a: any) => a.platform === 'youtube');

  // ── Selection flags ─────────────────────────────────────────────────────
  const getSelectedPlatform = (platform: string) =>
    selectedAccounts.some(id => accounts.find((a: any) => a.id === id)?.platform === platform);

  const isInstagramSelected = getSelectedPlatform('instagram');
  const isTikTokSelected = getSelectedPlatform('tiktok');
  const isYouTubeSelected = getSelectedPlatform('youtube');
  const needsMediaWarn = (isInstagramSelected || isTikTokSelected || isYouTubeSelected) && mediaUrls.length === 0;

  // Schedule input min
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localIso = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 16);

  const connectedPlatforms = [
    { id: 'facebook', label: 'Facebook', items: fbAccounts },
    { id: 'instagram', label: 'Instagram', items: igAccounts },
    { id: 'linkedin', label: 'LinkedIn', items: liAccounts },
    { id: 'tiktok', label: 'TikTok', items: ttAccounts },
    { id: 'youtube', label: 'YouTube', items: ytAccounts }
  ].filter(p => p.items.length > 0);

  return (
    <div className="composer-page-layout page-content-wrapper">
      {/* Left Pane: Form */}
      <div className="composer-left-pane" ref={leftPaneRef}>
        <h1 className="page-main-title">Create Post</h1>

        {serverError && (
          <div className="brand-warn-banner" style={{ backgroundColor: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b' }}>
            <AlertTriangle size={16} /> {serverError}
          </div>
        )}

        {successInfo && (
          <div className="composer-success-banner" role="status" style={{ alignItems: 'flex-start' }}>
            <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span>{successHeadline(successInfo)}</span>
              <span style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)' }}>
                <span className={`status-badge ${SUCCESS_BADGE_CLASS[successInfo.status] || 'badge-draft'}`}>
                  {successInfo.status.replace(/_/g, ' ')}
                </span>
                {successInfo.scheduledAt ? (
                  <span>Scheduled for {new Date(successInfo.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                ) : (
                  <span>Saved successfully</span>
                )}
                <span>• {successInfo.accountCount} {successInfo.accountCount === 1 ? 'account' : 'accounts'}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessInfo(null)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. Target Accounts */}
        {/* 1. Target Accounts */}
        <div className="composer-section-card">
          <span className="section-label">Target Accounts</span>

          <div className="account-targets-grid">
            {connectedPlatforms.map(platform => (
              <React.Fragment key={platform.id}>
                {platform.items.map((acc: any) => {
                  const isDisabled = acc.status !== 'active';
                  const isSelected = selectedAccounts.includes(acc.id);
                  return (
                    <label key={acc.id} className={`account-chip ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: platform.id === 'youtube' ? 20 : 18, height: platform.id === 'youtube' ? 20 : 18, display: 'inline-flex' }}>{platformIcon(platform.id)}</span>
                        <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 600 }}>{platform.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {isDisabled && (
                          <Link href={`/workspaces/${workspace.id}/accounts`} style={{ fontSize: '12px', color: '#ea580c', pointerEvents: 'auto', fontWeight: 600, textDecoration: 'none' }}>
                            ⚠ Reconnect
                          </Link>
                        )}
                        <input
                          type="checkbox"
                          className="account-chip-checkbox"
                          style={{ margin: 0 }}
                          checked={isSelected}
                          onChange={() => handleAccountToggle(acc.id)}
                          disabled={isDisabled}
                        />
                      </div>
                    </label>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {errors['accounts'] && <div className="field-error-msg">{errors['accounts']}</div>}
        </div>

        {/* 2. Caption */}
        <div className="composer-section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="section-label" style={{ marginBottom: 0 }}>Caption</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" checked={isPerPlatform} onChange={(e) => setIsPerPlatform(e.target.checked)} />
              Customize per platform
            </label>
          </div>

          {bannedWordWarn && (
            <div className="brand-warn-banner">
              <AlertTriangle size={14} /> Warning: Your caption contains a banned word from your brand kit.
            </div>
          )}

          {!isPerPlatform ? (
            <div className="per-platform-caption-block">
              {/* YouTube title (shared mode): show if any YouTube account selected */}
              {isYouTubeSelected && (
                <div style={{ marginBottom: '12px' }}>
                  {selectedAccounts
                    .filter(id => accounts.find((a: any) => a.id === id)?.platform === 'youtube')
                    .map(id => {
                      const acc = accounts.find((a: any) => a.id === id);
                      const titleVal = platformTitles[id] ?? '';
                      return (
                        <div key={id} style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <label htmlFor={`yt-title-${id}`} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: 20, height: 20, display: 'inline-flex' }}>{icons.youtube}</span>
                              Video Title for <em style={{ fontStyle: 'normal', color: 'var(--text-muted)' }}>{acc?.account_name}</em>
                              <span style={{ color: 'var(--status-failed)' }}>*</span>
                            </label>
                            <span className={`char-counter ${titleVal.length > CAPTION_LIMITS.youtube_title ? 'over-limit' : ''}`}>
                              {titleVal.length} / {CAPTION_LIMITS.youtube_title}
                            </span>
                          </div>
                          <input
                            id={`yt-title-${id}`}
                            type="text"
                            className="field-input"
                            placeholder="Enter video title…"
                            maxLength={CAPTION_LIMITS.youtube_title + 10}
                            value={titleVal}
                            onChange={(e) => setPlatformTitles(prev => ({ ...prev, [id]: e.target.value }))}
                          />
                          {errors[id] && errors[id].toLowerCase().includes('title') && (
                            <div className="field-error-msg">{errors[id]}</div>
                          )}
                        </div>
                      );
                    })}
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Caption below becomes the YouTube <strong>Description</strong>
                  </div>
                </div>
              )}

              <textarea
                className="composer-textarea"
                placeholder={isYouTubeSelected ? 'YouTube description / caption for other platforms…' : 'What do you want to talk about?'}
                value={sharedCaption}
                onChange={(e) => setSharedCaption(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  {Object.entries(errors).map(([id, err]) =>
                    err && id !== 'accounts' && !err.toLowerCase().includes('title')
                      ? <div key={id} className="field-error-msg">{err}</div>
                      : null
                  )}
                </div>
                <div className={`char-counter ${sharedCaption.length > CAPTION_LIMITS.instagram && isInstagramSelected ? 'over-limit' : ''}`}>
                  {sharedCaption.length} / {isInstagramSelected ? CAPTION_LIMITS.instagram : CAPTION_LIMITS.facebook}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedAccounts.map(id => {
                const acc = accounts.find((a: any) => a.id === id);
                if (!acc) return null;
                const isYT = acc.platform === 'youtube';
                const limit = acc.platform === 'instagram'
                  ? CAPTION_LIMITS.instagram
                  : acc.platform === 'linkedin'
                    ? CAPTION_LIMITS.linkedin
                    : acc.platform === 'youtube'
                      ? CAPTION_LIMITS.youtube_description
                      : CAPTION_LIMITS.facebook;
                const captionText = platformCaptions[id] ?? sharedCaption;
                const titleVal = platformTitles[id] ?? '';

                return (
                  <div key={id} className="per-platform-caption-block">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                      <span style={{ width: 12, height: 12, display: 'inline-flex' }}>{platformIcon(acc.platform)}</span>
                      {acc.account_name}
                    </div>

                    {/* YouTube title field — per-platform mode */}
                    {isYT && (
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <label htmlFor={`yt-title-pp-${id}`} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                            Video Title <span style={{ color: 'var(--status-failed)' }}>*</span>
                          </label>
                          <span className={`char-counter ${titleVal.length > CAPTION_LIMITS.youtube_title ? 'over-limit' : ''}`}>
                            {titleVal.length} / {CAPTION_LIMITS.youtube_title}
                          </span>
                        </div>
                        <input
                          id={`yt-title-pp-${id}`}
                          type="text"
                          className="field-input"
                          placeholder="Enter video title…"
                          maxLength={CAPTION_LIMITS.youtube_title + 10}
                          value={titleVal}
                          onChange={(e) => setPlatformTitles(prev => ({ ...prev, [id]: e.target.value }))}
                          onFocus={() => setActivePreviewTab(id)}
                        />
                        {errors[id] && errors[id].toLowerCase().includes('title') && (
                          <div className="field-error-msg">{errors[id]}</div>
                        )}
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Caption below is the YouTube Description
                        </div>
                      </div>
                    )}

                    <textarea
                      className="composer-textarea"
                      placeholder={isYT ? `Description for ${acc.account_name}…` : `Caption for ${acc.account_name}...`}
                      value={captionText}
                      onChange={(e) => setPlatformCaptions(prev => ({ ...prev, [id]: e.target.value }))}
                      onFocus={() => setActivePreviewTab(id)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        {errors[id] && !errors[id].toLowerCase().includes('title') && (
                          <div className="field-error-msg">{errors[id]}</div>
                        )}
                      </div>
                      <div className={`char-counter ${captionText.length > limit ? 'over-limit' : ''}`}>
                        {captionText.length} / {limit}
                      </div>
                    </div>
                  </div>
                );
              })}
              {selectedAccounts.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Select at least one account to customize captions.
                </div>
              )}
            </div>
          )}

          {brandKit && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Brand Kit Helpers</div>
              <div className="brand-helper-bar" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {brandKit.default_hashtags?.map((tag: string, i: number) => (
                  <button key={`tag-${i}`} className="brand-pill" onClick={() => insertText(tag)}>
                    <Hash size={12} /> {tag.replace('#', '')}
                  </button>
                ))}
                {brandKit.cta_library?.map((cta: string, i: number) => (
                  <button key={`cta-${i}`} className="brand-pill" onClick={() => insertText(cta)}>
                    <Type size={12} /> {cta.length > 20 ? cta.substring(0, 20) + '...' : cta}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Media */}
        <div className="composer-section-card">
          <span className="section-label">Media</span>

          <div className="media-dropzone" onClick={() => fileInputRef.current?.click()}>
            <div className="dropzone-icon-circle"><UploadCloud size={20} /></div>
            <div className="dropzone-title">Click or drag files here</div>
            <div className="dropzone-subtitle">Supported formats: JPG, PNG, WEBP, MP4</div>
            <button className="btn-browse-files">Browse Files</button>
            <input
              type="file"
              className="hidden-file-input"
              ref={fileInputRef}
              multiple
              accept="image/jpeg, image/png, image/webp, video/mp4"
              onChange={handleUpload}
            />
          </div>

          {isUploading && (
            <div style={{ marginTop: '12px', height: '4px', backgroundColor: 'var(--bg-hover)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${uploadProgress}%`, backgroundColor: 'var(--cni-teal-primary)', transition: 'width 0.3s' }} />
            </div>
          )}

          {mediaUrls.length > 0 && (
            <div className="media-thumb-grid">
              {mediaUrls.map((url, i) => (
                <div key={i} className="media-thumb-item">
                  {url.match(/\.(mp4|webm)$/i) ? (
                    <video src={url} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  ) : (
                    <img src={url} alt="Upload" />
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeMedia(i); }}
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Media requirement warnings — Instagram, TikTok, YouTube all require media */}
          {isInstagramSelected && mediaUrls.length === 0 && (
            <div className="instagram-media-warn">
              <AlertTriangle size={14} /> Instagram requires at least one image or video.
            </div>
          )}
          {isTikTokSelected && mediaUrls.length === 0 && (
            <div className="instagram-media-warn">
              <AlertTriangle size={14} /> TikTok requires at least one video.
            </div>
          )}
          {isYouTubeSelected && mediaUrls.length === 0 && (
            <div className="instagram-media-warn">
              <AlertTriangle size={14} /> YouTube requires at least one video.
            </div>
          )}
        </div>

        {/* 4. Schedule */}
        <div className="composer-section-card">
          <span className="section-label">Schedule</span>
          <div className="schedule-field-row">
            <div className="schedule-input-wrapper">
              <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--cni-teal-primary)', zIndex: 2 }} />
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={localIso}
              />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Timezone: <strong>{workspace.timezone}</strong>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="composer-submit-row">
          <button
            className="preset-btn"
            style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, border: '1px solid var(--border-card)', opacity: isSubmitting ? 0.7 : 1 }}
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
          >
            Save Draft
          </button>

          <button
            className="btn-new-post-header"
            style={{ padding: '10px 20px', fontSize: '13px', opacity: isSubmitting ? 0.7 : 1 }}
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><RefreshCcw size={16} className="animate-spin" /> Submitting...</>
            ) : (
              <><Send size={16} /> Schedule Post</>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
