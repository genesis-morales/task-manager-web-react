import React from "react";
import { useTheme } from "../../hooks/useTheme";
import "./AuthLayout.scss";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="auth-layout">
      {/* Left Panel - Form */}
      <div className="auth-layout__panel">
        <div className="auth-layout__top-bar">
          <div className="auth-layout__brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--accent)" />
              <path
                d="M9 16.5L14 21.5L23 11.5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="auth-layout__brand-name">Workspace Flow</span>
          </div>

          <button
            className="auth-layout__theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3" strokeLinecap="round"/>
                <line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeLinecap="round"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round"/>
                <line x1="1" y1="12" x2="3" y2="12" strokeLinecap="round"/>
                <line x1="21" y1="12" x2="23" y2="12" strokeLinecap="round"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeLinecap="round"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        <div className="auth-layout__content">
          {children}
        </div>

        <div className="auth-layout__footer">
          <p className="auth-layout__footer-text">
            © 2026 Workspace Flow. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="auth-layout__decoration">
        <div className="auth-layout__decoration-content">
          <div className="auth-layout__decoration-mockup">
            <div className="auth-layout__mockup-header">
              <div className="auth-layout__mockup-dots">
                <span /><span /><span />
              </div>
            </div>
            <div className="auth-layout__mockup-body">
              <div className="auth-layout__mockup-row">
                <div className="auth-layout__mockup-stat">
                  <span className="auth-layout__mockup-stat-label">Tasks</span>
                  <span className="auth-layout__mockup-stat-value">12 pending</span>
                </div>
                <div className="auth-layout__mockup-stat">
                  <span className="auth-layout__mockup-stat-label">Branch</span>
                  <span className="auth-layout__mockup-stat-value auth-layout__mockup-stat-value--accent">feat/auth-v2</span>
                </div>
                <div className="auth-layout__mockup-stat">
                  <span className="auth-layout__mockup-stat-label">Status</span>
                  <span className="auth-layout__mockup-stat-value">Active</span>
                </div>
              </div>
              <div className="auth-layout__mockup-activity">
                <span className="auth-layout__mockup-activity-title">Recent Activity</span>
                <div className="auth-layout__mockup-activity-item">
                  <span className="auth-layout__mockup-dot auth-layout__mockup-dot--accent" />
                  Commit to main • Fix JWT expiration
                </div>
                <div className="auth-layout__mockup-activity-item">
                  <span className="auth-layout__mockup-dot auth-layout__mockup-dot--info" />
                  PR merged • #128 Feature/mfa-auth
                </div>
                <div className="auth-layout__mockup-activity-item">
                  <span className="auth-layout__mockup-dot auth-layout__mockup-dot--warning" />
                  Task completed • Document API endpoints
                </div>
              </div>
            </div>
          </div>
          <div className="auth-layout__decoration-text">
            <h3>Your workspace, organized</h3>
            <p>AI-powered context that keeps your team aligned on what matters.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
