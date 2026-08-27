import React, { useState } from "react";
import "./SignupPage.css";
import { signup } from "./client.js";
import { useAuth } from "./AuthContext.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LANGUAGES = ["English", "Hindi", "Telugu", "Marathi", "Bengali", "Tamil", "Kannada"];

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3l18 18M10.6 10.7a3.2 3.2 0 0 0 4.5 4.5M6.6 6.8C3.9 8.4 2 12 2 12s4 7 11 7c1.7 0 3.2-.4 4.5-1.1M9.9 5.2A11 11 0 0 1 12 5c7 0 11 7 11 7-.6 1-1.4 2.1-2.4 3.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

const initialForm = {
  name: "",
  email: "",
  college: "",
  branch: "",
  year: "",
  semester: "",
  preferredLanguage: "English",
  password: "",
  confirmPassword: "",
};

export default function SignupPage({ onSignupSuccess }) {
  const { setSession } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const next = {};

    if (!form.name.trim()) next.name = "Full name is required";

    if (!form.email.trim()) next.email = "Email is required";
    else if (!EMAIL_REGEX.test(form.email.trim())) next.email = "Enter a valid email address";

    if (!form.college.trim()) next.college = "College is required";
    if (!form.branch.trim()) next.branch = "Branch is required";
    if (!form.year) next.year = "Select your year";
    if (!form.semester) next.semester = "Select your semester";

    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 8) next.password = "Password must be at least 8 characters";

    if (!form.confirmPassword) next.confirmPassword = "Please confirm your password";
    else if (form.password && form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords do not match";

    if (!agreeTerms) next.terms = "Please accept the Terms and Privacy Policy to continue";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = form;
      const data = await signup(payload);

      // Wire into your existing auth store here. This assumes a response
      // shape mirroring the Login page's success response
      // ({ accessToken, user }) — adjust to match your real signup API.
      if (data?.accessToken) {
        setSession({ accessToken: data.accessToken, user: data.newUser });
      }
      onSignupSuccess?.(data);
    } catch (err) {
      setFormError(err?.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function fieldWrapClass(key) {
    return `lx-input-wrap${errors[key] ? " lx-input-wrap--error" : ""}`;
  }

  return (
    <div className="lx-auth-shell">
      {/* LEFT */}
      <div className="lx-auth-panel">
        <div className="lx-auth-panel__grain" />
        <svg className="lx-auth-panel__arc" viewBox="0 0 600 300" preserveAspectRatio="xMidYMax slice">
          <path d="M -50 280 Q 300 60 650 280" fill="none" stroke="#B89B5E" strokeWidth="1.5" opacity="0.5" />
          <path d="M -50 320 Q 300 140 650 320" fill="none" stroke="#C9A6A0" strokeWidth="1" opacity="0.35" />
        </svg>
        <div className="lx-auth-panel__content">
          <div className="lx-wordmark">
            <span className="lx-wordmark__lex">Lex</span>
            <span className="lx-wordmark__ai">AI</span>
          </div>

          <div className="lx-auth-panel__copy">
            <h1 className="lx-headline">Begin building your bridge.</h1>

            <ul className="lx-features">
              <li className="lx-feature">
                <span className="lx-feature__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                    <path
                      d="M3 12h18M12 3c2.5 2.5 3.8 6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-6-3.8-9s1.3-6.5 3.8-9Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </span>
                <span className="lx-feature__text">
                  Learn across English, Hindi, Telugu, Marathi, Bengali, and more — switch mid-conversation
                  whenever you like.
                </span>
              </li>
              <li className="lx-feature">
                <span className="lx-feature__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 3.5h9l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <path d="M9 12h6M9 15.5h6M9 8.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="lx-feature__text">
                  Every explanation points back to a real source, so you always know where the answer comes from.
                </span>
              </li>
              <li className="lx-feature">
                <span className="lx-feature__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 19V5a1 1 0 0 1 1-1h9l6 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <path d="M14 4v5a1 1 0 0 0 1 1h5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="lx-feature__text">
                  Set up once with your college and branch, and LexAI tailors every session to your syllabus.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="lx-form-panel">
        <div className="lx-form-card">
          <div className="lx-form-header">
            <h2>Create your account</h2>
            <p>A few details, and your bridge to LexAI is ready.</p>
          </div>

          <form className="lx-form" noValidate onSubmit={handleSubmit}>
            {formError && <div className="lx-form-error">{formError}</div>}

            <div className="lx-field">
              <label className="lx-label" htmlFor="name">
                Full name
              </label>
              <div className={fieldWrapClass("name")}>
                <input
                  id="name"
                  className="lx-input"
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
              {errors.name && (
                <p className="lx-error" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="lx-field">
              <label className="lx-label" htmlFor="email">
                Email
              </label>
              <div className={fieldWrapClass("email")}>
                <input
                  id="email"
                  className="lx-input"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
              {errors.email && (
                <p className="lx-error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="lx-field-row">
              <div className="lx-field">
                <label className="lx-label" htmlFor="college">
                  College
                </label>
                <div className={fieldWrapClass("college")}>
                  <input
                    id="college"
                    className="lx-input"
                    type="text"
                    placeholder="Your college"
                    autoComplete="organization"
                    value={form.college}
                    onChange={(e) => updateField("college", e.target.value)}
                  />
                </div>
                {errors.college && (
                  <p className="lx-error" role="alert">
                    {errors.college}
                  </p>
                )}
              </div>
              <div className="lx-field">
                <label className="lx-label" htmlFor="branch">
                  Branch
                </label>
                <div className={fieldWrapClass("branch")}>
                  <input
                    id="branch"
                    className="lx-input"
                    type="text"
                    placeholder="e.g. CSE"
                    value={form.branch}
                    onChange={(e) => updateField("branch", e.target.value)}
                  />
                </div>
                {errors.branch && (
                  <p className="lx-error" role="alert">
                    {errors.branch}
                  </p>
                )}
              </div>
            </div>

            <div className="lx-field-row">
              <div className="lx-field">
                <label className="lx-label" htmlFor="year">
                  Year
                </label>
                <div className={fieldWrapClass("year")}>
                  <select
                    id="year"
                    className="lx-input"
                    value={form.year}
                    onChange={(e) => updateField("year", e.target.value)}
                  >
                    <option value="" disabled>
                      Select year
                    </option>
                    <option value="1">1st year</option>
                    <option value="2">2nd year</option>
                    <option value="3">3rd year</option>
                    <option value="4">4th year</option>
                  </select>
                </div>
                {errors.year && (
                  <p className="lx-error" role="alert">
                    {errors.year}
                  </p>
                )}
              </div>
              <div className="lx-field">
                <label className="lx-label" htmlFor="semester">
                  Semester
                </label>
                <div className={fieldWrapClass("semester")}>
                  <select
                    id="semester"
                    className="lx-input"
                    value={form.semester}
                    onChange={(e) => updateField("semester", e.target.value)}
                  >
                    <option value="" disabled>
                      Select semester
                    </option>
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.semester && (
                  <p className="lx-error" role="alert">
                    {errors.semester}
                  </p>
                )}
              </div>
            </div>

            <div className="lx-field">
              <label className="lx-label" htmlFor="preferredLanguage">
                Preferred language
              </label>
              <div className="lx-input-wrap">
                <select
                  id="preferredLanguage"
                  className="lx-input"
                  value={form.preferredLanguage}
                  onChange={(e) => updateField("preferredLanguage", e.target.value)}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="lx-field">
              <label className="lx-label" htmlFor="password">
                Password
              </label>
              <div className={fieldWrapClass("password")}>
                <input
                  id="password"
                  className="lx-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                />
                <button
                  type="button"
                  className="lx-toggle-visibility"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
              <p className="lx-hint">At least 8 characters.</p>
              {errors.password && (
                <p className="lx-error" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="lx-field">
              <label className="lx-label" htmlFor="confirmPassword">
                Confirm password
              </label>
              <div className={fieldWrapClass("confirmPassword")}>
                <input
                  id="confirmPassword"
                  className="lx-input"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                />
                <button
                  type="button"
                  className="lx-toggle-visibility"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  aria-pressed={showConfirmPassword}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  <EyeIcon visible={showConfirmPassword} />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="lx-error" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="lx-form-row">
              <label className="lx-checkbox">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className="lx-checkbox__box" aria-hidden="true" />
                <span>
                  I agree to the <a href="#terms" className="lx-link">Terms</a> and{" "}
                  <a href="#privacy" className="lx-link">Privacy Policy</a>
                </span>
              </label>
            </div>
            {errors.terms && (
              <p className="lx-error" role="alert">
                {errors.terms}
              </p>
            )}

            <button type="submit" className="lx-submit" disabled={submitting}>
              {submitting ? (
                <span className="lx-submit__loading">
                  <span className="lx-loading-dot" />
                  <span className="lx-loading-dot" />
                  <span className="lx-loading-dot" />
                </span>
              ) : (
                <span>Create account</span>
              )}
            </button>
          </form>

          <p className="lx-signup-cta">
            Already have an account? <a href="#login" className="lx-link">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
