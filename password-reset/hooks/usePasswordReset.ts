import {
  PasswordResetResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  PasswordResetResponseSchema,
} from "@/password-reset/schema";
import { apiPost } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/lib/utils";
import { decamelizeKeys } from "humps";
import { useAlert } from "@/providers/alert-provider";

const baseUrl = `${API_URL}/api/v1/password-reset`;

interface RequestParams {
  payload: PasswordResetRequest;
  onSuccess?: () => void;
  onError?: () => void;
}

interface ConfirmParams {
  payload: PasswordResetConfirm;
  onSuccess?: () => void;
  onError?: () => void;
}

const requestPasswordReset = async ({ payload }: RequestParams) => {
  return apiPost<PasswordResetResponse>(
    `${baseUrl}/request`,
    PasswordResetResponseSchema,
    decamelizeKeys(payload)
  );
};

const confirmPasswordReset = async ({ payload }: ConfirmParams) => {
  return apiPost<PasswordResetResponse>(
    `${baseUrl}/confirm`,
    PasswordResetResponseSchema,
    decamelizeKeys(payload)
  );
};

export function usePasswordReset() {
  const alert = useAlert();

  const requestMutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      alert?.success(
        data.data.message || "Password reset email sent. Check your inbox."
      );
      onSuccess?.();
    },
    onError: (error, variables) => {
      const { onError } = variables;
      alert?.error("Failed to send reset link. Please try again.");
      onError?.();
    },
  });

  const confirmMutation = useMutation({
    mutationFn: confirmPasswordReset,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      alert?.success(data.data.message || "Password reset successful.");
      onSuccess?.();
    },
    onError: (error, variables) => {
      const { onError } = variables;
      alert?.error("Failed to reset password. Please try again.");
      onError?.();
    },
  });

  return {
    requestReset: (
      payload: PasswordResetRequest,
      options?: { onSuccess?: () => void; onError?: () => void }
    ) => {
      requestMutation.mutate({
        payload,
        ...options,
      } as RequestParams);
    },
    isRequestLoading: requestMutation.isPending,
    requestError: requestMutation.error,
    requestData: requestMutation.data,

    confirmReset: (
      payload: PasswordResetConfirm,
      options?: { onSuccess?: () => void; onError?: () => void }
    ) => {
      confirmMutation.mutate({
        payload,
        ...options,
      } as ConfirmParams);
    },
    isConfirmLoading: confirmMutation.isPending,
    confirmError: confirmMutation.error,
    confirmData: confirmMutation.data,
  };
}
