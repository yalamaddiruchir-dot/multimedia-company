import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  color: string;
  initials: string;
  status: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  login: (user: User, token: string, refreshToken: string) => void;
  loginDemo: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A fake token value that marks the session as demo-mode. src/api/api.ts
// checks for this and short-circuits real network calls so pages fall
// back to mock data instantly instead of waiting on/failing a real request.
export const DEMO_TOKEN = "demo-mode-token";

export const DEMO_USER: User = {
  id: "demo-user",
  name: "Aarav Kapoor",
  email: "aarav@reelline.io",
  role: "OWNER",
  color: "#2563EB",
  initials: "AK",
  status: "online",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setIsDemo(token === DEMO_TOKEN);
    }
  }, []);

  const login = (user: User, token: string, refreshToken: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
    setIsDemo(false);
  };

  // Instant, offline "demo mode" — no backend required. Stores a marker
  // token so the API layer knows to skip real network calls and let
  // pages use their built-in mock-data fallback.
  const loginDemo = () => {
    localStorage.setItem("token", DEMO_TOKEN);
    localStorage.setItem("refreshToken", DEMO_TOKEN);
    localStorage.setItem("user", JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
    setIsAuthenticated(true);
    setIsDemo(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setIsDemo(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isDemo, login, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
