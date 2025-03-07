import { useMutation } from "@tanstack/react-query";
import { apiPost } from "../../services/api";
import {
  AuthResponse,
  AuthResponseSchema,
  UserLogin,
  UserRegister,
} from "../shema";
import { useAuthContext } from "../../providers/auth-context";

export function useAuth() {
  const baseUrl = `/api/v1/users`;
  const { setUser, setToken } = useAuthContext();
  const login = async ({
    userLogin,
  }: {
    userLogin: UserLogin;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<AuthResponse>(
      `${baseUrl}/login`,
      AuthResponseSchema,
      userLogin
    );
  };

  const signUp = async ({
    userRegister,
  }: {
    userRegister: UserRegister;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<AuthResponse>(
      `${baseUrl}/register`,
      AuthResponseSchema,
      userRegister
    );
  };

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      setUser(data.data.user);
      setToken(data.data.token);
      onSuccess?.();
    },
    onError: (_error, variables) => {
      console.log("error", _error);
      const { onError } = variables;
      onError?.();
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      setUser(data.data.user);
      setToken(data.data.token);
    },
    onError: (_error, variables) => {
      console.log("error", _error);
      const { onError } = variables;
      onError?.();
    },
  });

  return {
    login: loginMutation.mutate,
    signUp: signUpMutation.mutate,
    signUpLoading: signUpMutation.isPending,
    loginLoading: loginMutation.isPending,
  };
}
