import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./LoginForm.scss";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const location = useLocation();

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email";
    }
    if (!password) {
      errors.password = "Please enter your password";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setError(null);
    const result = await login(email, password);

    if (result.success) {
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } else {
      setError(result.error || "Invalid credentials");
    }
  };

  return (
    <div className="login-form">
      <div className="login-form__header">
        <h2 className="login-form__title">Welcome back</h2>
        <p className="login-form__subtitle">
          Enter your credentials to access your workspace.
        </p>
      </div>

      {error && (
        <div className="login-form__alert login-form__alert--error">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3.5M8 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{error}</span>
          <button className="login-form__alert-close" onClick={() => setError(null)} aria-label="Close">×</button>
        </div>
      )}

      <form className="login-form__form" onSubmit={handleSubmit} noValidate>
        <div className="login-form__field">
          <label className="login-form__label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className={`login-form__input ${fieldErrors.email ? "login-form__input--error" : ""}`}
            placeholder="alex.smith@workspace.dev"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: undefined })); }}
            autoComplete="email"
          />
          {fieldErrors.email && <span className="login-form__error">{fieldErrors.email}</span>}
        </div>

        <div className="login-form__field">
          <label className="login-form__label" htmlFor="password">Password</label>
          <div className="login-form__input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`login-form__input ${fieldErrors.password ? "login-form__input--error" : ""}`}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: undefined })); }}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-form__toggle-password"
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
          {fieldErrors.password && <span className="login-form__error">{fieldErrors.password}</span>}
        </div>

        <div className="login-form__extras">
          <label className="login-form__checkbox-label">
            <input
              type="checkbox"
              className="login-form__checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="login-form__checkbox-custom" />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            className="login-form__forgot"
            onClick={() => navigate("/password-reset")}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="login-form__submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="login-form__spinner" />
          ) : (
            "Log in"
          )}
        </button>
      </form>

      <div className="login-form__signup">
        <span>Don't have an account?</span>
        <button
          type="button"
          className="login-form__signup-link"
          onClick={() => navigate("/register")}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
