import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Typography, Spin, Empty } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useProjects } from "../../hooks/useProjects";
import ProjectCard from "../../components/project-card/ProjectCard";
import CreateProjectModal from "../../components/create-project-modal/CreateProjectModal";
import "./Projects.scss";

const { Title, Text } = Typography;

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { projects, isLoading, error, handleCreate, handleDelete, handleClearError } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);

  const filteredProjects = searchQuery
    ? projects.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;

  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="projects-home">
      <div className="projects-home__header">
        <div>
          <Title level={2} className="projects-home__title">Projects</Title>
          <Text type="secondary">Your workspaces at a glance</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)} size="large">
          New Project
        </Button>
      </div>

      {/* Search */}
      {projects.length > 0 && (
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          className="projects-home__search"
        />
      )}

      {/* Loading */}
      {isLoading && (
        <div className="projects-home__loading">
          <Spin size="large" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && projects.length === 0 && (
        <Empty
          description="No projects yet. Create your first one!"
          className="projects-home__empty"
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Create your first project
          </Button>
        </Empty>
      )}

      {/* Continue Working */}
      {!isLoading && recentProjects.length > 0 && !searchQuery && (
        <section className="projects-home__section">
          <Title level={5} className="projects-home__section-title">Continue working</Title>
          <div className="projects-home__recent">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="projects-home__recent-card"
                onClick={() => navigate(`/projects/${project.id}`)}
                role="button"
                tabIndex={0}
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
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Projects */}
      {!isLoading && filteredProjects.length > 0 && (
        <section className="projects-home__section">
          <Title level={5} className="projects-home__section-title">All projects</Title>
          <div className="projects-home__grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
            ))}
          </div>
        </section>
      )}

      {/* No results */}
      {!isLoading && projects.length > 0 && filteredProjects.length === 0 && searchQuery && (
        <Empty description={`No projects matching "${searchQuery}"`} />
      )}

      <CreateProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default Projects;
