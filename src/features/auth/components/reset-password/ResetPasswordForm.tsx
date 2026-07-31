import React, { useState } from "react";
import { Form, Input, Button, Alert, Typography, Result, Progress } from "antd";
import { LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../services/authService";
import "./ResetPassword.scss";

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

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordValue, setPasswordValue] = useState("");
  const strength = getPasswordStrength(passwordValue);

  if (!token) {
    return (
      <div className="reset-password">
        <Result
          status="error"
          title="Invalid reset link"
          subTitle="This link is invalid or has expired."
          extra={<Button type="primary" onClick={() => navigate("/password-reset")}>Request a new link</Button>}
        />
      </div>
    );
  }

  if (success) {
    return (
      <div className="reset-password">
        <Result
          status="success"
          title="Password updated"
          subTitle="Your password has been reset successfully."
          extra={<Button type="primary" onClick={() => navigate("/login")}>Back to login</Button>}
        />
      </div>
    );
  }

  const handleSubmit = async (values: { new_password: string }) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.confirmPasswordReset({ token, new_password: values.new_password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password">
      <div className="reset-password__header">
        <Title level={2} className="reset-password__title">Set new password</Title>
        <Paragraph className="reset-password__subtitle">
          Your new password must be different from previously used passwords.
        </Paragraph>
      </div>

      {error && <Alert message={error} type="error" showIcon className="reset-password__alert" />}

      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit} autoComplete="off">
        <Form.Item label="New password" name="new_password" rules={[
          { required: true, message: "Please enter your new password" },
          { min: 8, message: "Must be at least 8 characters" },
        ]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" size="large"
            onChange={(e) => setPasswordValue(e.target.value)}
          />
        </Form.Item>

        {passwordValue && (
          <div className="reset-password__strength">
            <Progress percent={strength.score} showInfo={false} strokeColor={strength.color} size="small" />
            <Text style={{ color: strength.color, fontSize: 12, fontWeight: 600 }}>{strength.label}</Text>
          </div>
        )}

        <Form.Item label="Confirm password" name="confirm_password" dependencies={["new_password"]} rules={[
          { required: true, message: "Please confirm your password" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("new_password") === value) return Promise.resolve();
              return Promise.reject(new Error("Passwords do not match"));
            },
          }),
        ]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" loading={loading} block className="reset-password__submit-btn">
            Reset password
          </Button>
        </Form.Item>
      </Form>

      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/login")}>Back to login</Button>
    </div>
  );
};

export default ResetPasswordForm;
