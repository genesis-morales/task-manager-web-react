import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Dropdown, Typography, Tag } from "antd";
import { EllipsisOutlined, GithubOutlined, DeleteOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import type { Project } from "../../types/project.types";
import "./ProjectCard.scss";

const { Title, Paragraph, Text } = Typography;

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();

  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onDelete(project.id);
      },
    },
  ];

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card
      className="project-card"
      hoverable
      onClick={handleCardClick}
      extra={
        <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
          <EllipsisOutlined onClick={(e) => e.stopPropagation()} className="project-card__menu" />
        </Dropdown>
      }
    >
      <Title level={5} className="project-card__name">{project.name}</Title>

      {project.description && (
        <Paragraph type="secondary" ellipsis={{ rows: 2 }} className="project-card__description">
          {project.description}
        </Paragraph>
      )}

      <div className="project-card__footer">
        {project.github_repo_url && (
          <Tag icon={<GithubOutlined />} className="project-card__repo-tag">
            {project.github_repo_url.replace(/^https?:\/\/github\.com\//, '')}
          </Tag>
        )}
        <Text type="secondary" className="project-card__time">
          Updated {timeAgo(project.updated_at)}
        </Text>
      </div>
    </Card>
  );
};

export default ProjectCard;
