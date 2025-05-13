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
  UserSignUp,
  UserSignUpSchema,
} from "../shema";
import { useAuthContext } from "../../providers/auth-context";
import { useAlert } from "@/providers/alert-provider";
import { API_URL } from "@/lib/utils";

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
      userLogin
    );
  };

  const loginWithTelegram =  async (
    {
      telegramLogin
    } : {
      telegramLogin: TelegramLogin;
      onSuccess?: () => void;
      onError?: () => void;
    }
  ) => {

    return apiPost<AuthResponse>(
      `${baseUrl}/telegram`,
      AuthResponseSchema,
      telegramLogin
    );

  }

  const signUp = async ({
    userRegister,
  }: {
    userRegister: UserRegister;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<UserSignUp>(`${baseUrl}/register`, UserSignUpSchema, userRegister);
  };

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      alert?.success("logged in successfully!");
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
      onSuccess?.();
      setCredential(data.data.user, data.data.token);
      alert?.success("logged in Successfully!");
    },
    onError: (_error, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error("Error occurred when trying to login");
    },
  });

  const telegramLoginMutation = useMutation({
    mutationFn: loginWithTelegram,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      setCredential(data.data.user, data.data.token);
      alert?.success("logged in Successfully!");
    },
    onError: (_error, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error("Error occurred when trying to login");
    },
  });

  return {
    login: loginMutation,
    signUp: signUpMutation,
    signUpLoading: signUpMutation.isPending,
    loginLoading: loginMutation.isPending,
    telegramLogin: telegramLoginMutation,
    telegramLoginLoading: telegramLoginMutation.isPending,
  };
}
