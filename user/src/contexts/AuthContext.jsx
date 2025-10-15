import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { tokenService } from "../services/tokenService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = tokenService.getToken();
      const refreshToken = tokenService.getRefreshToken();

      if (token && refreshToken) {
        setIsAuthenticated(true);

        // Load user data from localStorage if stored
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      tokenService.clearTokens();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    const { accessToken, refreshToken, user } = userData;

    // Store tokens
    tokenService.setToken(accessToken);
    tokenService.setRefreshToken(refreshToken);

    // Store user if provided
    if (user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    }

    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // Optional: Call backend logout endpoint
      const refreshToken = tokenService.getRefreshToken();
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken }).catch(() => {
          // Ignore errors
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      tokenService.clearTokens();
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/login";
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
