import { PasswordResetResponse } from "@/auth/shema";
import { PasswordResetResponseSchema } from "@/auth/shema";
import { apiPost } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/lib/utils";

const baseUrl = `${API_URL}/api/v1/password-reset`;

const requestPasswordReset = async (email: string) => {
  return apiPost<PasswordResetResponse>(
    `${baseUrl}/request`,
    PasswordResetResponseSchema,
    { email }
  );
};

const confirmPasswordReset = async (token: string, newPassword: string) => {
  return apiPost<PasswordResetResponse>(
    `${baseUrl}/confirm`,
    PasswordResetResponseSchema,
    { token, new_password: newPassword }
  );
};

export function usePasswordRest() {
  const passwordResetRequestMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      return requestPasswordReset(email);
    },
  });

  const passwordResetConfirmMutation = useMutation({
    mutationFn: async ({ token, new_password }: { token: string; new_password: string }) => {
      return confirmPasswordReset(token, new_password);
    },
  });

  return {
    passwordResetRequestMutation,
    passwordResetConfirmMutation,
  };
}