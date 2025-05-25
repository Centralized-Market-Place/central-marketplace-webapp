import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/services/api";
import { API_URL } from "@/lib/utils";
import {
  EmailVerificationResponse,
  EmailVerificationResponseSchema,
  ResendVerificationRequest,
  VerifyEmailRequest,
} from "@/auth/shema";

export function useEmailVerification() {
  const baseUrl = `${API_URL}/api/v1/users`;
  

  const verifyEmail = async ({
    data,
  }: {
    data: VerifyEmailRequest;
    onSuccess?: (data: EmailVerificationResponse) => void;
    onError?: (error: Error) => void;
  }) => {
    return apiPost<EmailVerificationResponse>(
      `${baseUrl}/verify-email`,
      EmailVerificationResponseSchema,
      data
    );
  };

  const resendVerification = async ({
    data,
  }: {
    data: ResendVerificationRequest;
    onSuccess?: (data: EmailVerificationResponse) => void;
    onError?: (error: Error) => void;
  }) => {
    return apiPost<EmailVerificationResponse>(
      `${baseUrl}/resend-verification`,
      EmailVerificationResponseSchema,
      data
    );
  };

  const verifyEmailMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.(data.data);
    },
    onError: (error, variables) => {
      const { onError } = variables;
      onError?.(error);
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: resendVerification,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.(data.data);
    },
    onError: (error, variables) => {
      const { onError } = variables;
      onError?.(error);
    },
  });

  return {
    verifyEmail: verifyEmailMutation.mutate,
    resendVerification: resendVerificationMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isPending,
    isResendingVerification: resendVerificationMutation.isPending,
    verifyEmailError: verifyEmailMutation.error,
    resendVerificationError: resendVerificationMutation.error,
  };
}
