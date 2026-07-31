import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchProjectById, clearCurrentProject } from "../../store/projectsSlice";
import "./ProjectDetail.scss";

const ProjectDetail: React.FC = () => {
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

  if (isLoading) {
    return (
      <div className="project-detail project-detail--loading">
        <div className="project-detail__spinner" />
        <span>Loading project...</span>
      </div>
    );
  }

  if (error || !currentProject) {
    return (
      <div className="project-detail project-detail--error">
        <h2>Project not found</h2>
        <p>{error || "The project you're looking for doesn't exist."}</p>
        <button className="project-detail__back-btn" onClick={() => navigate("/projects")}>
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <div className="project-detail__header">
        <button className="project-detail__back-btn" onClick={() => navigate("/projects")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Projects
        </button>
        <h1 className="project-detail__title">{currentProject.name}</h1>
        {currentProject.description && (
          <p className="project-detail__description">{currentProject.description}</p>
        )}
      </div>

      {/* Project Workspace content will go here (Pantalla 2) */}
      <div className="project-detail__workspace">
        <p className="project-detail__placeholder">
          Project workspace — coming soon
        </p>
      </div>
    </div>
  );
};

export default ProjectDetail;
