import React, { useEffect } from "react";
import { Outlet, NavLink, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchProjectById, clearCurrentProject } from "../../store/projectsSlice";
import "./ProjectWorkspace.scss";

const NAV_ITEMS = [
  { path: "", label: "Overview", icon: "grid" },
  { path: "notes", label: "Notes", icon: "file" },
  { path: "tasks", label: "Tasks", icon: "check" },
  { path: "context", label: "Context", icon: "layers" },
  { path: "activity", label: "Activity", icon: "clock" },
];

const NavIcon: React.FC<{ name: string }> = ({ name }) => {
  switch (name) {
    case "grid":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "file":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "check":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "layers":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "clock":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return null;
  }
};

const ProjectWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentProject, isLoading, error } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [id, dispatch]);

  if (isLoading && !currentProject) {
    return (
      <div className="workspace workspace--loading">
        <div className="workspace__spinner" />
        <span>Loading workspace...</span>
      </div>
    );
  }

  if (error || !currentProject) {
    return (
      <div className="workspace workspace--error">
        <h2>Project not found</h2>
        <p>{error || "This project doesn't exist or you don't have access."}</p>
        <button className="workspace__back-btn" onClick={() => navigate("/projects")}>
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="workspace">
      {/* Sidebar */}
      <aside className="workspace__sidebar">
        <div className="workspace__sidebar-header">
          <button className="workspace__back-link" onClick={() => navigate("/projects")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Projects
          </button>
        </div>

        <div className="workspace__project-info">
          <div className="workspace__project-icon">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--accent)" />
              <path d="M9 16.5L14 21.5L23 11.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="workspace__project-meta">
            <span className="workspace__project-name">{currentProject.name}</span>
            {currentProject.github_repo_url && (
              <span className="workspace__project-repo">
                {currentProject.github_repo_url.replace(/^https?:\/\/github\.com\//, '')}
              </span>
            )}
          </div>
        </div>

        <nav className="workspace__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ""}
              className={({ isActive }) =>
                `workspace__nav-item ${isActive ? "workspace__nav-item--active" : ""}`
              }
            >
              <NavIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="workspace__sidebar-footer">
          <NavLink to="settings" className="workspace__nav-item workspace__nav-item--settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="workspace__main">
        <Outlet />
      </main>
    </div>
  );
};

export default ProjectWorkspace;
