import React, { useState, useEffect, useRef } from "react";
import type { CreateProjectRequest } from "../../types/project.types";
import "./CreateProjectModal.scss";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectRequest) => Promise<boolean>;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setGithubUrl("");
      setError(null);
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    setLoading(true);
    setError(null);

    const data: CreateProjectRequest = {
      name: name.trim(),
      ...(description.trim() && { description: description.trim() }),
      ...(githubUrl.trim() && { github_repo_url: githubUrl.trim() }),
    };

    const success = await onSubmit(data);
    setLoading(false);

    if (success) {
      onClose();
    } else {
      setError("Failed to create project. The name might already be in use.");
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="create-modal__overlay" onClick={handleOverlayClick}>
      <div className="create-modal" role="dialog" aria-labelledby="create-modal-title" aria-modal="true">
        <div className="create-modal__header">
          <h2 id="create-modal-title" className="create-modal__title">New Project</h2>
          <button className="create-modal__close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className="create-modal__alert">
            <span>{error}</span>
          </div>
        )}

        <form className="create-modal__form" onSubmit={handleSubmit} noValidate>
          <div className="create-modal__field">
            <label className="create-modal__label" htmlFor="project-name">Name *</label>
            <input
              ref={nameInputRef}
              id="project-name"
              type="text"
              className="create-modal__input"
              placeholder="My Awesome Project"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null); }}
              maxLength={100}
            />
          </div>

          <div className="create-modal__field">
            <label className="create-modal__label" htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              className="create-modal__textarea"
              placeholder="Brief description of your project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="create-modal__field">
            <label className="create-modal__label" htmlFor="project-github">GitHub Repository</label>
            <input
              id="project-github"
              type="url"
              className="create-modal__input"
              placeholder="https://github.com/org/repo"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
            <span className="create-modal__hint">Optional — connect later from project settings</span>
          </div>

          <div className="create-modal__actions">
            <button type="button" className="create-modal__btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-modal__btn-submit" disabled={loading}>
              {loading ? <span className="create-modal__spinner" /> : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
