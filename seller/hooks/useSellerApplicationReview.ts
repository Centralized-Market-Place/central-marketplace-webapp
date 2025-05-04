import { apiPost } from "@/services/api";
import {
  SellerApplication,
  SellerApplicationReview,
  SellerApplicationSchema,
} from "../schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminSellerApplicationQueryKey,
  sellerApplicationQueryKey,
} from "../utils";
import { API_URL } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-context";
import { useAlert } from "@/providers/alert-provider";

export function useSellerApplicationReview() {
  const baseUrl = `${API_URL}/api/v1/sellers/applications`;
  const { token, user } = useAuthContext();
  const queryClient = useQueryClient();
  const alert = useAlert();

  const reviewSellerApplication = async ({
    data,
  }: {
    data: SellerApplicationReview;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    if (!token || user?.role !== "ADMIN") return;
    const reviewUrl = `${baseUrl}/${data.applicationId}/review`;
    return apiPost<SellerApplication>(
      reviewUrl,
      SellerApplicationSchema,
      data,
      token ?? undefined
    );
  };

  const mutation = useMutation({
    mutationFn: reviewSellerApplication,
    onSuccess: (_, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      alert?.success("Application reviewed successfully");
      queryClient.invalidateQueries({
        queryKey: adminSellerApplicationQueryKey.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sellerApplicationQueryKey.detail(
          variables.data.applicationId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: sellerApplicationQueryKey.all,
      });
    },
    onError: (_, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error("Failed to review application");
    },
  });

  return {
    reviewApplication: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
