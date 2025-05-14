"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserSchema } from "../auth/shema";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import LoadingIcon from "@/components/state/loading";
import { apiGet } from "@/services/api";
import { API_URL } from "@/lib/utils";
import { AxiosError } from "axios";

const PUBLIC_PATH = ["/login", "/signup", "/", "/404"];

interface AuthContextType {
  user: User | null;
  token: string | null;
  setCredential: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AuthLoading = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center gap-4">
      <LoadingIcon className="w-4 h-4" /> Loading...
    </div>
  );
};
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pathName = usePathname();
  const router = useRouter();
  const query = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchUser() {
      try {
        setLoading(true);
        if (token) {
          const response = await apiGet<User>(
            `${API_URL}/api/v1/users/me`,
            UserSchema,
            token
          );

          setCredential(response.data, token);
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      if (!PUBLIC_PATH.includes(pathName)) {
        setLoading(true);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        query.clear();
        setLoading(false);
      }
    }
    if (!loading && user) {
      if (["/login", "/signup"].includes(pathName)) {
        router.push("/");
      }
    }
  }, [loading, user, pathName, router, query]);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const setCredential = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const value: AuthContextType = {
    user,
    token,
    logout,
    isAuthenticated: !!user,
    loading,
    setUser,
    setCredential,
  };

  if (loading) return <AuthLoading />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
