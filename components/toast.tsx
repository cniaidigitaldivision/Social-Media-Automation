"use client";

import React, { useEffect, useState } from 'react';
import { icons } from '@/lib/icons';

// Simple event-based toast system for React
type ToastType = 'success' | 'warning' | 'error' | 'info';

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

// Global event emitter for toasts
const toastListeners = new Set<(toast: ToastItem) => void>();

export const toast = {
  show: (message: string, type: ToastType = 'success') => {
    const newToast = { id: Date.now().toString() + Math.random(), message, type };
    toastListeners.forEach(listener => listener(newToast));
  }
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (newToast: ToastItem) => {
      setToasts(prev => [...prev, newToast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 3200);
    };
    
    toastListeners.add(listener);
    return () => {
      toastListeners.delete(listener);
    };
  }, []);

  const getIcon = (type: ToastType) => {
    switch(type) {
      case 'success': return <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
      case 'warning': return <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
      case 'error': return <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
      case 'info':
      default:
        return <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
    }
  };

  return (
    <div id="toast-container" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 150, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} className={`toast-item toast-${t.type} animate-slide-in`} style={{ pointerEvents: 'auto', background: '#ffffff', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-lg)', maxWidth: '380px' }}>
          <div className="toast-icon" style={{ width: '20px', height: '20px' }}>{getIcon(t.type)}</div>
          <div className="toast-message" style={{ fontSize: '13px', fontWeight: 500, flex: 1 }}>{t.message}</div>
          <button className="toast-close" onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      ))}
    </div>
  );
}
