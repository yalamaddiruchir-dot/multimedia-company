import axios from "axios";
import { DEMO_TOKEN } from "../context/AuthContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

const isDemoMode = () => localStorage.getItem("token") === DEMO_TOKEN;

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

// Response interceptor - handles 401 errors (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Never force a demo session back to /login - there's no real token to expire.
    if (isDemoMode()) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
