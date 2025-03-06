"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  UserSchema,
  User,
  AuthResponseSchema,
  UserLogin,
} from "../auth/shema";
import { apiGet, apiPost } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: UserLogin) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const result = await apiGet("/api/users/me", UserSchema, token);
      setUser(result.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (userLogin: UserLogin) => {
    const result = await apiPost(
      "/api/auth/login",
      AuthResponseSchema,
      userLogin
    );

    setUser(result.data.user);
    setToken(result.data.token);

    document.cookie = `token=${result.data.token}; path=/; max-age=86400; Secure; SameSite=Strict`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    document.cookie = "token=; path=/; max-age=0;";
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
