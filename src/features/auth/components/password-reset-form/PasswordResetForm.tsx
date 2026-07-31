import React, { useState } from "react";
import { Form, Input, Button, Alert, Typography, Result } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../services/authService";
import "./PasswordResetForm.scss";

const { Title, Paragraph } = Typography;

const PasswordResetForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    try {
      setLoading(true);
      await authApi.requestPasswordReset({ email: values.email });
      setSubmitted(true);
    } catch (error: any) {
      form.setFields([{ name: "email", errors: [error.response?.data?.detail || "Something went wrong."] }]);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="password-reset-form">
        <Result
          status="success"
          title="Check your email"
          subTitle="We sent a password reset link to your email address."
          extra={
            <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/login")}>
              Back to login
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="password-reset-form">
      <div className="password-reset-form__header">
        <Title level={2} className="password-reset-form__title">Reset your password</Title>
        <Paragraph className="password-reset-form__subtitle">
          Enter your email and we'll send you a link to reset your password.
        </Paragraph>
      </div>

      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit} autoComplete="off">
        <Form.Item label="Email address" name="email" rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}>
          <Input prefix={<MailOutlined />} placeholder="alex.rivera@example.com" size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" loading={loading} block className="password-reset-form__submit-btn">
            Send reset link
          </Button>
        </Form.Item>
      </Form>

      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/login")}>
        Back to login
      </Button>
    </div>
  );
};

export default PasswordResetForm;
