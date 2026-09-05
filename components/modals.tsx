"use client";

import React, { useState } from 'react';
import { icons } from '@/lib/icons';
import { useAppStore } from '@/lib/store';
import { toast } from '@/components/toast';
import { NewWorkspaceModal } from '@/components/new-workspace-modal/NewWorkspaceModal';

export function Modals() {
  const { state, closeModals, updateState, addLead, approvePost } = useAppStore();
  const { modals } = state;

  const handleCreateLead = () => {
    addLead({
      name: '',
      phone: '',
      source: 'Website',
      status: 'New'
    });
    closeModals();
    toast.show('Lead added successfully!');
  };

  const handleApproveFromModal = () => {
    if (modals.previewPostData?.id) {
      approvePost(modals.previewPostData.id);
      toast.show('Post approved and scheduled.');
    }
    closeModals();
  };



  return (
    <div id="modals-root">
      {/* Full Preview Modal */}
      <div id="full-preview-modal" className={`modal-backdrop ${modals.isFullPreviewOpen ? 'open' : 'hidden'}`}>
        <div className="modal-dialog modal-lg animate-scale-in">
          <div className="modal-header">
            <h3 className="modal-title">Multi-Platform Post Preview</h3>
            <button className="modal-close-btn" onClick={closeModals}>{icons.close}</button>
          </div>
          <div className="modal-body">
            <div className="preview-device-tabs">
              <button className="device-tab active">💻 Desktop Feed</button>
              <button className="device-tab">📱 Mobile App</button>
              <button className="device-tab">🌐 Public Share</button>
            </div>
            <div className="modal-preview-card">
              <div className="preview-author-row" style={{ display: 'flex', gap: '10px' }}>
                <div className="brand-avatar-emerald" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--cni-teal-primary)', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                  <span>C</span>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Crescent Nova International</h4>
                  <p className="text-xs text-muted" style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Sponsored • Just now</p>
                </div>
              </div>
              <p className="mt-3 text-sm" id="modal-preview-text" style={{ marginTop: '12px', fontSize: '14px' }}>
                Exciting news for our Q3 launch! We&apos;ve completely revamped the user dashboard to make your workflow faster and more intuitive.
              </p>
              <div className="modal-media-wrap mt-3" style={{ marginTop: '12px' }}>
                <img 
                  id="modal-preview-img" 
                  src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80" 
                  alt="Post Asset" 
                  className="rounded-lg w-full"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary-outline" onClick={closeModals}>Close</button>
            <button className="btn-primary-teal" onClick={handleApproveFromModal}>Approve Now</button>
          </div>
        </div>
      </div>

      {/* Request Changes Modal */}
      <div id="request-changes-modal" className={`modal-backdrop ${modals.isRequestChangesOpen ? 'open' : 'hidden'}`}>
        <div className="modal-dialog animate-scale-in">
          <div className="modal-header">
            <h3 className="modal-title">Request Revisions</h3>
            <button className="modal-close-btn" onClick={closeModals}>{icons.close}</button>
          </div>
          <div className="modal-body">
            <label className="block text-sm font-medium mb-1" style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Feedback for Author</label>
            <textarea 
              id="request-changes-text" 
              className="w-full form-input h-28" 
              placeholder="E.g. Please update the hashtags and change the launch date to Friday..."
              style={{ width: '100%', height: '112px', padding: '12px', border: '1px solid var(--border-light)', borderRadius: '6px', resize: 'vertical' }}
              defaultValue="Please ensure the promo link points to our new v2 landing page before final publishing."
            ></textarea>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary-outline" onClick={closeModals}>Cancel</button>
            <button className="btn-danger-solid" onClick={() => { closeModals(); toast.show('Feedback sent and post rejected.'); }}>Send Feedback & Reject</button>
          </div>
        </div>
      </div>

      {/* OAuth Reconnect Modal */}
      <div id="oauth-modal" className={`modal-backdrop ${modals.isOAuthModalOpen ? 'open' : 'hidden'}`}>
        <div className="modal-dialog animate-scale-in">
          <div className="modal-header">
            <h3 className="modal-title" id="oauth-modal-title">Authorize Platform</h3>
            <button className="modal-close-btn" onClick={closeModals}>{icons.close}</button>
          </div>
          <div className="modal-body text-center py-6" style={{ textAlign: 'center', padding: '24px 0' }}>
            <h4 className="font-bold text-lg mb-2" id="oauth-platform-name" style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>Not yet connected — coming soon</h4>
            <p className="text-sm text-muted mb-4" style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>OAuth integration is under development. Real connections will be available soon.</p>
          </div>
          <div className="modal-footer justify-center" style={{ justifyContent: 'center' }}>
            <button className="btn-secondary-outline" onClick={closeModals}>Close</button>
          </div>
        </div>
      </div>

      {/* Add New Workspace Modal */}
      <NewWorkspaceModal 
        isOpen={modals.isNewWorkspaceModalOpen} 
        onClose={closeModals} 
        onSuccess={() => { 
          closeModals(); 
          toast.show('Workspace created successfully!'); 
        }} 
      />

      {/* Add New Lead Modal */}
      <div id="new-lead-modal" className={`modal-backdrop ${modals.isNewLeadModalOpen ? 'open' : 'hidden'}`}>
        <div className="modal-dialog animate-scale-in">
          <div className="modal-header">
            <h3 className="modal-title">Add New Lead</h3>
            <button className="modal-close-btn" onClick={closeModals}>{icons.close}</button>
          </div>
          <div className="modal-body">
            <div className="form-group mb-3" style={{ marginBottom: '12px' }}>
              <label className="field-label">Full Name</label>
              <input type="text" id="lead-name-input" className="field-input" placeholder="Johnathan Doe" defaultValue="" />
            </div>
            <div className="form-group mb-3" style={{ marginBottom: '12px' }}>
              <label className="field-label">Phone Number</label>
              <input type="text" id="lead-phone-input" className="field-input" placeholder="+1 (555) 000-0000" defaultValue="" />
            </div>
            <div className="form-group mb-3" style={{ marginBottom: '12px' }}>
              <label className="field-label">Lead Source</label>
              <select id="lead-source-select" className="field-input">
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Referral">Referral</option>
                <option value="Cold Email">Cold Email</option>
              </select>
            </div>
            <div className="form-group mb-3" style={{ marginBottom: '12px' }}>
              <label className="field-label">Status</label>
              <select id="lead-status-select" className="field-input">
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary-outline" onClick={closeModals}>Cancel</button>
            <button className="btn-primary-teal" onClick={handleCreateLead}>Save Lead</button>
          </div>
        </div>
      </div>
    </div>
  );
}
