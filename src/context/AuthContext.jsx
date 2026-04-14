import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const roleToIdPrefix = {
  Admin: "ADM",
  Teacher: "TCH",
  Student: "STD",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (role, name) => {
    const safeName = name?.trim() || "Demo User";
    const idPrefix = roleToIdPrefix[role] || "USR";

    setUser({
      name: safeName,
      role,
      id: `${idPrefix}-001`,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user]
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
