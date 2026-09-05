"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { icons } from '@/lib/icons';
import { useAppStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { updateState } = useAppStore();
  const [email, setEmail] = useState('sarah.jenkins@acmecorp.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      updateState({
        auth: {
          isLoggedIn: true,
          user: {
            name: 'Sarah Jenkins',
            email: email,
            role: 'Internal Admin',
            avatarInitials: 'SJ'
          }
        }
      });
      router.push('/workspaces');
    }, 800);
  };

  const quickLogin = (name: string, role: string, workspace: string) => {
    setIsLoading(true);
    setTimeout(() => {
      updateState({
        auth: {
          isLoggedIn: true,
          user: {
            name,
            email: name.toLowerCase().replace(' ', '.') + '@example.com',
            role,
            avatarInitials: name.split(' ').map(n => n[0]).join('').substring(0, 2)
          }
        },
        currentWorkspace: workspace
      });
      router.push('/workspaces');
    }, 500);
  };

  return (
    <div className="login-page-container">
      {/* Floating Ambient Background Blobs */}
      <div className="login-bg-glow glow-1"></div>
      <div className="login-bg-glow glow-2"></div>

      <div className="login-card-wrapper animate-fade-in-up">
        {/* Top Centered Logo */}
        <div className="login-brand-header">
          <div className="login-logo-box">
            <div className="login-logo-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="#005952"/>
                <path d="M7 17V7L12 12L17 7V17" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="login-brand-name">Crescent Nova International</span>
          </div>
        </div>

        {/* White Login Card */}
        <div className="login-card">
          <h1 className="login-title">Sign in to Crescent Nova International</h1>

          <form id="login-form" onSubmit={handleLoginSubmit}>
            {/* Email Input */}
            <div className="form-group">
              <input 
                type="email" 
                id="login-email" 
                className="login-input" 
                placeholder="Work email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-group password-group">
              <input 
                type={showPassword ? "text" : "password"} 
                id="login-password" 
                className="login-input" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle-btn" 
                onClick={() => setShowPassword(!showPassword)} 
                title="Show/Hide Password"
              >
                {icons.eye}
              </button>
            </div>

            {/* Submit Button */}
            <div className="form-group btn-group">
              <button type="submit" className="btn-primary-teal" id="btn-login-submit" disabled={isLoading}>
                <span className="btn-text">{isLoading ? 'Signing in...' : 'Sign in'}</span>
                {isLoading && <span className="btn-spinner"></span>}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="login-footer-links">
              <a href="#forgot" className="forgot-password-link" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>
          </form>

          {/* Quick Demo Personas */}
          <div className="demo-login-box">
            <div className="demo-divider"><span>OR QUICK DEMO LOGIN</span></div>
            <div className="demo-persona-chips">
              <button className="persona-chip active" onClick={() => quickLogin('Sarah Jenkins', 'Internal Admin', 'Acme Corp')}>
                <span className="chip-dot"></span> Admin (Sarah)
              </button>
              <button className="persona-chip" onClick={() => quickLogin('Alex Rivera', 'Marketing Lead', 'Design Co')}>
                <span className="chip-dot"></span> Marketing (Alex)
              </button>
              <button className="persona-chip" onClick={() => quickLogin('Mike Jones', 'Sales Rep', 'Nexus Industries')}>
                <span className="chip-dot"></span> Sales (Mike)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
