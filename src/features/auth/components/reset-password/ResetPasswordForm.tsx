import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../services/authService";
import "./ResetPassword.scss";

interface PasswordStrength {
  score: number;
  label: string;
  level: "weak" | "medium" | "strong" | "very-strong" | "";
}

const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return { score: 0, label: "", level: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score: 25, label: "Weak", level: "weak" };
  if (score === 2) return { score: 50, label: "Medium", level: "medium" };
  if (score === 3) return { score: 75, label: "Strong", level: "strong" };
  return { score: 100, label: "Very strong", level: "very-strong" };
};

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});

  const strength = getPasswordStrength(password);

  // Invalid token
  if (!token) {
    return (
      <div className="reset-password">
        <div className="reset-password__error-state">
          <div className="reset-password__error-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="reset-password__title">Invalid reset link</h3>
          <p className="reset-password__subtitle">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            className="reset-password__link-btn"
            onClick={() => navigate("/password-reset")}
          >
            Request a new reset link
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="reset-password">
        <div className="reset-password__success-state">
          <div className="reset-password__success-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="reset-password__title">Password updated</h3>
          <p className="reset-password__subtitle">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <button
            className="reset-password__submit"
            onClick={() => navigate("/login")}
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  const validate = (): boolean => {
    const errors: { password?: string; confirm?: string } = {};
    if (!password) {
      errors.password = "Please enter your new password";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!confirmPassword) {
      errors.confirm = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirm = "Passwords do not match";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setError(null);
      await authApi.confirmPasswordReset({ token, new_password: password });
      setSuccess(true);
    } catch (err: any) {
      const message = err.response?.data?.detail;
      if (message === "Token has expired.") {
        setError("This reset link has expired. Please request a new one.");
      } else if (message === "Token already used.") {
        setError("This reset link has already been used.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password">
      <div className="reset-password__header">
        <h2 className="reset-password__title">Set new password</h2>
        <p className="reset-password__subtitle">
          Your new password must be different from your previously used password.
        </p>
      </div>

      {error && (
        <div className="reset-password__alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3.5M8 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form className="reset-password__form" onSubmit={handleSubmit} noValidate>
        <div className="reset-password__field">
          <label className="reset-password__label" htmlFor="new-password">New password</label>
          <div className="reset-password__input-wrapper">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              className={`reset-password__input ${fieldErrors.password ? "reset-password__input--error" : ""}`}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: undefined })); }}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="reset-password__toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          {fieldErrors.password && <span className="reset-password__error">{fieldErrors.password}</span>}

          {password && (
            <div className="reset-password__strength">
              <div className="reset-password__strength-bar">
                <div
                  className={`reset-password__strength-fill reset-password__strength-fill--${strength.level}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
              <span className={`reset-password__strength-label reset-password__strength-label--${strength.level}`}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <div className="reset-password__field">
          <label className="reset-password__label" htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            type="password"
            className={`reset-password__input ${fieldErrors.confirm ? "reset-password__input--error" : ""}`}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors(prev => ({ ...prev, confirm: undefined })); }}
            autoComplete="new-password"
          />
          {fieldErrors.confirm && <span className="reset-password__error">{fieldErrors.confirm}</span>}
        </div>

        <button
          type="submit"
          className="reset-password__submit"
          disabled={loading}
        >
          {loading ? (
            <span className="reset-password__spinner" />
          ) : (
            "Reset password"
          )}
        </button>
      </form>

      <button
        type="button"
        className="reset-password__back-btn"
        onClick={() => navigate("/login")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to login
      </button>
    </div>
  );
};

export default ResetPasswordForm;
