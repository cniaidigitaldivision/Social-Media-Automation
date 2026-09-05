'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlatformPreview } from './PlatformPreview';
import { submitPost, getUploadSignedUrl, AccountTarget } from './actions';
import { CAPTION_LIMITS } from '@/lib/schemas/post';
import { Hash, Type, UploadCloud, Trash2, Calendar, AlertTriangle, CheckCircle, RefreshCcw, Send } from 'lucide-react';
import { icons } from '@/lib/icons';
import Link from 'next/link';

export function ComposerClient({ workspace, accounts, brandKit }: any) {
  const router = useRouter();
  
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [isPerPlatform, setIsPerPlatform] = useState(false);
  const [sharedCaption, setSharedCaption] = useState('');
  const [platformCaptions, setPlatformCaptions] = useState<Record<string, string>>({});
  
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [scheduledAt, setScheduledAt] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [bannedWordWarn, setBannedWordWarn] = useState(false);
  
  const [activePreviewTab, setActivePreviewTab] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      
      const allText = [sharedCaption, ...Object.values(platformCaptions)].join(' ').toLowerCase();
      const hasBannedWord = brandKit.banned_words.some((word: string) => allText.includes(word.toLowerCase()));
      setBannedWordWarn(hasBannedWord);
    };
    
    const timeout = setTimeout(checkWords, 500);
    return () => clearTimeout(timeout);
  }, [sharedCaption, platformCaptions, brandKit]);
  
  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };
  
  const insertText = (text: string) => {
    // A simplified insert - for real app, we'd use ref and selectionStart
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
      
      // We process files sequentially for simplicity in this implementation
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const { signedUrl, publicUrl } = await getUploadSignedUrl(workspace.id, file.name, file.type);
        
        await fetch(signedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          }
        });
        
        newUrls.push(publicUrl);
        setUploadProgress(10 + Math.floor(80 * ((i + 1) / e.target.files.length)));
      }
      
      setMediaUrls(newUrls);
    } catch (err) {
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
  
  const handleSubmit = async (isDraft: boolean) => {
    setIsSubmitting(true);
    setErrors({});
    setServerError('');
    setSuccessStatus(null);
    
    // Prepare captions dictionary
    const captions: Record<string, string> = {};
    for (const id of selectedAccounts) {
      captions[id] = isPerPlatform ? platformCaptions[id] : sharedCaption;
    }
    
    const accountTargets = selectedAccounts.map(id => {
      const acc = accounts.find((a: any) => a.id === id);
      return { id, platform: acc.platform, name: acc.name } as AccountTarget;
    });
    
    let scheduledDate = null;
    if (scheduledAt) {
      scheduledDate = new Date(scheduledAt).toISOString();
    }
    
    try {
      const result = await submitPost(
        {
          accounts: accountTargets,
          captions,
          mediaUrls,
          scheduledAt: scheduledDate
        },
        workspace.id,
        isDraft,
        workspace.requires_approval
      );
      
      if (result.success) {
        setSuccessStatus(result.status || 'saved');
        // We could redirect here or just clear the form
        if (!isDraft) {
          setTimeout(() => router.push(`/workspaces/${workspace.id}/calendar`), 2000);
        }
      } else {
        if (result.errors) setErrors(result.errors);
        if (result.serverError) setServerError(result.serverError);
      }
    } catch (e) {
      setServerError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Group accounts by platform
  const fbAccounts = accounts.filter((a: any) => a.platform === 'facebook');
  const igAccounts = accounts.filter((a: any) => a.platform === 'instagram');
  
  const isInstagramSelected = selectedAccounts.some(id => accounts.find((a: any) => a.id === id)?.platform === 'instagram');

  // Compute timezone min for schedule (primitive approach)
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localIso = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 16);
  
  return (
    <div className="composer-page-layout">
      {/* Left Pane: Form */}
      <div className="composer-left-pane">
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Create Post</h1>
        
        {serverError && (
          <div className="brand-warn-banner" style={{ backgroundColor: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b' }}>
            <AlertTriangle size={16} /> {serverError}
          </div>
        )}
        
        {successStatus && (
          <div className="composer-success-banner">
            <CheckCircle size={18} /> Post successfully {successStatus.replace('_', ' ')}!
          </div>
        )}

        {/* 1. Target Accounts */}
        <div className="composer-section-card">
          <span className="section-label">Target Accounts</span>
          
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
            {/* Facebook Accounts */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{icons.facebook}</span> Facebook
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {fbAccounts.map((acc: any) => {
                  const isDisabled = acc.status !== 'active';
                  return (
                    <label key={acc.id} className={`account-target-row ${isDisabled ? 'disabled' : ''}`}>
                      <input 
                        type="checkbox" 
                        checked={selectedAccounts.includes(acc.id)} 
                        onChange={() => handleAccountToggle(acc.id)}
                        disabled={isDisabled}
                      />
                      <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 500 }}>{acc.name}</span>
                      {isDisabled && (
                        <Link href={`/workspaces/${workspace.id}/accounts`} style={{ marginLeft: 'auto', fontSize: '11px', color: '#ea580c', pointerEvents: 'auto' }}>
                          ⚠ Reconnect
                        </Link>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
            
            {/* Instagram Accounts */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{icons.instagram}</span> Instagram
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {igAccounts.map((acc: any) => {
                  const isDisabled = acc.status !== 'active';
                  return (
                    <label key={acc.id} className={`account-target-row ${isDisabled ? 'disabled' : ''}`}>
                      <input 
                        type="checkbox" 
                        checked={selectedAccounts.includes(acc.id)} 
                        onChange={() => handleAccountToggle(acc.id)}
                        disabled={isDisabled}
                      />
                      <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 500 }}>{acc.name}</span>
                      {isDisabled && (
                        <Link href={`/workspaces/${workspace.id}/accounts`} style={{ marginLeft: 'auto', fontSize: '11px', color: '#ea580c', pointerEvents: 'auto' }}>
                          ⚠ Reconnect
                        </Link>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
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
              <textarea 
                className="composer-textarea"
                placeholder="What do you want to talk about?"
                value={sharedCaption}
                onChange={(e) => setSharedCaption(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  {Object.entries(errors).map(([id, err]) => err && id !== 'accounts' ? <div key={id} className="field-error-msg">{err}</div> : null)}
                </div>
                {/* Simplified char count - lowest common denominator is IG if selected */}
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
                const limit = acc.platform === 'instagram' ? CAPTION_LIMITS.instagram : CAPTION_LIMITS.facebook;
                const captionText = platformCaptions[id] ?? sharedCaption;
                
                return (
                  <div key={id} className="per-platform-caption-block">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                      <span style={{ width: 12, height: 12, display: 'inline-flex' }}>{acc.platform === 'facebook' ? icons.facebook : icons.instagram}</span> {acc.name}
                    </div>
                    <textarea 
                      className="composer-textarea"
                      placeholder={`Caption for ${acc.name}...`}
                      value={captionText}
                      onChange={(e) => setPlatformCaptions(prev => ({ ...prev, [id]: e.target.value }))}
                      onFocus={() => setActivePreviewTab(id)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        {errors[id] && <div className="field-error-msg">{errors[id]}</div>}
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
              <div className="brand-helper-bar">
                {brandKit.default_hashtags?.map((tag: string, i: number) => (
                  <button key={`tag-${i}`} className="tool-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => insertText(tag)}>
                    <Hash size={10} /> {tag.replace('#', '')}
                  </button>
                ))}
                {brandKit.cta_library?.map((cta: string, i: number) => (
                  <button key={`cta-${i}`} className="tool-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => insertText(cta)}>
                    <Type size={10} /> {cta.length > 20 ? cta.substring(0, 20) + '...' : cta}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* 3. Media */}
        <div className="composer-section-card">
          <span className="section-label">Media</span>
          
          <div 
            className="media-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="dropzone-icon-circle">
              <UploadCloud size={20} />
            </div>
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
              <div style={{ height: '100%', width: `${uploadProgress}%`, backgroundColor: 'var(--cni-teal-primary)', transition: 'width 0.3s' }}></div>
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
          
          {isInstagramSelected && mediaUrls.length === 0 && (
            <div className="instagram-media-warn">
              <AlertTriangle size={14} /> Instagram requires at least one image or video.
            </div>
          )}
        </div>
        
        {/* 4. Schedule */}
        <div className="composer-section-card">
          <span className="section-label">Schedule</span>
          <div className="schedule-field-row">
            <div style={{ position: 'relative', flex: 1 }}>
              <Calendar size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="datetime-local" 
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={localIso}
                style={{ width: '100%', padding: '10px 12px 10px 34px', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', fontSize: '13px', outline: 'none' }}
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
      
      {/* Right Pane: Live Preview */}
      <div className="composer-right-pane">
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>Live Preview</h2>
        
        {selectedAccounts.length > 0 ? (
          <>
            <div className="preview-tab-switcher">
              {selectedAccounts.map(id => {
                const acc = accounts.find((a: any) => a.id === id);
                if (!acc) return null;
                const isActive = activePreviewTab === id;
                return (
                  <button 
                    key={id} 
                    className={`platform-chip ${isActive ? 'active' : ''}`}
                    onClick={() => setActivePreviewTab(id)}
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    <span style={{ width: 12, height: 12, display: 'inline-flex' }}>{acc.platform === 'facebook' ? icons.facebook : icons.instagram}</span>
                    {acc.name}
                  </button>
                );
              })}
            </div>
            
            {activePreviewTab && (
              <PlatformPreview 
                platform={accounts.find((a: any) => a.id === activePreviewTab)?.platform || 'facebook'}
                accountName={accounts.find((a: any) => a.id === activePreviewTab)?.name || 'Account'}
                caption={isPerPlatform ? (platformCaptions[activePreviewTab] || '') : sharedCaption}
                mediaUrls={mediaUrls}
              />
            )}
          </>
        ) : (
          <div style={{ border: '1px dashed var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', backgroundColor: 'var(--bg-card)' }}>
            Select an account on the left to see the preview.
          </div>
        )}
      </div>
    </div>
  );
}
