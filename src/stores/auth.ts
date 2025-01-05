import { create } from "zustand";
import { login as loginApi, register as registerApi } from "@/api/auth";
import { Login, Register } from "@/domain/auth";

interface User {
    id: string;
    name: string;
    username: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: Login) => Promise<void>;
  register: (userData: Register) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  isAuthenticated:
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
  loading: false,

  login: async (credentials: Login) => {
    try {
      set({ loading: true });
      const response = await loginApi(credentials);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
      });

      window.location.href = "/home";
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  register: async (userData: Register) => {
    try {
      set({ loading: true });
      const response = await registerApi(userData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
      });

      window.location.href = "/home";
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
    window.location.href = "/login";
  },

  checkAuth: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },
}));
