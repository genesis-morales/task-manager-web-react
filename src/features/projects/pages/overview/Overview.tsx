import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { tasksApi } from "../../services/workspaceService";
import { notesApi } from "../../services/workspaceService";
import { activityApi } from "../../services/workspaceService";
import type { Task, ProjectNote, ActivityEvent } from "../../types/workspace.types";
import "./Overview.scss";

const PRIORITY_LABELS: Record<string, { label: string; className: string }> = {
  HIGH: { label: "Alta", className: "overview__badge--danger" },
  MEDIUM: { label: "Media", className: "overview__badge--warning" },
  LOW: { label: "Baja", className: "overview__badge--info" },
};

const Overview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const currentProject = useSelector((state: RootState) => state.projects.currentProject);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Fetch tasks (only TODO/IN_PROGRESS)
    tasksApi.list(id, { size: 5 })
      .then((res) => setTasks(res.data.items))
      .catch(() => setTasks([]))
      .finally(() => setLoadingTasks(false));

    // Fetch recent notes
    notesApi.list(id, { size: 5 })
      .then((res) => setNotes(res.data.items))
      .catch(() => setNotes([]))
      .finally(() => setLoadingNotes(false));

    // Fetch activity
    activityApi.list(id, { size: 5 })
      .then((res) => setActivity(res.data.items))
      .catch(() => setActivity([]))
      .finally(() => setLoadingActivity(false));
  }, [id]);

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
    <div className="overview">
      {/* Project Header */}
      <div className="overview__header">
        <div className="overview__header-info">
          <h1 className="overview__title">
            {currentProject?.name || "Project"}
          </h1>
          {currentProject?.description && (
            <p className="overview__description">{currentProject.description}</p>
          )}
        </div>
        <div className="overview__header-meta">
          {currentProject?.github_repo_url && (
            <span className="overview__meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 22v-4a4.8 4.8 0 00-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 004 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 18c-4.51 2-5-2-7-2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="overview__meta-mono">
                {currentProject.github_repo_url.replace(/^https?:\/\/github\.com\//, '')}
              </span>
            </span>
          )}
          <span className="overview__meta-badge">Active</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="overview__cards">
        {/* Pending Tasks */}
        <div className="overview__card">
          <div className="overview__card-header">
            <h3 className="overview__card-title">Pending tasks</h3>
          </div>
          <div className="overview__card-body">
            {loadingTasks ? (
              <div className="overview__card-loading"><span className="overview__mini-spinner" /></div>
            ) : tasks.length === 0 ? (
              <p className="overview__card-empty">No pending tasks</p>
            ) : (
              <ul className="overview__task-list">
                {tasks.filter(t => t.status !== 'DONE').slice(0, 4).map((task) => (
                  <li key={task.id} className="overview__task-item">
                    <span className="overview__task-check" />
                    <span className="overview__task-title">{task.title}</span>
                    <span className={`overview__badge ${PRIORITY_LABELS[task.priority]?.className || ''}`}>
                      {PRIORITY_LABELS[task.priority]?.label || task.priority}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quick Notes */}
        <div className="overview__card">
          <div className="overview__card-header">
            <h3 className="overview__card-title">Quick notes</h3>
          </div>
          <div className="overview__card-body">
            {loadingNotes ? (
              <div className="overview__card-loading"><span className="overview__mini-spinner" /></div>
            ) : notes.length === 0 ? (
              <p className="overview__card-empty">No notes yet</p>
            ) : (
              <ul className="overview__note-list">
                {notes.slice(0, 4).map((note) => (
                  <li key={note.id} className="overview__note-item">
                    <span className="overview__note-content">{note.content}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="overview__card">
          <div className="overview__card-header">
            <h3 className="overview__card-title">Recent activity</h3>
          </div>
          <div className="overview__card-body">
            {loadingActivity ? (
              <div className="overview__card-loading"><span className="overview__mini-spinner" /></div>
            ) : activity.length === 0 ? (
              <p className="overview__card-empty">No activity yet</p>
            ) : (
              <ul className="overview__activity-list">
                {activity.slice(0, 4).map((event) => (
                  <li key={event.id} className="overview__activity-item">
                    <span className="overview__activity-dot" />
                    <span className="overview__activity-text">{event.description}</span>
                    <span className="overview__activity-time">{timeAgo(event.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* AI Context */}
        <div className="overview__card">
          <div className="overview__card-header">
            <h3 className="overview__card-title">AI Context</h3>
          </div>
          <div className="overview__card-body">
            <p className="overview__card-empty">Context generation coming soon</p>
          </div>
        </div>
      </div>

      {/* Project Context Section */}
      <div className="overview__context-section">
        <div className="overview__context-card">
          <h3 className="overview__context-title">Project Context</h3>
          {currentProject?.description ? (
            <p className="overview__context-description">{currentProject.description}</p>
          ) : (
            <p className="overview__card-empty">Add a description to your project to see context here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
