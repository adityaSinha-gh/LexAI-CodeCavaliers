/**
 * LoginPage.jsx
 * ------------------------------------------------------------------
 * BhashaSetu login screen. Submits to POST /api/auth/login, then
 * hands the { accessToken, user } response to AuthContext's login().
 * Uses the shared axiosClient (cookies + interceptor already wired)
 * and the lx-* classes from LoginPage.css.
 * ------------------------------------------------------------------
 */
import { useState } from "react";
import axiosClient from "./axiosClient";
import { useAuth } from "./AuthContext";
import PasswordInput from "./PasswordInput";
import "./LoginPage.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required";
    else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address";

    if (!password) errors.password = "Password is required";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { data } = await axiosClient.post("/api/auth/login", {
        email: email.trim(),
        password,
        rememberMe,
      });
      // Expected shape: { success, accessToken, user }
      login(data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Incorrect email or password."
          : "Something went wrong. Please try again.");
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="lx-auth-shell">
      <div className="lx-auth-panel">
        <div className="lx-auth-panel__grain" />
        <div className="lx-auth-panel__content">
          <div className="lx-wordmark">
            <span className="lx-wordmark__lex">Lex</span>
            <span className="lx-wordmark__ai">AI</span>
          </div>
          <div className="lx-auth-panel__copy">
            <h1 className="lx-headline">Bridging languages, connecting people.</h1>
            <ul className="lx-features">
              <li className="lx-feature">
                <span className="lx-feature__icon">✓</span>
                <span className="lx-feature__text">
                  Real-time translation across 40+ languages
                </span>
              </li>
              <li className="lx-feature">
                <span className="lx-feature__icon">✓</span>
                <span className="lx-feature__text">
                  Secure, encrypted conversations end to end
                </span>
              </li>
              <li className="lx-feature">
                <span className="lx-feature__icon">✓</span>
                <span className="lx-feature__text">
                  Built for teams working across borders
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="lx-form-panel">
        <div className="lx-form-card">
          <div className="lx-form-header">
            <h2>Welcome back</h2>
            <p>Log in to continue to your LexAI account.</p>
          </div>

          <form className="lx-form" onSubmit={handleSubmit} noValidate>
            {formError && <div className="lx-form-error">{formError}</div>}

            <div className="lx-field">
              <label className="lx-label" htmlFor="lx-email">
                Email
              </label>
              <div
                className={`lx-input-wrap${fieldErrors.email ? " lx-input-wrap--error" : ""}`}
              >
                <input
                  id="lx-email"
                  name="email"
                  type="email"
                  className="lx-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
              </div>
              {fieldErrors.email && <p className="lx-error">{fieldErrors.email}</p>}
            </div>

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
            />

            <div className="lx-form-row">
              <label className="lx-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="lx-checkbox__box" />
                Remember me
              </label>
              <a className="lx-link" href="/forgot-password">
                Forgot password?
              </a>
            </div>

            <button className="lx-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="lx-submit__loading">
                  <span className="lx-loading-dot" />
                  <span className="lx-loading-dot" />
                  <span className="lx-loading-dot" />
                </span>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="lx-signup-cta">
            <span className="lx-link--muted">Don&apos;t have an account? </span>
            <a className="lx-link" href="/signup">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
