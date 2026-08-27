/**
 * App.jsx
 * ------------------------------------------------------------------
 * Wraps the app in AuthProvider, waits out session restoration, then
 * shows LoginPage or a minimal authenticated placeholder. Swap the
 * authenticated branch out for your router once one exists.
 * ------------------------------------------------------------------
 */
import { AuthProvider, useAuth } from "./AuthContext";
import LoginPage from "./LoginPage";
import "./LoginPage.css";

function AppShell() {
  const { isAuthenticated, isCheckingSession, user, logout } = useAuth();

  if (isCheckingSession) {
    return (
      <div className="lx-session-check">
        <div className="lx-session-check__mark">
          Lex<span style={{ color: "var(--bs-muted-gold)" }}>AI</span>
        </div>
        <div className="lx-session-check__dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <h1>Welcome{user?.name ? `, ${user.name}` : ""}!</h1>
      <button className="lx-submit" style={{ minHeight: 40, padding: "10px 24px" }} onClick={logout}>
        Log out
      </button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
