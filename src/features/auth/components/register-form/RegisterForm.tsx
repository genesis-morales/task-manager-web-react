import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./RegisterForm.scss";

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

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
  }>({});

  const strength = getPasswordStrength(password);

  const validate = (): boolean => {
    const errors: { email?: string; username?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!username.trim()) {
      errors.username = "Please enter a username";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!password) {
      errors.password = "Please enter a password";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/^(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      errors.password = "Must include uppercase letter and number";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setError(null);
    const result = await register(email, username, password);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <div className="register-form">
      <div className="register-form__header">
        <h2 className="register-form__title">Create your account</h2>
        <p className="register-form__subtitle">
          Start managing your workflow effectively today.
        </p>
      </div>

      {error && (
        <div className="register-form__alert register-form__alert--error">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3.5M8 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{error}</span>
          <button className="register-form__alert-close" onClick={() => setError(null)} aria-label="Close">×</button>
        </div>
      )}

      <form className="register-form__form" onSubmit={handleSubmit} noValidate>
        <div className="register-form__field">
          <label className="register-form__label" htmlFor="reg-email">Email Address</label>
          <input
            id="reg-email"
            type="email"
            className={`register-form__input ${fieldErrors.email ? "register-form__input--error" : ""}`}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: undefined })); }}
            autoComplete="email"
          />
          {fieldErrors.email && <span className="register-form__error">{fieldErrors.email}</span>}
        </div>

        <div className="register-form__field">
          <label className="register-form__label" htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            type="text"
            className={`register-form__input ${fieldErrors.username ? "register-form__input--error" : ""}`}
            placeholder="johndoe"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setFieldErrors(prev => ({ ...prev, username: undefined })); }}
            autoComplete="username"
          />
          {fieldErrors.username && <span className="register-form__error">{fieldErrors.username}</span>}
        </div>

        <div className="register-form__field">
          <label className="register-form__label" htmlFor="reg-password">Password</label>
          <div className="register-form__input-wrapper">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              className={`register-form__input ${fieldErrors.password ? "register-form__input--error" : ""}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: undefined })); }}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="register-form__toggle-password"
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
          {fieldErrors.password && <span className="register-form__error">{fieldErrors.password}</span>}

          {password && (
            <div className="register-form__strength">
              <div className="register-form__strength-bar">
                <div
                  className={`register-form__strength-fill register-form__strength-fill--${strength.level}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
              <div className="register-form__strength-info">
                <span className={`register-form__strength-label register-form__strength-label--${strength.level}`}>
                  {strength.label}
                </span>
                <span className="register-form__strength-hint">
                  Use symbols for stronger password
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="register-form__submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="register-form__spinner" />
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <div className="register-form__login">
        <span>Already have an account?</span>
        <button
          type="button"
          className="register-form__login-link"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
