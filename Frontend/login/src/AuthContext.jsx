/**
 * AuthContext.jsx
 * ------------------------------------------------------------------
 * NOTE FOR INTEGRATION: If your real project already has an auth
 * context/store (Redux, Zustand, etc.), reuse that instead of this
 * file — wire LoginPage.jsx's `login()` and `isCheckingSession` calls
 * to your existing store's equivalents. This is provided only
 * because no existing repository was available to inspect.
 * ------------------------------------------------------------------
 */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosClient, {
  setAccessToken,
  getAccessToken,
  registerAuthLostHandler,
} from "./axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  // Let the axios interceptor clear app state when a refresh ultimately fails
  useEffect(() => {
    registerAuthLostHandler(clearAuth);
  }, [clearAuth]);

  const login = useCallback((data) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
    } catch {
      // ignore - clear local state regardless
    }
    clearAuth();
  }, [clearAuth]);

  // Session restoration on first load — runs exactly once (StrictMode-safe)
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const { data } = await axiosClient.post("/api/auth/refresh-token");
        if (cancelled) return;
        setAccessToken(data.accessToken);
        // Backend refresh-token response only returns { success, accessToken }.
        // If your app needs the user profile too, call your existing
        // "get current user" endpoint here using the new token.
      } catch {
        if (cancelled) return;
        clearAuth();
      } finally {
        if (!cancelled) setIsCheckingSession(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAuthenticated = Boolean(user || getAccessToken());

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isCheckingSession, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
