import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import type { CreateProjectRequest } from "../../types/project.types";
import "./CreateProjectModal.scss";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectRequest) => Promise<boolean>;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const data: CreateProjectRequest = {
        name: values.name.trim(),
        ...(values.description?.trim() && { description: values.description.trim() }),
        ...(values.github_repo_url?.trim() && { github_repo_url: values.github_repo_url.trim() }),
      };

      const success = await onSubmit(data);
      setLoading(false);

      if (success) {
        message.success("Project created!");
        form.resetFields();
        onClose();
      } else {
        message.error("Failed to create project. Name might be taken.");
      }
    } catch {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="New Project"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Create Project"
      destroyOnClose
      className="create-project-modal"
    >
      <Form form={form} layout="vertical" requiredMark="optional" autoComplete="off">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Project name is required" }]}
        >
          <Input placeholder="My Awesome Project" maxLength={100} />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Brief description of your project..." rows={3} maxLength={500} />
        </Form.Item>

        <Form.Item label="GitHub Repository" name="github_repo_url" extra="Optional — connect later from project settings">
          <Input placeholder="https://github.com/org/repo" type="url" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;
