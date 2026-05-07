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

// ✅ SINGLE helper (reuse everywhere)
const parseToken = (token: string | null) => {
  if (!token) return { role: null };
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      role: payload.role || null,
    };
  } catch {
    return { role: null };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const getStoredToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const [token, setToken] = useState<string | null>(getStoredToken);

  const [role, setRole] = useState<string | null>(() => {
    const t = getStoredToken();
    return parseToken(t).role;
  });

  useEffect(() => {
    const { role } = parseToken(token);
    setRole(role);
  }, [token]);

  const login = (newToken: string, remember = false) => {
    if (remember) {
      localStorage.setItem("token", newToken);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", newToken);
      localStorage.removeItem("token");
    }

    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);