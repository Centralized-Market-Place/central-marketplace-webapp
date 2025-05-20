import { useMutation } from "@tanstack/react-query";
import { apiPost, ApiResult } from "@/services/api";
import { API_URL } from "@/lib/utils";
import { EmailVerificationResponse, EmailVerificationResponseSchema, ResendVerificationRequest, VerifyEmailRequest } from "@/auth/shema";
import { toast } from "sonner";
const baseUrl = `${API_URL}/api/v1/users`;

const verifyEmail = async (data: VerifyEmailRequest) => {
  return apiPost<EmailVerificationResponse>(
    `${baseUrl}/verify-email`,
    EmailVerificationResponseSchema,
    data
  );
};

const resendVerification = async (data: ResendVerificationRequest) => {
  return apiPost<EmailVerificationResponse>(
    `${baseUrl}/resend-verification`,
    EmailVerificationResponseSchema,
    data
  );
};

export function useEmailVerification() {
  const verifyEmailMutation = useMutation<ApiResult<EmailVerificationResponse>, Error, VerifyEmailRequest>({
    mutationFn: async (request) => {
      const result = await verifyEmail(request);
      if (result.status === 200) {
        return result;
      } else {
        throw new Error(result.data.message);
      }
    },
  });

  const resendVerificationMutation = useMutation<ApiResult<EmailVerificationResponse>, Error, ResendVerificationRequest>({
    mutationFn: async (request) => {
      const result = await resendVerification(request);
      if (result.status === 200) {
        return result;
      } else {
        throw new Error(result.data.message);
      }
    },
  });

  return {
    verifyEmailMutation,
    resendVerificationMutation,
  };
} 