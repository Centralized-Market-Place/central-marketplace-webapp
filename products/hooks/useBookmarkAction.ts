import { API_URL } from "@/lib/utils";
import { useAlert } from "@/providers/alert-provider";
import { useAuthContext } from "@/providers/auth-context";
import { apiDelete, apiPost } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookmarkSchema } from "../schema";
import { bookmarkKeys, productKeys } from "../utils";

export function useBookmarkAction(productId: string) {
  const baseUrl = `${API_URL}/api/v1/bookmarks/${productId}`;
  const { token } = useAuthContext();
  const alert = useAlert();
  const queryClient = useQueryClient();

  const addBookmark = async ({}: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<Bookmark>(baseUrl, BookmarkSchema, {}, token ?? undefined);
  };

  const removeBookmark = ({}: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiDelete(baseUrl, token ?? undefined);
  };

  const addBookmarkMutation = useMutation({
    mutationFn: addBookmark,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      alert?.success("Bookmark added successfully");
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.all,
      });
    },
    onError: (error, variables) => {
      console.error(error);
      const { onError } = variables;
      onError?.();
      alert?.error("Failed to add bookmark");
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: removeBookmark,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.all,
      });
      alert?.success("Bookmark removed successfully");
    },
    onError: (error, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error("Failed to remove bookmark");
    },
  });

  return {
    addBookmark: addBookmarkMutation.mutate,
    removeBookmark: removeBookmarkMutation.mutate,
    isAddingBookmark: addBookmarkMutation.isPending,
    isRemovingBookmark: removeBookmarkMutation.isPending,
  };
}
