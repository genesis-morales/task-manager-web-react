import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Alert, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./LoginForm.scss";

const { Title, Paragraph, Text } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError(null);
    const result = await login(values.email, values.password);

    if (result.success) {
      const from = (location.state as any)?.from?.pathname || "/projects";
      navigate(from, { replace: true });
    } else {
      setError(result.error || "Invalid credentials");
    }
  };

  return (
    <div className="login-form">
      <div className="login-form__header">
        <Title level={2} className="login-form__title">Welcome back</Title>
        <Paragraph className="login-form__subtitle">
          Enter your credentials to access your workspace.
        </Paragraph>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          className="login-form__alert"
        />
      )}

      <Form layout="vertical" requiredMark={false} onFinish={handleSubmit} autoComplete="off">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="alex.smith@workspace.dev" size="large" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="••••••••••" size="large" />
        </Form.Item>

        <div className="login-form__extras">
          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Button type="link" className="login-form__forgot" onClick={() => navigate("/password-reset")}>
            Forgot password?
          </Button>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" loading={isLoading} block className="login-form__submit-btn">
            Log in
          </Button>
        </Form.Item>
      </Form>

      <div className="login-form__signup">
        <Text type="secondary">Don't have an account?</Text>
        <Button type="link" onClick={() => navigate("/register")}>Sign up</Button>
      </div>
    </div>
  );
};

export default LoginForm;
