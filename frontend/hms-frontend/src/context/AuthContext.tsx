import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  });
  const [role, setRole] = useState<string | null>(() => {
    const t = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!t) return null;
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role || null);
      } catch {
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, [token]);

  const login = (newToken: string, remember = false) => {
    if (remember) localStorage.setItem("token", newToken);
    else sessionStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    setRole(null);
  };

  return <AuthContext.Provider value={{ token, role, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
