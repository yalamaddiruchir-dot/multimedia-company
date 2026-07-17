import axios from "axios";
import { DEMO_TOKEN } from "../context/AuthContext";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const isDemoMode = () => localStorage.getItem("token") === DEMO_TOKEN;

const forceLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// Request interceptor - adds JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // In demo mode there is no real backend to talk to. Reject immediately
  // (instead of letting the browser wait on / fail a real request) so
  // calling pages hit their existing mock-data fallback right away.
  if (token === DEMO_TOKEN) {
    return Promise.reject(new axios.Cancel("Demo mode: skipping network call"));
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// While a refresh is in flight, queue up any other requests that failed with
// 401 instead of each firing their own concurrent refresh call.
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const flushQueue = (token: string | null) => {
  pendingQueue.forEach((resolve) => resolve(token));
  pendingQueue = [];
};

// Response interceptor - silently refreshes an expired access token once,
// then retries the original request. Only forces logout if there's no
// refresh token to use, or the refresh call itself fails (refresh token
// also expired/invalid).
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Never touch a demo session - there's no real token to expire or refresh.
    if (isDemoMode()) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response?.status;

    // 401 = SecurityConfig's authenticationEntryPoint: no/invalid/expired token.
    // 403 = a real role/permission denial (@PreAuthorize) on a valid, authenticated
    // request - refreshing the token won't fix that, so we leave it alone.
    const isExpiredToken =
      status === 401 && !originalRequest?._retry && !originalRequest?.url?.includes("/api/auth/");

    if (!isExpiredToken) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken || refreshToken === DEMO_TOKEN) {
      forceLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post(
        `${baseURL}/api/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      flushQueue(data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      flushQueue(null);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
