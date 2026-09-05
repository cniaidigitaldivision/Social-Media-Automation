'use client';

import React from 'react';
import { Globe, MoreHorizontal, Heart, MessageCircle, Send, Bookmark, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';

interface PlatformPreviewProps {
  platform: 'facebook' | 'instagram';
  accountName: string;
  caption: string;
  mediaUrls: string[];
}

export function PlatformPreview({ platform, accountName, caption, mediaUrls }: PlatformPreviewProps) {
  const avatarInitials = accountName.slice(0, 2).toUpperCase();

  // Function to highlight hashtags in Instagram captions
  const formatInstagramCaption = (text: string) => {
    if (!text) return null;
    return text.split(/(\s+)/).map((word, i) => {
      if (word.startsWith('#')) {
        return (
          <span key={i} style={{ color: '#00376b' }}>
            {word}
          </span>
        );
      }
      return word;
    });
  };

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
                <span className="preview-globe-icon">
                  <Globe size={12} />
                </span>
              </div>
            </div>
          </div>
          <button className="preview-edit-btn">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <div className="preview-body-text" style={{ whiteSpace: 'pre-wrap' }}>
          {caption || 'Your caption will appear here...'}
        </div>

        {mediaUrls.length > 0 && (
          <div className="preview-media-frame">
            <div className="preview-img-container">
              {/* Note: Just showing the first image for the preview to keep it simple */}
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
          <button className="preview-edit-btn">
            <MoreHorizontal size={16} />
          </button>
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
            <Heart size={22} />
            <MessageCircle size={22} />
            <Send size={22} />
          </div>
          <Bookmark size={22} />
        </div>

        <div className="preview-body-text" style={{ padding: '0 16px 16px' }}>
          <span style={{ fontWeight: 600, marginRight: '6px' }}>{accountName}</span>
          <span style={{ whiteSpace: 'pre-wrap' }}>
            {caption ? formatInstagramCaption(caption) : 'Your caption...'}
          </span>
        </div>
      </div>
    );
  }

  return null;
}
