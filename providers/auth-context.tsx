"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../auth/shema";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import LoadingIcon from "@/components/state/loading";

const PUBLIC_PATH = ["/login", "/signup", "/"];

interface AuthContextType {
  user: User | null;
  token: string | null;
  setCredential: (user: User, token: string) => void;
  logout: () => void;
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

  console.log("pathname", pathName);

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
