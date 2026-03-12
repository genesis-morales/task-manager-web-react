import React, { useState } from "react";
import { Button, Form, Input, Typography, Card } from "antd";
import { ArrowLeftOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./PasswordResetForm.scss";

const { Title, Paragraph, Text } = Typography;

interface PasswordResetFormValues {
  email: string;
}

const PasswordResetForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<PasswordResetFormValues>();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (values: PasswordResetFormValues): void => {
    setLoading(true);
    console.log(values);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="password-reset-form__card" bordered={false}>
        <div className="password-reset-form__success">
          <div className="password-reset-form__success-icon">
            <LockOutlined />
          </div>
          <Title level={3} className="password-reset-form__success-title">
            Check your email
          </Title>
          <Paragraph className="password-reset-form__success-subtitle">
            We sent a password reset link to your email address.
          </Paragraph>
          <Button
            type="link"
            className="password-reset-form__back-link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/login")}
          >
            Back to login
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="password-reset-form__card" bordered={false}>

      {/* Header */}
      <div className="password-reset-form__header">
        <Title level={2} className="password-reset-form__title">
          Reset your password
        </Title>
        <Paragraph className="password-reset-form__subtitle">
          Enter the email address associated with your account and we will send
          you a link to reset your password.
        </Paragraph>
      </div>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        autoComplete="off"
      >
        <Form.Item
          label="Email address"
          name="email"
          rules={[
            { required: true, message: "Please enter your email address" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input
            placeholder="alex.rivera@example.com"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            block
            className="password-reset-form__submit-btn"
          >
            Send reset link
          </Button>
        </Form.Item>
      </Form>

      {/* Back to login */}
      <div className="password-reset-form__back">
        <Button
          type="link"
          className="password-reset-form__back-link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/login")}
        >
          Back to login
        </Button>
      </div>

    </Card>
  );
};

export default PasswordResetForm;
