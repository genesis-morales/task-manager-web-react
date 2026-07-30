import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../services/authService";
import "./PasswordResetForm.scss";

const PasswordResetForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await authApi.requestPasswordReset({ email });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="password-reset-form">
        <div className="password-reset-form__success">
          <div className="password-reset-form__success-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="password-reset-form__success-title">Check your email</h3>
          <p className="password-reset-form__success-text">
            We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
          </p>
          <button
            type="button"
            className="password-reset-form__back-btn"
            onClick={() => navigate("/login")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset-form">
      <div className="password-reset-form__header">
        <h2 className="password-reset-form__title">Reset your password</h2>
        <p className="password-reset-form__subtitle">
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div className="password-reset-form__alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3.5M8 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form className="password-reset-form__form" onSubmit={handleSubmit} noValidate>
        <div className="password-reset-form__field">
          <label className="password-reset-form__label" htmlFor="reset-email">
            Email address
          </label>
          <input
            id="reset-email"
            type="email"
            className="password-reset-form__input"
            placeholder="alex.rivera@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          className="password-reset-form__submit"
          disabled={loading}
        >
          {loading ? (
            <span className="password-reset-form__spinner" />
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      <button
        type="button"
        className="password-reset-form__back-btn"
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

export default PasswordResetForm;
