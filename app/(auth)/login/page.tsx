"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { icons } from '@/lib/icons';

type Mode = 'login' | 'signup';

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    // Pure navigation — no auth logic per task spec
    setTimeout(() => {
      router.push('/workspaces');
    }, 600);
  };

  const isSignup = mode === 'signup';

  return (
    <>
      {/* ── Scoped styles ─────────────────────────────────────────── */}
      <style>{`
        .lp-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #00453f 0%, #005952 45%, #007369 100%);
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* Ambient blobs */
        .lp-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.35;
        }
        .lp-blob-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #D4AF37 0%, transparent 70%);
          top: -180px; right: -120px;
        }
        .lp-blob-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, #00A99D 0%, transparent 70%);
          bottom: -120px; left: -100px;
        }

        /* Card */
        .lp-card-wrap {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 10;
          animation: lp-fadein 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes lp-fadein {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Brand row */
        .lp-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: center;
          margin-bottom: 28px;
        }
        .lp-logo-box {
          width: 40px; height: 40px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px);
          flex-shrink: 0;
        }
        .lp-brand-name {
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.01em;
          opacity: 0.92;
        }

        /* White card */
        .lp-card {
          background: #fff;
          border-radius: 20px;
          padding: 40px 40px 36px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.04);
        }

        /* Tab toggle */
        .lp-tabs {
          display: flex;
          background: #f1f5f9;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 28px;
          gap: 4px;
        }
        .lp-tab {
          flex: 1;
          padding: 8px 0;
          border: none;
          border-radius: 7px;
          background: transparent;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .lp-tab.active {
          background: #fff;
          color: #00453f;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
          font-weight: 600;
        }
        .lp-tab:hover:not(.active) {
          color: #334155;
        }

        /* Title */
        .lp-title {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .lp-subtitle {
          font-size: 13.5px;
          color: #64748b;
          margin-bottom: 28px;
        }

        /* Fields */
        .lp-field-wrap {
          position: relative;
          margin-bottom: 14px;
        }
        .lp-label {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
          letter-spacing: 0.01em;
        }
        .lp-input {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #0f172a;
          background: #fafafa;
          transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
          outline: none;
          font-family: inherit;
        }
        .lp-input:focus {
          border-color: #005952;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0, 89, 82, 0.12);
        }
        .lp-input.has-toggle {
          padding-right: 46px;
        }
        .lp-pw-toggle {
          position: absolute;
          right: 12px;
          bottom: 11px;
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .lp-pw-toggle:hover { color: #475569; }

        /* Error */
        .lp-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #dc2626;
          margin-bottom: 16px;
          animation: lp-fadein 0.2s ease both;
        }

        /* Submit button */
        .lp-btn {
          width: 100%;
          height: 46px;
          background: linear-gradient(135deg, #005952 0%, #007369 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
          transition: opacity 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease;
          font-family: inherit;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 14px rgba(0, 89, 82, 0.35);
        }
        .lp-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 89, 82, 0.45);
        }
        .lp-btn:active:not(:disabled) { transform: translateY(0); }
        .lp-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        /* Spinner */
        .lp-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: lp-spin 0.7s linear infinite;
        }
        @keyframes lp-spin { to { transform: rotate(360deg); } }

        /* Divider / footer */
        .lp-footer {
          margin-top: 20px;
          text-align: center;
          font-size: 13px;
          color: #64748b;
        }
        .lp-footer-link {
          color: #005952;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.15s;
          padding: 0;
        }
        .lp-footer-link:hover { color: #007369; }

        /* Field reveal animation */
        .lp-field-reveal {
          animation: lp-fadein 0.25s ease both;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .lp-card { padding: 28px 20px 24px; }
        }
      `}</style>

      <div className="lp-root">
        {/* Ambient blobs */}
        <div className="lp-blob lp-blob-1" />
        <div className="lp-blob lp-blob-2" />

        <div className="lp-card-wrap">
          {/* Brand */}
          <div className="lp-brand">
            <div className="lp-logo-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="#D4AF37" fillOpacity="0.2" />
                <path d="M7 17V7L12 12L17 7V17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="lp-brand-name">Crescent Nova International</span>
          </div>

          {/* Card */}
          <div className="lp-card">
            {/* Tab toggle */}
            <div className="lp-tabs" role="tablist" aria-label="Authentication mode">
              <button
                id="tab-login"
                role="tab"
                aria-selected={!isSignup}
                className={`lp-tab${!isSignup ? ' active' : ''}`}
                onClick={() => switchMode('login')}
                type="button"
              >
                Log in
              </button>
              <button
                id="tab-signup"
                role="tab"
                aria-selected={isSignup}
                className={`lp-tab${isSignup ? ' active' : ''}`}
                onClick={() => switchMode('signup')}
                type="button"
              >
                Sign up
              </button>
            </div>

            {/* Heading */}
            <h1 className="lp-title">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="lp-subtitle">
              {isSignup
                ? 'Join your team on CNI Publisher'
                : 'Sign in to your CNI Publisher workspace'}
            </p>

            <form id="auth-form" onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="lp-field-wrap">
                <label htmlFor="auth-email" className="lp-label">Work email</label>
                <input
                  id="auth-email"
                  type="email"
                  className="lp-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {/* Password */}
              <div className="lp-field-wrap">
                <label htmlFor="auth-password" className="lp-label">Password</label>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  className="lp-input has-toggle"
                  placeholder={isSignup ? 'Create a password' : 'Your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="lp-pw-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {icons.eye}
                </button>
              </div>

              {/* Confirm password — signup only */}
              {isSignup && (
                <div className="lp-field-wrap lp-field-reveal">
                  <label htmlFor="auth-confirm" className="lp-label">Confirm password</label>
                  <input
                    id="auth-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className="lp-input has-toggle"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="lp-pw-toggle"
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    onClick={() => setShowConfirm((v) => !v)}
                    tabIndex={-1}
                  >
                    {icons.eye}
                  </button>
                </div>
              )}

              {/* Inline error */}
              {error && (
                <div className="lp-error" role="alert" id="auth-error-msg">
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" style={{ flexShrink: 0 }}>
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                id="btn-auth-submit"
                className="lp-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="lp-spinner" />
                    {isSignup ? 'Creating account…' : 'Signing in…'}
                  </>
                ) : (
                  isSignup ? 'Create account' : 'Sign in'
                )}
              </button>
            </form>

            {/* Footer toggle */}
            <div className="lp-footer">
              {isSignup ? (
                <>
                  Already have an account?{' '}
                  <button
                    id="btn-switch-to-login"
                    className="lp-footer-link"
                    onClick={() => switchMode('login')}
                    type="button"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    id="btn-switch-to-signup"
                    className="lp-footer-link"
                    onClick={() => switchMode('signup')}
                    type="button"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
