/**
 * Centralized API client.
 *
 * If your project already has an Axios instance / API client, REUSE THAT
 * instead of this file — this is only here so the demo is runnable
 * standalone with plain fetch.
 *
 * Conventions carried over from the Login page spec:
 * - Base URL comes from import.meta.env.VITE_API_URL (never hardcoded).
 * - credentials: "include" on every request, so the httpOnly refreshToken
 *   cookie is sent automatically.
 * - Protected requests send Authorization: Bearer <accessToken>.
 * - On a 401 from a protected request, refresh once, retry the original
 *   request once, then give up (no infinite retry loops).
 */

const BASE_URL = import.meta.env.VITE_API_URL || "";

async function request(path, { method = "GET", body, accessToken, skipAuth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (accessToken && !skipAuth) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include", // sends the httpOnly refreshToken cookie
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const err = new Error(data?.message || "Request failed");
    err.status = res.status;
    err.response = { data, status: res.status };
    throw err;
  }

  return data;
}

/** POST /api/auth/login — exact contract from the Login page spec. */
export function login({ email, password }) {
  return request("/api/auth/login", { method: "POST", body: { email, password }, skipAuth: true });
}

/**
 * POST /api/auth/signup — NOT part of the provided backend contract.
 * Adjust the path/body to match your real signup endpoint.
 */
export function signup(payload) {
  return request("/api/auth/signup", { method: "POST", body: payload, skipAuth: true });
}

/** POST /api/auth/refresh-token — exact contract from the Login page spec. */
export function refreshToken() {
  return request("/api/auth/refresh-token", { method: "POST", skipAuth: true });
}

/**
 * Wrapper for protected requests: attaches the bearer token, and on a 401
 * refreshes once + retries once before giving up.
 */
export async function authorizedRequest(path, options, { accessToken, onRefreshed, onAuthExpired }) {
  try {
    return await request(path, { ...options, accessToken });
  } catch (err) {
    if (err.status === 401) {
      try {
        const refreshed = await refreshToken();
        onRefreshed?.(refreshed.accessToken);
        return await request(path, { ...options, accessToken: refreshed.accessToken });
      } catch (refreshErr) {
        onAuthExpired?.();
        throw refreshErr;
      }
    }
    throw err;
  }
}
