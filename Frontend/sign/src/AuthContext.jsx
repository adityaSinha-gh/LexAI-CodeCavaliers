import React, { createContext, useContext, useMemo, useState } from "react";

/**
 * Minimal in-memory auth store.
 *
 * If your project already has an auth context/store, DO NOT use this file —
 * wire SignupPage into your existing store instead. This is only here so
 * the demo is runnable standalone.
 *
 * accessToken lives in memory only (React state). It is never written to
 * localStorage or sessionStorage. The refreshToken is an httpOnly cookie
 * the backend sets/reads — the frontend never touches it directly.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const value = useMemo(
    () => ({
      accessToken,
      user,
      setSession: ({ accessToken: token, user: nextUser }) => {
        setAccessToken(token ?? null);
        setUser(nextUser ?? null);
      },
      clearSession: () => {
        setAccessToken(null);
        setUser(null);
      },
    }),
    [accessToken, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
