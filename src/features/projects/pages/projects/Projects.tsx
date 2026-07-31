import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import ProjectCard from "../../components/project-card/ProjectCard";
import CreateProjectModal from "../../components/create-project-modal/CreateProjectModal";
import "./Projects.scss";

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { projects, isLoading, error, handleCreate, handleDelete, handleClearError } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);

  // Recent projects: last 3 updated
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);

  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="projects-home">
      {/* Page Header */}
      <div className="projects-home__header">
        <div>
          <h1 className="projects-home__title">Projects</h1>
          <p className="projects-home__subtitle">Your workspaces at a glance</p>
        </div>
        <button className="projects-home__new-btn" onClick={() => setModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          New Project
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="projects-home__alert">
          <span>{error}</span>
          <button className="projects-home__alert-close" onClick={handleClearError}>×</button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="projects-home__loading">
          <div className="projects-home__spinner" />
          <span>Loading projects...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && projects.length === 0 && (
        <div className="projects-home__empty">
          <div className="projects-home__empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="projects-home__empty-title">No projects yet</h3>
          <p className="projects-home__empty-text">
            Create your first project to start organizing your workspace.
          </p>
          <button className="projects-home__empty-btn" onClick={() => setModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Create your first project
          </button>
        </div>
      )}

      {/* Continue Working */}
      {!isLoading && recentProjects.length > 0 && (
        <section className="projects-home__section">
          <h2 className="projects-home__section-title">Continue working</h2>
          <div className="projects-home__recent">
            {recentProjects.map((project) => (
              <button
                key={project.id}
                className="projects-home__recent-card"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="projects-home__recent-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="projects-home__recent-info">
                  <span className="projects-home__recent-name">{project.name}</span>
                  <span className="projects-home__recent-time">Updated {timeAgo(project.updated_at)}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* All Projects Grid */}
      {!isLoading && projects.length > 0 && (
        <section className="projects-home__section">
          <h2 className="projects-home__section-title">All projects</h2>
          <div className="projects-home__grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
            ))}
          </div>
        </section>
      )}

      {/* Create Modal */}
      <CreateProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default Projects;
