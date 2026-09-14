import { createContext, useContext, useEffect, useState } from "react";
import { api, getStoredAuth, setStoredAuth } from "../api/apiClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on first load
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.token && stored?.user) {
      setToken(stored.token);
      setUser(stored.user);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setToken(data.token);
    setUser(data.user);
    setStoredAuth({ token: data.token, user: data.user });
    return data.user;
  };

  const signup = async (name, email, password) => {
    const data = await api.signup(name, email, password);
    setToken(data.token);
    setUser(data.user);
    setStoredAuth({ token: data.token, user: data.user });
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setStoredAuth(null);
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
