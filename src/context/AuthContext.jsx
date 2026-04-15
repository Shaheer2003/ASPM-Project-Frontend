import { createContext, useContext, useMemo, useState } from "react";
import { useAppData } from "./AppDataContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { authenticate } = useAppData();
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const result = authenticate(username, password);
    if (!result.ok) {
      return result;
    }

    setUser(result.user);
    return { ok: true, user: result.user };
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, authenticate]
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
