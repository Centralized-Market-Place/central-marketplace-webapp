import { useMutation } from "@tanstack/react-query";
import { apiPost } from "../../services/api";
import {
  AuthResponse,
  AuthResponseSchema,
  TelegramLogin,
  User,
  UserLogin,
  UserRegister,
  UserSchema,
} from "../shema";
import { useAuthContext } from "../../providers/auth-context";
import { useAlert } from "@/providers/alert-provider";
import { API_URL } from "@/lib/utils";
import { AxiosError } from "axios";
import humps from "humps";

export function useAuth() {
  const baseUrl = `${API_URL}/api/v1/users`;
  const { setCredential } = useAuthContext();
  const alert = useAlert();

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
      humps.decamelizeKeys(userLogin)
    );
  };

  const loginWithTelegram = async ({
    telegramLogin,
  }: {
    telegramLogin: TelegramLogin;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<AuthResponse>(
      `${baseUrl}/telegram`,
      AuthResponseSchema,
      humps.decamelizeKeys(telegramLogin)
    );
  };

  const signUp = async ({
    userRegister,
  }: {
    userRegister: UserRegister;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<User>(`${baseUrl}/register`, UserSchema, humps.decamelizeKeys(userRegister));
  };

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      alert?.success("Signed up successfully!");
    },
    onError: (_error, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error("Error occurred when trying to sign up");
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      console.log("data", data);
      setCredential(data.data.user, data.data.token );
      onSuccess?.();
      alert?.success("Logged in successfully!");
    },
    onError: (_error, variables) => {
      const { onError } = variables;
      console.log("error", _error);
      onError?.();
      alert?.error("Error occurred when trying to login");
    },
  });

  const telegramLoginMutation = useMutation({
    mutationFn: loginWithTelegram,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      setCredential(data.data.user, data.data.token );
      onSuccess?.();
      alert?.success("Logged in successfully!");
    },
    onError: (_error, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error("Error occurred when trying to login");
    },
  });

  function getErrorMsg(error: Error | null) {
    if (!error) return null;
    if (error instanceof AxiosError) {
      const err = error.response?.data as { detail?: string };
      return err?.detail;
    }
    return null;
  }

  return {
    login: loginMutation.mutate,
    signUp: signUpMutation.mutate,
    signUpLoading: signUpMutation.isPending,
    loginLoading: loginMutation.isPending,
    telegramLogin: telegramLoginMutation.mutate,
    telegramLoginLoading: telegramLoginMutation.isPending,
    loginErrMsg: getErrorMsg(loginMutation.error),
    signUpErrMsg: getErrorMsg(signUpMutation.error),
    telegramLoginErrMsg: getErrorMsg(telegramLoginMutation.error),
  };
}
