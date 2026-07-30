import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../shared/hooks/useTheme";
import "./Home.scss";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing">
      {/* Navbar */}
      <header className="landing__nav">
        <div className="landing__nav-inner">
          <div className="landing__brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--accent)" />
              <path d="M9 16.5L14 21.5L23 11.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="landing__brand-name">Workspace Flow</span>
          </div>
          <nav className="landing__nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
          </nav>
          <div className="landing__nav-actions">
            <button
              className="landing__theme-toggle"
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
            <button className="landing__btn-ghost" onClick={() => navigate("/login")}>
              Log in
            </button>
            <button className="landing__btn-primary" onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="landing__hero">
        <div className="landing__hero-content">
          <div className="landing__badge">
            <span className="landing__badge-dot" />
            AI-Powered Developer Workspace
          </div>
          <h1 className="landing__hero-title">
            Transform your repos into<br />
            <span className="landing__hero-highlight">actionable context</span>
          </h1>
          <p className="landing__hero-subtitle">
            Workspace Flow turns repository metadata, commits, and unstructured notes
            into structured project context — so your team always knows what's happening.
          </p>
          <div className="landing__hero-actions">
            <button className="landing__btn-primary landing__btn-primary--lg" onClick={() => navigate("/register")}>
              Start for free
            </button>
            <button className="landing__btn-outline landing__btn-outline--lg" onClick={() => navigate("/login")}>
              View demo
            </button>
          </div>
        </div>

        {/* Hero Mockup */}
        <div className="landing__hero-visual">
          <div className="landing__mockup">
            <div className="landing__mockup-bar">
              <div className="landing__mockup-dots">
                <span /><span /><span />
              </div>
              <span className="landing__mockup-url">workspace-flow.dev/dashboard</span>
            </div>
            <div className="landing__mockup-body">
              <div className="landing__mockup-sidebar">
                {["Dashboard", "Notes", "Tasks", "Context", "Activity"].map((item, i) => (
                  <div key={item} className={`landing__mockup-nav-item ${i === 0 ? 'landing__mockup-nav-item--active' : ''}`}>
                    <span className="landing__mockup-nav-dot" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="landing__mockup-main">
                <div className="landing__mockup-cards">
                  <div className="landing__mockup-card">
                    <span className="landing__mockup-card-title">Tasks Pending</span>
                    <span className="landing__mockup-card-value">12</span>
                  </div>
                  <div className="landing__mockup-card">
                    <span className="landing__mockup-card-title">Active Branch</span>
                    <span className="landing__mockup-card-value landing__mockup-card-value--mono">feat/auth-v2</span>
                  </div>
                  <div className="landing__mockup-card">
                    <span className="landing__mockup-card-title">Last Commit</span>
                    <span className="landing__mockup-card-value landing__mockup-card-value--mono">3a72d9</span>
                  </div>
                </div>
                <div className="landing__mockup-activity">
                  <div className="landing__mockup-activity-item">
                    <span className="landing__mockup-activity-dot landing__mockup-activity-dot--accent" />
                    <span>Commit to main • Fix JWT handling</span>
                  </div>
                  <div className="landing__mockup-activity-item">
                    <span className="landing__mockup-activity-dot landing__mockup-activity-dot--info" />
                    <span>PR merged • #128 Feature/mfa-auth</span>
                  </div>
                  <div className="landing__mockup-activity-item">
                    <span className="landing__mockup-activity-dot landing__mockup-activity-dot--warning" />
                    <span>Task completed • Document API arch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing__features" id="features">
        <div className="landing__section-header">
          <h2>Built for developer teams</h2>
          <p>Everything you need to keep your projects organized and your team aligned.</p>
        </div>
        <div className="landing__features-grid">
          <div className="landing__feature-card">
            <div className="landing__feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Project Context</h3>
            <p>Automatically detect your stack, modules, and architecture from repository metadata.</p>
          </div>
          <div className="landing__feature-card">
            <div className="landing__feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round"/>
                <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Smart Notes</h3>
            <p>Quick notes that link to tasks, commits, and pull requests. Never lose context again.</p>
          </div>
          <div className="landing__feature-card">
            <div className="landing__feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Task Tracking</h3>
            <p>Prioritize, assign, and track tasks with deadlines and status badges. Keep your team in sync.</p>
          </div>
          <div className="landing__feature-card">
            <div className="landing__feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>AI Suggestions</h3>
            <p>Get intelligent recommendations: architecture decisions, risk alerts, and dependency updates.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing__how" id="how-it-works">
        <div className="landing__section-header">
          <h2>Get started in minutes</h2>
          <p>Connect your repo, invite your team, and let AI do the rest.</p>
        </div>
        <div className="landing__steps">
          <div className="landing__step">
            <div className="landing__step-number">1</div>
            <h3>Connect your repository</h3>
            <p>Link your GitHub or GitLab repos. We read metadata — never your source code.</p>
          </div>
          <div className="landing__step">
            <div className="landing__step-number">2</div>
            <h3>AI builds your context</h3>
            <p>Stack detection, module mapping, and architectural patterns are extracted automatically.</p>
          </div>
          <div className="landing__step">
            <div className="landing__step-number">3</div>
            <h3>Collaborate with clarity</h3>
            <p>Your team sees tasks, notes, and activity in one unified workspace — no context switching.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing__cta">
        <div className="landing__cta-content">
          <h2>Ready to work smarter?</h2>
          <p>Join developers who use Workspace Flow to ship faster with less friction.</p>
          <button className="landing__btn-primary landing__btn-primary--lg" onClick={() => navigate("/register")}>
            Get started for free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="landing__footer-inner">
          <div className="landing__footer-brand">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--accent)" />
              <path d="M9 16.5L14 21.5L23 11.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Workspace Flow</span>
          </div>
          <p className="landing__footer-copy">© 2026 Workspace Flow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
