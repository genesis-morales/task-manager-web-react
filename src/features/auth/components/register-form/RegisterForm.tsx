import React, { useState } from "react";
import { Form, Input, Button, Alert, Progress, Typography } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./RegisterForm.scss";

const { Title, Paragraph, Text } = Typography;

interface PasswordStrength { score: number; label: string; color: string; }

const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score: 25, label: "Weak", color: "#E06C75" };
  if (score === 2) return { score: 50, label: "Medium", color: "#F4B860" };
  if (score === 3) return { score: 75, label: "Strong", color: "#19B38C" };
  return { score: 100, label: "Very Strong", color: "#68A4FF" };
};

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [passwordValue, setPasswordValue] = useState("");
  const strength = getPasswordStrength(passwordValue);

  const handleSubmit = async (values: { email: string; username: string; password: string }) => {
    setError(null);
    const result = await register(values.email, values.username, values.password);
    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <div className="register-form">
      <div className="register-form__header">
        <Title level={2} className="register-form__title">Create your account</Title>
        <Paragraph className="register-form__subtitle">
          Start managing your workflow effectively today.
        </Paragraph>
      </div>

      {error && (
        <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} className="register-form__alert" />
      )}

      <Form layout="vertical" requiredMark="optional" onFinish={handleSubmit} autoComplete="off">
        <Form.Item label="Email" name="email" rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}>
          <Input prefix={<MailOutlined />} placeholder="you@example.com" size="large" />
        </Form.Item>

        <Form.Item label="Username" name="username" rules={[
          { required: true, message: "Please enter a username" },
          { min: 3, message: "Username must be at least 3 characters" },
        ]}>
          <Input prefix={<UserOutlined />} placeholder="johndoe" size="large" />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[
          { required: true, message: "Please enter a password" },
          { min: 8, message: "Password must be at least 8 characters" },
          { pattern: /^(?=.*[A-Z])(?=.*[0-9])/, message: "Must include uppercase letter and number" },
        ]}>
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="••••••••"
            size="large"
            onChange={(e) => setPasswordValue(e.target.value)}
          />
        </Form.Item>

        {passwordValue && (
          <div className="register-form__strength">
            <Progress percent={strength.score} showInfo={false} strokeColor={strength.color} size="small" />
            <Text style={{ color: strength.color, fontSize: 12, fontWeight: 600 }}>{strength.label}</Text>
          </div>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" loading={isLoading} block className="register-form__submit-btn">
            Create account
          </Button>
        </Form.Item>
      </Form>

      <div className="register-form__login">
        <Text type="secondary">Already have an account?</Text>
        <Button type="link" onClick={() => navigate("/login")}>Log in</Button>
      </div>
    </div>
  );
};

export default RegisterForm;
