/**
 * axiosClient.js
 * ------------------------------------------------------------------
 * NOTE FOR INTEGRATION:
 * No existing repository was provided to inspect, so this file is
 * written as the canonical "single Axios client + interceptor" the
 * spec asks for. If your real project already has a file like this
 * (e.g. src/api/client.js, src/lib/axios.js, src/services/api.js),
 * DO NOT add this file — instead import your existing instance into
 * LoginPage.jsx and AuthContext.jsx and delete this one.
 * ------------------------------------------------------------------
 */
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // send/receive the httpOnly refreshToken cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- in-memory access token store (never localStorage/sessionStorage) ----
let accessToken = null;
let onAuthLost = () => {}; // set by AuthProvider so the interceptor can clear app state

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function registerAuthLostHandler(handler) {
  onAuthLost = handler;
}

// Attach the bearer token to every request
axiosClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Single-flight refresh so concurrent 401s don't trigger multiple refreshes
let refreshPromise = null;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isAuthEndpoint =
      originalRequest?.url?.includes("/api/auth/login") ||
      originalRequest?.url?.includes("/api/auth/refresh-token");

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axiosClient
            .post("/api/auth/refresh-token")
            .finally(() => {
              refreshPromise = null;
            });
        }
        const { data } = await refreshPromise;
        setAccessToken(data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        onAuthLost();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
