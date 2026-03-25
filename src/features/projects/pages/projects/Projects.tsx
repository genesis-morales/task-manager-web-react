import React, { useState } from "react";
import { Empty, Typography } from "antd";
import ProjectsHeader from "../../components/projects-header/ProjectsHeader";
import ProjectListItem from "../../components/project-list-item/ProjectListItem";
import ProjectGrid from "../../components/project-grid/ProjectGrid";
import ProjectFormModal from "../../components/project-form-modal/ProjectFormModal";
import { useProjects } from "../../hooks/useProjects";
import { useProjectModal } from "../../hooks/useProjectModal";
import type { ViewMode } from "../../types/project.types";
import { Row, Col, Skeleton } from "antd";
import "./Projects.scss";

const { Text } = Typography;

const Projects: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const {
    sortedProjects,
    loading,
    handleView,
    handleDelete,
    handleSort,
    updateProject,} = useProjects();

  const {
    modalOpen,
    modalLoading,
    editingProject,
    handleNewProject,
    handleEdit,        
    handleModalSubmit,
    handleModalClose,} = useProjectModal(updateProject, sortedProjects); 

  if (loading) {
    return (
      <div className="projects">
        <ProjectsHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewProject={handleNewProject}
          onSort={handleSort}
          onFilter={() => {}}
        />
        <Row gutter={[24, 24]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} lg={8}>
              <Skeleton active className="projects__skeleton" />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (sortedProjects.length === 0) {
    return (
      <div className="projects">
        <ProjectsHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewProject={handleNewProject}
          onSort={handleSort}
          onFilter={() => {}}
        />
        <Empty
          className="projects__empty"
          description="No projects yet. Create your first project!"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="projects">
      <ProjectsHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewProject={handleNewProject}
        onSort={handleSort}
        onFilter={() => {}}
      />

      {viewMode === "grid" && (
        <ProjectGrid
          projects={sortedProjects}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {viewMode === "list" && (
        <div className="projects__list">
          {sortedProjects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <div className="projects__footer">
        <Text className="projects__count">
          Showing {sortedProjects.length} projects
        </Text>
        <button className="projects__archived-link">View Archived</button>
      </div>

      <ProjectFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
        initialValues={editingProject ?? undefined}
      />
    </div>
  );
};

export default Projects;