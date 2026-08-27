/**
 * PasswordInput.jsx
 * ------------------------------------------------------------------
 * Controlled password field with a show/hide toggle. Pure presentation
 * component — no auth logic — so it can be reused anywhere a masked
 * field is needed (login, signup, change-password, etc.).
 * Styled entirely with the lx-* classes defined in LoginPage.css.
 * ------------------------------------------------------------------
 */
import { useId, useState } from "react";

export default function PasswordInput({
  label = "Password",
  name = "password",
  value,
  onChange,
  error,
  placeholder = "Enter your password",
  autoComplete = "current-password",
  required = true,
}) {
  const [visible, setVisible] = useState(false);
  const inputId = useId();
  const errorId = `${inputId}-error`;

  return (
    <div className="lx-field">
      <label className="lx-label" htmlFor={inputId}>
        {label}
      </label>
      <div className={`lx-input-wrap${error ? " lx-input-wrap--error" : ""}`}>
        <input
          id={inputId}
          name={name}
          type={visible ? "text" : "password"}
          className="lx-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        <button
          type="button"
          className="lx-toggle-visibility"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.6 21.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p className="lx-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
