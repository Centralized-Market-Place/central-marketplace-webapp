import { API_URL } from "@/lib/utils";
import { Product, ProductSchema, ProductUpdate } from "../schema";
import { useAuthContext } from "@/providers/auth-context";
import { apiDelete, apiPost } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/providers/alert-provider";
import { productKeys } from "../utils";

export function useProductAction() {
  const baseUrl = `${API_URL}/api/v1/products`;
  const queryClient = useQueryClient();

  const { token } = useAuthContext();
  const alert = useAlert();

  const updateProduct = async ({
    productId,
    productUpdate,
  }: {
    productId: string;
    productUpdate: ProductUpdate;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return await apiPost<Product>(
      `${baseUrl}/${productId}`,
      ProductSchema,
      productUpdate,
      token ?? undefined
    );
  };

  const deleteProduct = async ({
    productId,
  }: {
    productId: string;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return await apiDelete(`${baseUrl}/${productId}`, token ?? undefined);
  };
  const updateProductQuery = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(data.data?.id),
      });
      alert?.success("Product updated successfully");
    },
    onError: (error, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error("Failed to update product");
    },
  });

  const deleteProductQuery = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
      alert?.success("Product deleted successfully");
    },
    onError: (error, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error("Failed to delete product");
    },
  });

  return {
    updateProduct: updateProductQuery.mutate,
    deleteProduct: deleteProductQuery.mutate,
    isUpdating: updateProductQuery.isPending,
    isUpdatingError: updateProductQuery.error,
    isDeleting: deleteProductQuery.isPending,
    isDeletingError: deleteProductQuery.error,
  };
}
