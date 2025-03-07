"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../auth/shema";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const PUBLIC_PATH = ["/login", "/signup"];

interface AuthContextType {
  user: User | null;
  token: string | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pathName = usePathname();
  const router = useRouter();
  const query = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setUser(JSON.parse(user));
      setToken(token);
    } else {
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading || !user) {
      if (!PUBLIC_PATH.includes(pathName)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        query.clear();
      }
    }
  }, [loading, user, pathName, router, query]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    setUser,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
