"use client";

import { API_URL } from "@/lib/utils";
import { useAlert } from "@/providers/alert-provider";
import { useAuthContext } from "@/providers/auth-context";
import { apiPost } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productKeys } from "../utils";
import { Product } from "../schema";
import { ProductSchema } from "../schema";

export function useShareAction(productId: string) {
  const baseUrl = `${API_URL}/api/v1/products/${productId}/share`;
  const { token, isAuthenticated } = useAuthContext();
  const alert = useAlert();
  const queryClient = useQueryClient();

  const shareProduct = async ({}: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<Product>(baseUrl, ProductSchema, {}, token ?? undefined);
  };

  const shareProductMutation = useMutation({
    mutationFn: shareProduct,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
    },
    onError: (error, variables) => {
      console.error("Share error:", error);
      const { onError } = variables;
      onError?.();
      alert?.error("Failed to record share");
    },
  });

  return {
    shareProduct: shareProductMutation.mutate,
    isSharing: shareProductMutation.isPending,
    isAuthenticated,
  };
}
