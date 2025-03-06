import { useMutation } from "@tanstack/react-query";
import { apiPost } from "../../services/api";
import { User, UserLogin, UserRegister, UserSchema } from "../shema";

export function useAuth() {
  const baseUrl = `/api/v1/users`;
  const login = async ({
    userLogin,
  }: {
    userLogin: UserLogin;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<User>(`${baseUrl}/login`, UserSchema, userLogin);
  };

  const signUp = async ({
    userRegister,
  }: {
    userRegister: UserRegister;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<User>(`${baseUrl}/register`, UserSchema, userRegister);
  };

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: (data, variables) => {
        const { onSuccess } = variables;
        onSuccess?.();
    },
    onError: (error, variables) => {
        const { onError } = variables;
        onError?.();
    }
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data, variables) => {
        const { onSuccess } = variables;
        onSuccess?.();
    },
    onError: (error, variables) => {
        const { onError } = variables;
        onError?.();
    }
  });

    return {
        login: loginMutation.mutate,
        signUp: signUpMutation.mutate,
        signUpLoading: signUpMutation.isPending,
        loginLoading: loginMutation.isPending,
    };
}
