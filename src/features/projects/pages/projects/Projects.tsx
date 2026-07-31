import React, { useState } from "react";
import { useProjects } from "../../hooks/useProjects";
import ProjectCard from "../../components/project-card/ProjectCard";
import CreateProjectModal from "../../components/create-project-modal/CreateProjectModal";
import "./Projects.scss";

const Projects: React.FC = () => {
  const { projects, total, isLoading, error, handleCreate, handleDelete, handleClearError } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = searchQuery
    ? projects.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;

  return (
    <div className="projects-home">
      {/* Header */}
      <div className="projects-home__header">
        <div className="projects-home__title-row">
          <div>
            <h1 className="projects-home__title">Projects</h1>
            <p className="projects-home__subtitle">
              {total} {total === 1 ? "workspace" : "workspaces"}
            </p>
          </div>
          <button className="projects-home__new-btn" onClick={() => setModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New Project
          </button>
        </div>

        {/* Search */}
        <div className="projects-home__search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="projects-home__search-icon">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            className="projects-home__search-input"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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

      {/* No search results */}
      {!isLoading && projects.length > 0 && filteredProjects.length === 0 && (
        <div className="projects-home__empty">
          <p className="projects-home__empty-text">No projects matching "{searchQuery}"</p>
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && filteredProjects.length > 0 && (
        <div className="projects-home__grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
          ))}
        </div>
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
