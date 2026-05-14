import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, setAuthToken } from "../services/apiClient";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "miniflex-auth";
const roleMap = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
};

const normalizeRole = (role) => roleMap[role] || role || "";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed?.token && parsed?.user) {
        setToken(parsed.token);
        setUser({ ...parsed.user, role: normalizeRole(parsed.user.role) });
        setAuthToken(parsed.token);
      }
    } catch (error) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: { username, password },
      });

      const nextUser = {
        ...response.user,
        role: normalizeRole(response.user?.role),
      };

      setToken(response.access_token);
      setUser(nextUser);
      setAuthToken(response.access_token);
      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ token: response.access_token, user: nextUser })
      );

      return { ok: true, user: nextUser };
    } catch (error) {
      return { ok: false, message: error?.message || "Login failed." };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
