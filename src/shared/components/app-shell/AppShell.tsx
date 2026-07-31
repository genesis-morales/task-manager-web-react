import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import "./AppShell.scss";

const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      {/* Global Sidebar */}
      <aside className="app-shell__sidebar">
        <div className="app-shell__sidebar-top">
          {/* Brand */}
          <div className="app-shell__brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--accent)" />
              <path d="M9 16.5L14 21.5L23 11.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Navigation */}
          <nav className="app-shell__nav">
            <NavLink to="/projects" className={({ isActive }) => `app-shell__nav-item ${isActive ? 'app-shell__nav-item--active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9,22 9,12 15,12 15,22" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Home</span>
            </NavLink>

            <NavLink to="/projects" end className={({ isActive }) => `app-shell__nav-item ${isActive ? 'app-shell__nav-item--active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Projects</span>
            </NavLink>

            <button className="app-shell__nav-item" disabled>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Recent</span>
            </button>

            <button className="app-shell__nav-item" disabled>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Starred</span>
            </button>
          </nav>
        </div>

        <div className="app-shell__sidebar-bottom">
          {/* Theme toggle */}
          <button className="app-shell__nav-item" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3" strokeLinecap="round"/><line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeLinecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round"/>
                <line x1="1" y1="12" x2="3" y2="12" strokeLinecap="round"/><line x1="21" y1="12" x2="23" y2="12" strokeLinecap="round"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeLinecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeLinecap="round"/>
              </svg>
            )}
            <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>

          {/* Settings */}
          <button className="app-shell__nav-item" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Settings</span>
          </button>

          {/* User / Logout */}
          <div className="app-shell__user">
            <div className="app-shell__user-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="app-shell__user-info">
              <span className="app-shell__user-name">{user?.username || 'User'}</span>
              <button className="app-shell__logout" onClick={handleLogout}>Log out</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="app-shell__main">
        {/* Header */}
        <header className="app-shell__header">
          <div className="app-shell__search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="app-shell__search-icon">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              className="app-shell__search-input"
              placeholder="Search projects, notes, tasks..."
            />
          </div>
          <div className="app-shell__header-actions">
            <button className="app-shell__notification-btn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
