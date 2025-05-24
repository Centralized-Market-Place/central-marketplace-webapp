import { API_URL } from "@/lib/utils";
import { useAlert } from "@/providers/alert-provider";
import {
  TelegramEmailAddRequest,
  TelegramPasswordSetRequest,
  User,
  UserSchema,
} from "../shema";
import { apiPost } from "@/services/api";
import { useMutation } from "@tanstack/react-query";

export function useTelegramEmailPassLoginSetup() {
  const baseUrl = `${API_URL}/api/v1/users/telegram`;
  const alert = useAlert();

  const addEmailRequest = ({
    data,
  }: {
    data: TelegramEmailAddRequest;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<User>(`${baseUrl}/add-email`, UserSchema, data);
  };

  const setPasswordRequest = ({
    data,
  }: {
    data: TelegramPasswordSetRequest;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<User>(`${baseUrl}/complete-setup`, UserSchema, data);
  };

  const addEmailMutation = useMutation({
    mutationFn: addEmailRequest,
    onSuccess: (_, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      alert?.success("Email added successfully!");
    },
    onError: (_, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error("Failed to add email!");
    },
  });

  const setPasswordMutation = useMutation({
    mutationFn: setPasswordRequest,

    onSuccess: (_, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      alert?.success("Password set successfully!");
    },
    onError: (_, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error("Failed to set password!");
    },
  });

  return {
    addEmailRequest: addEmailMutation.mutate,
    addEmailRequestLoading: addEmailMutation.isPending,
    addEmailRequestError: addEmailMutation.error,
    setPasswordRequest: setPasswordMutation.mutate,
    setPasswordRequestLoading: setPasswordMutation.isPending,
    setPasswordRequestError: setPasswordMutation.error,
  };
}
