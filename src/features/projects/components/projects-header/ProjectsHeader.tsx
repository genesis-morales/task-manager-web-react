import React from "react";
import { Button, Tooltip } from "antd";
import { SortAscendingOutlined, FilterOutlined, AppstoreOutlined, UnorderedListOutlined, PlusOutlined } from "@ant-design/icons";
import type { ViewMode } from "../../types/project.types";
import "./ProjectsHeader.scss";

interface ProjectsHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onNewProject: () => void;
  onSort: () => void;
  onFilter: () => void;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  viewMode,
  onViewModeChange,
  onNewProject,
  onSort,
  onFilter,
}) => (
  <div className="projects-header">
    <h1 className="projects-header__title">Projects</h1>

    <div className="projects-header__actions">
      <Button icon={<SortAscendingOutlined />} onClick={onSort} className="projects-header__btn">
        Sort
      </Button>
      <Button icon={<FilterOutlined />} onClick={onFilter} className="projects-header__btn">
        Filter
      </Button>

      <div className="projects-header__view-toggle">
        <Tooltip title="Grid view">
          <button
            className={`projects-header__view-btn ${viewMode === "grid" ? "projects-header__view-btn--active" : ""}`}
            onClick={() => onViewModeChange("grid")}
          >
            <AppstoreOutlined />
          </button>
        </Tooltip>
        <Tooltip title="List view">
          <button
            className={`projects-header__view-btn ${viewMode === "list" ? "projects-header__view-btn--active" : ""}`}
            onClick={() => onViewModeChange("list")}
          >
            <UnorderedListOutlined />
          </button>
        </Tooltip>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onNewProject}
        className="projects-header__new-btn"
      >
        New Project
      </Button>
    </div>
  </div>
);

export default ProjectsHeader;
