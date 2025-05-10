import { apiPost } from "@/services/api";
import {
  SellerApplication,
  SellerApplicationSave,
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
import * as humps from "humps";
import { AxiosError } from "axios";
export function useSellerApplicationMutation() {
  const baseUrl = `${API_URL}/api/v1/sellers/apply`;
  const { token } = useAuthContext();
  const queryClient = useQueryClient();
  const alert = useAlert();

  const saveSellerApplication = async ({
    data,
  }: {
    data: SellerApplicationSave;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<SellerApplication>(
      baseUrl,
      SellerApplicationSchema,
      humps.decamelizeKeys(data),
      token ?? undefined
    );
  };

  const mutation = useMutation({
    mutationFn: saveSellerApplication,
    onSuccess: (_, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: sellerApplicationQueryKey.all,
      });
      queryClient.invalidateQueries({
        queryKey: adminSellerApplicationQueryKey.lists(),
      });
      alert?.success("Application saved successfully");
    },
    onError: (error, variables) => {
      console.log(error, variables);
      const { onError } = variables;
      onError?.();
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as { detail?: string })
          ?.detail;
        alert?.error(errorMessage ?? "Failed to save application");
      } else {
        alert?.error("Failed to save application");
      }
    },
  });

  return {
    submitApplication: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
