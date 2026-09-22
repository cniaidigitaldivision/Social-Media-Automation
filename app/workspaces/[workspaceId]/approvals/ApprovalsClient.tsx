'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { icons } from '@/lib/icons';
import { approvePost, rejectPost, updatePost } from './actions';
import Link from 'next/link';

interface ApprovalsClientProps {
  workspaceId: string;
  initialPosts: any[];
  timezone: string;
}

const isVideo = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url);

export default function ApprovalsClient({ workspaceId, initialPosts, timezone }: ApprovalsClientProps) {
  const [activeTab, setActiveTab] = useState('pending_approval');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  
  // Edit Modal State
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editScheduledAt, setEditScheduledAt] = useState('');

  // Dropdown States
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const platformDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
      }
      if (platformDropdownRef.current && !platformDropdownRef.current.contains(event.target as Node)) {
        setPlatformDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Flatten posts into variants
  const allVariants = useMemo(() => {
    const variants: any[] = [];
    initialPosts.forEach(post => {
      if (post.post_variants) {
        post.post_variants.forEach((v: any) => {
          variants.push({
            ...v,
            parent_post: post
          });
        });
      }
    });
    return variants;
  }, [initialPosts]);

  // Filter Logic
  const filteredVariants = useMemo(() => {
    return allVariants.filter(variant => {
      // 1. Tab / Status filter
      if (activeTab !== 'all' && variant.parent_post.status !== activeTab) return false;
      
      // 2. Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const captionMatch = variant.caption?.toLowerCase().includes(query);
        const accountMatch = variant.connected_accounts?.account_name?.toLowerCase().includes(query);
        if (!captionMatch && !accountMatch) return false;
      }
      
      // 3. Platform filter
      if (platformFilter !== 'all' && variant.platform !== platformFilter) return false;
      
      return true;
    });
  }, [allVariants, activeTab, searchQuery, platformFilter]);

  const handleApprove = async (postId: string) => {
    try {
      await approvePost(postId, workspaceId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (postId: string) => {
    try {
      await rejectPost(postId, workspaceId);
    } catch (e) {
      console.error(e);
    }
  };

  const openEditModal = (variant: any) => {
    setEditingPost(variant);
    setEditCaption(variant.caption || '');
    if (variant.parent_post.scheduled_at) {
      const dateObj = new Date(variant.parent_post.scheduled_at);
      // Format to datetime-local
      const iso = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      setEditScheduledAt(iso);
    } else {
      setEditScheduledAt('');
    }
  };

  const saveEdit = async () => {
    if (!editingPost) return;
    try {
      await updatePost(
        editingPost.id, 
        editingPost.parent_post.id, 
        editCaption, 
        editScheduledAt, 
        workspaceId
      );
      setEditingPost(null);
    } catch (e) {
      console.error(e);
      alert('Failed to update post');
    }
  };

  return (
    <div className="appr-dashboard">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="appr-page-header">
        <h1 className="page-main-title">Approvals</h1>
        <p className="page-subtitle">
          Manage and review all your posts before they go live.
        </p>
      </div>

      {/* ── Tabs & Filters ──────────────────────────────────────────────────── */}
      <div 
        className="appr-controls-bar"
        style={{
          padding: '20px 24px',
          marginBottom: '32px',
          border: '1px solid var(--border-card)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        <div className="appr-status-dropdown-container" ref={statusDropdownRef} style={{ position: 'relative' }}>
          <button 
            className="appr-status-dropdown-btn"
            onClick={() => {
              setStatusDropdownOpen(!statusDropdownOpen);
              setPlatformDropdownOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-main)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              minWidth: '180px',
              justifyContent: 'space-between',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cni-teal-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-card)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'flex', width: '16px', justifyContent: 'center', color: 'var(--text-muted)' }}>
                {activeTab === 'all' ? icons.grid : 
                 activeTab === 'pending_approval' ? icons.clock : 
                 activeTab === 'scheduled' ? icons.checkCircle : icons.xCircle}
              </span>
              <span>
                {activeTab === 'all' ? 'All Posts' : 
                 activeTab === 'pending_approval' ? 'Pending' : 
                 activeTab === 'scheduled' ? 'Approved' : 'Rejected'}
              </span>
            </div>
            <svg 
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round" 
              style={{ transform: statusDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-muted)' }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          {statusDropdownOpen && (
            <div 
              className="appr-status-dropdown-menu"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                zIndex: 50,
                minWidth: '180px',
                overflow: 'hidden',
                padding: '8px'
              }}
            >
              {[
                { id: 'all', label: 'All Posts', icon: icons.grid },
                { id: 'pending_approval', label: 'Pending', icon: icons.clock },
                { id: 'scheduled', label: 'Approved', icon: icons.checkCircle },
                { id: 'cancelled', label: 'Rejected', icon: icons.xCircle },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setActiveTab(opt.id);
                    setStatusDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    marginBottom: '2px',
                    borderRadius: 'var(--radius-sm)',
                    background: activeTab === opt.id ? 'var(--bg-hover)' : 'transparent',
                    border: 'none',
                    color: activeTab === opt.id ? 'var(--cni-teal-primary)' : 'var(--text-main)',
                    fontSize: '14px',
                    fontWeight: activeTab === opt.id ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== opt.id) {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== opt.id) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'flex', width: '16px', justifyContent: 'center', color: activeTab === opt.id ? 'var(--cni-teal-primary)' : 'var(--text-muted)' }}>
                      {opt.icon}
                    </span>
                    <span>{opt.label}</span>
                  </div>
                  {activeTab === opt.id && (
                    <span style={{ color: 'var(--cni-teal-primary)' }}>
                      {icons.check}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="appr-filters">
          <input 
            type="text" 
            placeholder="Search posts..." 
            className="field-input"
            style={{ width: '250px' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          <div className="appr-platform-dropdown-container" ref={platformDropdownRef} style={{ position: 'relative' }}>
            <button 
              className="appr-platform-dropdown-btn"
              onClick={() => {
                setPlatformDropdownOpen(!platformDropdownOpen);
                setStatusDropdownOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                minWidth: '200px',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cni-teal-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-card)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {platformFilter !== 'all' && (
                  <span style={{ display: 'flex', width: platformFilter === 'youtube' ? '20px' : '16px', justifyContent: 'center' }}>
                    {platformFilter === 'facebook' && icons.facebook}
                    {platformFilter === 'instagram' && icons.instagram}
                    {platformFilter === 'tiktok' && icons.tiktok}
                    {platformFilter === 'pinterest' && icons.pinterest}
                    {platformFilter === 'youtube' && icons.youtube}
                    {platformFilter === 'linkedin' && icons.linkedin}
                    {platformFilter === 'twitter' && icons.twitter}
                    {platformFilter === 'threads' && icons.threads}
                  </span>
                )}
                <span>
                  {platformFilter === 'all' ? 'All Platforms' : 
                   platformFilter === 'facebook' ? 'Facebook' :
                   platformFilter === 'instagram' ? 'Instagram' :
                   platformFilter === 'tiktok' ? 'TikTok' :
                   platformFilter === 'pinterest' ? 'Pinterest' :
                   platformFilter === 'youtube' ? 'YouTube' :
                   platformFilter === 'linkedin' ? 'LinkedIn' :
                   platformFilter === 'twitter' ? 'X / Twitter' : 'Threads'}
                </span>
              </div>
              <svg 
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
                strokeLinecap="round" strokeLinejoin="round" 
                style={{ transform: platformDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-muted)' }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {platformDropdownOpen && (
              <div 
                className="appr-platform-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  zIndex: 50,
                  minWidth: '200px',
                  overflow: 'hidden',
                  padding: '8px'
                }}
              >
                {[
                  { id: 'all', label: 'All Platforms', icon: null },
                  { id: 'facebook', label: 'Facebook', icon: icons.facebook },
                  { id: 'instagram', label: 'Instagram', icon: icons.instagram },
                  { id: 'tiktok', label: 'TikTok', icon: icons.tiktok },
                  { id: 'pinterest', label: 'Pinterest', icon: icons.pinterest },
                  { id: 'youtube', label: 'YouTube', icon: icons.youtube },
                  { id: 'linkedin', label: 'LinkedIn', icon: icons.linkedin },
                  { id: 'twitter', label: 'X / Twitter', icon: icons.twitter },
                  { id: 'threads', label: 'Threads', icon: icons.threads },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setPlatformFilter(opt.id);
                      setPlatformDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      marginBottom: '2px',
                      borderRadius: 'var(--radius-sm)',
                      background: platformFilter === opt.id ? 'var(--bg-hover)' : 'transparent',
                      border: 'none',
                      color: platformFilter === opt.id ? 'var(--cni-teal-primary)' : 'var(--text-main)',
                      fontSize: '14px',
                      fontWeight: platformFilter === opt.id ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (platformFilter !== opt.id) {
                        e.currentTarget.style.background = 'var(--bg-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (platformFilter !== opt.id) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {opt.icon && (
                        <span style={{ display: 'flex', width: opt.id === 'youtube' ? '20px' : '16px', justifyContent: 'center' }}>
                          {opt.icon}
                        </span>
                      )}
                      <span style={{ marginLeft: opt.icon ? 0 : '26px' }}>{opt.label}</span>
                    </div>
                    {platformFilter === opt.id && (
                      <span style={{ color: 'var(--cni-teal-primary)' }}>
                        {icons.check}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────────────── */}
      {filteredVariants.length === 0 ? (
        <div className="ws-empty" style={{ marginTop: '32px' }}>
          <div className="ws-empty-icon appr-empty-glyph">{icons.approvals}</div>
          <div>
            <p className="ws-empty-title">No posts found</p>
            <p className="ws-empty-body">
              Try adjusting your filters or tabs.
            </p>
          </div>
        </div>
      ) : (
        <div className="appr-grid">
          {filteredVariants.map((variant) => {
            const post = variant.parent_post;
            const status = post.status;
            
            return (
              <div 
                key={`${post.id}-${variant.id}`} 
                className="appr-post-card"
                style={{
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '1px solid var(--border-card)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                }}
              >
                <div className="appr-post-media">
                  {variant.media_urls && variant.media_urls.length > 0 ? (
                    isVideo(variant.media_urls[0]) ? (
                      <video src={variant.media_urls[0]} muted />
                    ) : (
                      <img src={variant.media_urls[0]} alt="Post preview" />
                    )
                  ) : (
                    <div className="appr-post-no-media">No Media</div>
                  )}
                  {variant.media_urls && variant.media_urls.length > 1 && (
                    <div className="appr-media-count">+{variant.media_urls.length - 1}</div>
                  )}
                  
                  <div className={`appr-status-badge status-${status}`}>
                    {status === 'pending_approval' ? 'Pending' : status === 'scheduled' ? 'Approved' : 'Rejected'}
                  </div>
                </div>
                
                <div className="appr-post-info">
                  <div className="appr-post-head">
                    <div className="appr-platform-info">
                      <span className="appr-platform-icon-small">
                        {variant.platform === 'facebook' ? icons.facebook : variant.platform === 'linkedin' ? icons.linkedin : icons.instagram}
                      </span>
                      <span className="appr-account-name-small">
                        {variant.connected_accounts?.account_name || variant.platform}
                      </span>
                    </div>
                    <button className="appr-menu-btn" onClick={() => openEditModal(variant)}>Edit</button>
                  </div>
                  
                  <div className="appr-sched-time">
                    {icons.calendar} 
                    {post.scheduled_at ? new Date(post.scheduled_at).toLocaleString('en-US', {
                          timeZone: timezone,
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }) : 'Not scheduled'}
                  </div>
                  
                  <div className="appr-caption-preview">
                    {variant.caption || <span style={{ color: 'var(--text-muted)' }}>No caption</span>}
                  </div>
                  
                  <div className="appr-card-actions">
                    {status === 'pending_approval' && (
                      <>
                        <button className="appr-btn-outline" onClick={() => handleReject(post.id)}>Reject</button>
                        <button className="appr-btn-primary" onClick={() => handleApprove(post.id)}>Approve</button>
                      </>
                    )}
                    {status === 'scheduled' && (
                      <button className="appr-btn-outline" style={{ width: '100%' }}>View</button>
                    )}
                    {status === 'cancelled' && (
                      <button className="appr-btn-outline" style={{ width: '100%' }}>View Reason</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Edit Modal ────────────────────────────────────────────────────── */}
      {editingPost && (
        <div className="appr-modal-overlay" onClick={() => setEditingPost(null)}>
          <div className="appr-modal-content" onClick={e => e.stopPropagation()}>
            <div className="appr-modal-header">
              <h3>Edit Post ({editingPost.platform})</h3>
              <button onClick={() => setEditingPost(null)}>×</button>
            </div>
            <div className="appr-modal-body">
              <label className="field-label">Caption</label>
              <textarea 
                className="field-input" 
                rows={4} 
                value={editCaption}
                onChange={e => setEditCaption(e.target.value)}
              />
              
              <label className="field-label" style={{ marginTop: '16px' }}>Scheduled Date</label>
              <input 
                type="datetime-local" 
                className="field-input" 
                value={editScheduledAt}
                onChange={e => setEditScheduledAt(e.target.value)}
              />
            </div>
            <div className="appr-modal-footer">
              <button className="appr-btn-outline" onClick={() => setEditingPost(null)}>Cancel</button>
              <button className="appr-btn-primary" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
