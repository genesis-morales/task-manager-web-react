import { useState } from "react";
import { Form, Input, Button, Progress } from "antd";
import { LockOutlined, ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./SetNewPassword.module.scss";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 25, label: "WEAK", color: "#ff4d4f" };
  if (score === 2) return { score: 50, label: "MEDIUM", color: "#faad14" };
  if (score === 3) return { score: 75, label: "STRONG", color: "#52c41a" };
  return { score: 100, label: "VERY STRONG", color: "#1677ff" };
};

const SetNewPassword = () => {
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const strength = getPasswordStrength(password);

  const onFinish = async (_values: { password: string; confirmPassword: string }) => {
    try {
      // await authApi.confirmPasswordReset(...)
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.successIcon}>
            <CheckCircleOutlined />
          </div>
          <h2 className={styles.title}>Password updated</h2>
          <p className={styles.subtitle}>
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <Button
            type="primary"
            block
            size="large"
            className={styles.submitBtn}
            onClick={() => navigate("/login")}
          >
            Back to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Set new password</h2>
          <p className={styles.subtitle}>
            Your new password must be different from your previously used password.
          </p>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="New password"
            name="password"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="Enter new password"
              size="large"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          {password && (
            <div className={styles.strengthWrapper}>
              <Progress
                percent={strength.score}
                strokeColor={strength.color}
                showInfo={false}
                size="small"
              />
              <span className={styles.strengthLabel} style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}

          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="Confirm new password"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: "12px" }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className={styles.submitBtn}
            >
              Reset password
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.backWrapper}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/login")}
            className={styles.backBtn}
          >
            Back to login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;