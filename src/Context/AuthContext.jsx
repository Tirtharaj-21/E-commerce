import { createContext, useContext, useEffect, useState } from "react";
import { api, getStoredAuth, setStoredAuth } from "../api/apiClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the saved session when the application starts.
  useEffect(() => {
    try {
      const stored = getStoredAuth();

      if (stored?.token && stored?.user) {
        setToken(stored.token);
        setUser(stored.user);
      }
    } catch (error) {
      console.error("Unable to restore authentication session:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login through the backend API.
  const login = async (email, password) => {
    const data = await api.login(email, password);

    if (!data?.token || !data?.user) {
      throw new Error("Invalid login response from the server.");
    }

    setStoredAuth({
      token: data.token,
      user: data.user,
    });

    setToken(data.token);
    setUser(data.user);

    return data.user;
  };

  // Register through the backend API.
  const signup = async (name, email, password) => {
    const data = await api.signup(name, email, password);

    if (!data?.token || !data?.user) {
      throw new Error("Signup did not return an authenticated user and token.");
    }

    setStoredAuth({
      token: data.token,
      user: data.user,
    });

    setToken(data.token);
    setUser(data.user);

    return data.user;
  };

  // Clear the local session.
  const logout = () => {
    setStoredAuth(null);
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);

  const value = {
    user,
    token,
    role: user?.role || null,

    isAuthenticated,
    isLoggedIn: isAuthenticated,

    loading,
    isLoading: loading,

    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
