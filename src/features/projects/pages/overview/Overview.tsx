import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Tag, Typography, Spin, Badge, Empty } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import type { RootState } from "../../../../store/store";
import { tasksApi, notesApi, activityApi } from "../../services/workspaceService";
import type { Task, ProjectNote, ActivityEvent } from "../../types/workspace.types";
import "./Overview.scss";

const { Title, Paragraph, Text } = Typography;

const PRIORITY_COLOR: Record<string, string> = {
  HIGH: "red",
  MEDIUM: "gold",
  LOW: "blue",
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

    tasksApi.list(id, { size: 5 })
      .then((res) => setTasks(res.data.items))
      .catch(() => setTasks([]))
      .finally(() => setLoadingTasks(false));

    notesApi.list(id, { size: 5 })
      .then((res) => setNotes(res.data.items))
      .catch(() => setNotes([]))
      .finally(() => setLoadingNotes(false));

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
      {/* Header */}
      <div className="overview__header">
        <Title level={2} className="overview__title">{currentProject?.name || "Project"}</Title>
        {currentProject?.description && (
          <Paragraph type="secondary">{currentProject.description}</Paragraph>
        )}
        <div className="overview__meta">
          {currentProject?.github_repo_url && (
            <Tag color="processing">
              {currentProject.github_repo_url.replace(/^https?:\/\/github\.com\//, '')}
            </Tag>
          )}
          <Tag color="success">Active</Tag>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="overview__cards">
        {/* Pending Tasks */}
        <Card title="Pending tasks" className="overview__card" size="small">
          {loadingTasks ? <Spin /> : tasks.filter(t => t.status !== 'DONE').length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No pending tasks" />
          ) : (
            <ul className="overview__task-list">
              {tasks.filter(t => t.status !== 'DONE').slice(0, 4).map((task) => (
                <li key={task.id} className="overview__task-item">
                  <CheckCircleOutlined className="overview__task-icon" />
                  <Text ellipsis className="overview__task-title">{task.title}</Text>
                  <Tag color={PRIORITY_COLOR[task.priority]} className="overview__task-tag">
                    {task.priority}
                  </Tag>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Quick Notes */}
        <Card title="Quick notes" className="overview__card" size="small">
          {loadingNotes ? <Spin /> : notes.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notes yet" />
          ) : (
            <ul className="overview__note-list">
              {notes.slice(0, 4).map((note) => (
                <li key={note.id} className="overview__note-item">
                  <Text type="secondary" ellipsis={{ tooltip: note.content }}>{note.content}</Text>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recent Activity */}
        <Card title="Recent activity" className="overview__card" size="small">
          {loadingActivity ? <Spin /> : activity.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No activity yet" />
          ) : (
            <ul className="overview__activity-list">
              {activity.slice(0, 4).map((event) => (
                <li key={event.id} className="overview__activity-item">
                  <Badge status="processing" />
                  <Text type="secondary" ellipsis className="overview__activity-text">{event.description}</Text>
                  <Text type="secondary" className="overview__activity-time">{timeAgo(event.created_at)}</Text>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* AI Context */}
        <Card title="AI Context" className="overview__card" size="small">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Context generation coming soon" />
        </Card>
      </div>

      {/* Project Context */}
      <Card title="Project Context" className="overview__context-card">
        {currentProject?.description ? (
          <Paragraph>{currentProject.description}</Paragraph>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Add a project description to see context here." />
        )}
      </Card>
    </div>
  );
};

export default Overview;
