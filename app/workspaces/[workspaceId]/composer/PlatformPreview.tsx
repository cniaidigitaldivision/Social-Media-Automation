'use client';

import React from 'react';
import { Globe, MoreHorizontal, Heart, MessageCircle, Send, Bookmark, ThumbsUp, MessageSquare, Share2, Repeat2, Play, Music2, Video } from 'lucide-react';

interface PlatformPreviewProps {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'youtube';
  accountName: string;
  caption: string;
  mediaUrls: string[];
  /** YouTube only — the separate Video Title field */
  title?: string;
}

export function PlatformPreview({ platform, accountName, caption, mediaUrls, title }: PlatformPreviewProps) {
  const avatarInitials = accountName.slice(0, 2).toUpperCase();

  // Highlight hashtags in captions (used by Instagram and TikTok)
  const formatHashtagCaption = (text: string) => {
    if (!text) return null;
    return text.split(/(\s+)/).map((word, i) => {
      if (word.startsWith('#')) {
        return <span key={i} style={{ color: '#00376b' }}>{word}</span>;
      }
      return word;
    });
  };

  // ── Facebook ──────────────────────────────────────────────────────────────
  if (platform === 'facebook') {
    return (
      <div className="preview-fb-card">
        <div className="preview-header">
          <div className="preview-author-group">
            <div className="preview-brand-avatar" style={{ backgroundColor: '#1877F2' }}>
              {avatarInitials}
            </div>
            <div>
              <div className="preview-brand-title">{accountName}</div>
              <div className="preview-time-row">
                Just now <span className="meta-dot">•</span>
                <span className="preview-globe-icon"><Globe size={12} /></span>
              </div>
            </div>
          </div>
          <button className="preview-edit-btn"><MoreHorizontal size={16} /></button>
        </div>

        <div className="preview-body-text" style={{ whiteSpace: 'pre-wrap' }}>
          {caption || 'Your caption will appear here...'}
        </div>

        {mediaUrls.length > 0 && (
          <div className="preview-media-frame">
            <div className="preview-img-container">
              {mediaUrls[0].match(/\.(mp4|webm)$/i) ? (
                <video src={mediaUrls[0]} className="preview-img" controls />
              ) : (
                <img src={mediaUrls[0]} alt="Post media" className="preview-img" />
              )}
            </div>
          </div>
        )}

        <div className="fb-action-bar" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '8px 16px', borderTop: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}><ThumbsUp size={16} /> Like</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}><MessageSquare size={16} /> Comment</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}><Share2 size={16} /> Share</div>
        </div>
      </div>
    );
  }

  // ── Instagram ─────────────────────────────────────────────────────────────
  if (platform === 'instagram') {
    return (
      <div className="preview-ig-card">
        <div className="preview-header">
          <div className="preview-author-group">
            <div className="preview-brand-avatar" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', borderRadius: '50%' }}>
              {avatarInitials}
            </div>
            <div className="preview-brand-title">{accountName}</div>
          </div>
          <button className="preview-edit-btn"><MoreHorizontal size={16} /></button>
        </div>

        {mediaUrls.length > 0 ? (
          <div className="preview-media-frame" style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none' }}>
            <div className="preview-img-container">
              {mediaUrls[0].match(/\.(mp4|webm)$/i) ? (
                <video src={mediaUrls[0]} className="preview-img" style={{ height: '320px' }} controls />
              ) : (
                <img src={mediaUrls[0]} alt="Post media" className="preview-img" style={{ height: '320px' }} />
              )}
            </div>
          </div>
        ) : (
          <div className="preview-media-frame" style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Image required for Instagram</div>
          </div>
        )}

        <div className="ig-action-bar" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px 8px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Heart size={22} /><MessageCircle size={22} /><Send size={22} />
          </div>
          <Bookmark size={22} />
        </div>

        <div className="preview-body-text" style={{ padding: '0 16px 16px' }}>
          <span style={{ fontWeight: 600, marginRight: '6px' }}>{accountName}</span>
          <span style={{ whiteSpace: 'pre-wrap' }}>
            {caption ? formatHashtagCaption(caption) : 'Your caption...'}
          </span>
        </div>
      </div>
    );
  }

  // ── LinkedIn ──────────────────────────────────────────────────────────────
  if (platform === 'linkedin') {
    return (
      <div className="preview-fb-card" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div className="preview-header">
          <div className="preview-author-group">
            <div className="preview-brand-avatar" style={{ backgroundColor: '#0A66C2' }}>
              {avatarInitials}
            </div>
            <div>
              <div className="preview-brand-title">{accountName}</div>
              <div className="preview-time-row">
                Just now <span className="meta-dot">•</span>
                <span className="preview-globe-icon"><Globe size={12} /></span>
              </div>
            </div>
          </div>
          <button className="preview-edit-btn"><MoreHorizontal size={16} /></button>
        </div>

        <div className="preview-body-text" style={{ whiteSpace: 'pre-wrap' }}>
          {caption || 'Your caption will appear here...'}
        </div>

        {mediaUrls.length > 0 && (
          <div className="preview-media-frame">
            <div className="preview-img-container">
              {mediaUrls[0].match(/\.(mp4|webm)$/i) ? (
                <video src={mediaUrls[0]} className="preview-img" controls />
              ) : (
                <img src={mediaUrls[0]} alt="Post media" className="preview-img" />
              )}
            </div>
          </div>
        )}

        <div className="fb-action-bar" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '8px 16px', borderTop: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}><ThumbsUp size={16} /> Like</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}><MessageSquare size={16} /> Comment</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}><Repeat2 size={16} /> Repost</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}><Send size={16} /> Send</div>
        </div>
      </div>
    );
  }

  // ── TikTok ────────────────────────────────────────────────────────────────
  if (platform === 'tiktok') {
    return (
      <div style={{
        background: '#000',
        borderRadius: '16px',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: '#fff',
        position: 'relative',
        minHeight: '420px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Video area */}
        {mediaUrls.length > 0 ? (
          <div style={{ flex: 1, position: 'relative', minHeight: '340px', background: '#111' }}>
            {mediaUrls[0].match(/\.(mp4|webm)$/i) ? (
              <video
                src={mediaUrls[0]}
                style={{ width: '100%', height: '340px', objectFit: 'cover', display: 'block' }}
                controls
              />
            ) : (
              <img
                src={mediaUrls[0]}
                alt="TikTok media"
                style={{ width: '100%', height: '340px', objectFit: 'cover', display: 'block' }}
              />
            )}
          </div>
        ) : (
          /* Placeholder when no video attached yet */
          <div style={{
            flex: 1, minHeight: '340px', background: '#1a1a1a',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Video size={24} color="#fff" />
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
              Attach a video to preview
            </div>
          </div>
        )}

        {/* Overlay: bottom caption + actions */}
        <div style={{
          padding: '12px 56px 12px 12px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
          position: mediaUrls.length > 0 ? 'absolute' : 'relative',
          bottom: mediaUrls.length > 0 ? 0 : undefined,
          left: 0, right: 0,
        }}>
          {/* Account name */}
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
            @{accountName}
          </div>
          {/* Caption */}
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
            {caption ? formatHashtagCaption(caption) : <span style={{ opacity: 0.5 }}>Your caption...</span>}
          </div>
          {/* Sound row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
            <Music2 size={12} /> Original sound – {accountName}
          </div>
        </div>

        {/* Right-side action icons */}
        <div style={{
          position: 'absolute', right: '10px', bottom: '60px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px'
        }}>
          {[
            { icon: <Heart size={22} />, label: '0' },
            { icon: <MessageCircle size={22} />, label: '0' },
            { icon: <Share2 size={22} />, label: '0' },
          ].map(({ icon, label }, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              {icon}
              <span style={{ fontSize: '11px' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── YouTube ───────────────────────────────────────────────────────────────
  if (platform === 'youtube') {
    return (
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        fontFamily: 'Roboto, -apple-system, sans-serif',
        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
      }}>
        {/* Thumbnail / video */}
        {mediaUrls.length > 0 ? (
          <div style={{ position: 'relative', background: '#000' }}>
            {mediaUrls[0].match(/\.(mp4|webm)$/i) ? (
              <video
                src={mediaUrls[0]}
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                controls
              />
            ) : (
              <img
                src={mediaUrls[0]}
                alt="YouTube thumbnail"
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
              />
            )}
            {/* Duration badge placeholder */}
            <div style={{
              position: 'absolute', bottom: '8px', right: '8px',
              background: 'rgba(0,0,0,0.8)', color: '#fff',
              fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px'
            }}>
              0:00
            </div>
          </div>
        ) : (
          /* Placeholder thumbnail */
          <div style={{
            width: '100%', aspectRatio: '16/9', background: '#f0f0f0',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%', background: '#e0e0e0',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Play size={22} color="#606060" />
            </div>
            <div style={{ fontSize: '12px', color: '#606060' }}>Attach a video to preview</div>
          </div>
        )}

        {/* Video info row */}
        <div style={{ padding: '10px 12px 14px', display: 'flex', gap: '10px' }}>
          {/* Channel avatar */}
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '13px'
          }}>
            {avatarInitials}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title — prominent, above description */}
            <div style={{
              fontWeight: 600, fontSize: '14px', color: '#0f0f0f', lineHeight: 1.3,
              marginBottom: '4px',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
            }}>
              {title && title.trim()
                ? title
                : <span style={{ color: '#aaa', fontStyle: 'italic' }}>Video title will appear here...</span>
              }
            </div>

            {/* Channel name + metadata */}
            <div style={{ fontSize: '12px', color: '#606060', marginBottom: '4px' }}>
              {accountName} • 0 views • Just now
            </div>

            {/* Description (caption) */}
            {(caption || !title) && (
              <div style={{
                fontSize: '12px', color: '#606060', whiteSpace: 'pre-wrap', lineHeight: 1.4, marginTop: '4px',
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {caption || <span style={{ fontStyle: 'italic' }}>Description will appear here...</span>}
              </div>
            )}
          </div>

          <button className="preview-edit-btn" style={{ flexShrink: 0, alignSelf: 'flex-start' }}>
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
