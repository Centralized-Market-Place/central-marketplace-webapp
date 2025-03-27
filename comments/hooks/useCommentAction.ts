import { useAlert } from "@/providers/alert-provider";
import { apiDelete, apiPost } from "@/services/api";
import { Comment, CommentSave, CommentSchema } from "../schema";
import { useAuthContext } from "@/providers/auth-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentKeys } from "../utils";
import { API_URL } from "@/lib/utils";

export function useCommentAction(productId: string) {
  const baseUrl = `${API_URL}/api/v1/posts/${productId}/comments`;
  const alert = useAlert();
  const queryClient = useQueryClient();
  const { token } = useAuthContext();

  const createComment = async ({
    commentSave,
  }: {
    commentSave: CommentSave;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<Comment>(
      baseUrl,
      CommentSchema,
      commentSave,
      token ?? undefined
    );
  };

  const updateComment = async ({
    commentSave,
    commentId,
  }: {
    commentSave: CommentSave;
    commentId: string;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<Comment>(
      `${baseUrl}/${commentId}`,
      CommentSchema,
      commentSave,
      token ?? undefined
    );
  };

  const deleteComment = async ({
    commentId,
  }: {
    commentId: string;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiDelete(`${baseUrl}/${commentId}`, token ?? undefined);
  };

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      alert?.success("Comment created successfully");
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(productId),
      });
    },
    onError: (data, variables) => {
      const { onError } = variables;
      alert?.error("Error creating comment");
      onError?.();
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      alert?.success("Comment updated successfully");
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(productId),
      });
    },
    onError: (data, variables) => {
      const { onError } = variables;
      alert?.error("Error updating comment");
      onError?.();
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      alert?.success("comment deleted successfully");
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(productId),
      });
    },
    onError: (data, variables) => {
      const { onSuccess } = variables;
      alert?.error("Error deleting comment");
      onSuccess?.();
    },
  });

  return {
    createComment: createCommentMutation.mutate,
    isCreatingComment: createCommentMutation.isPending,
    creatingCommentError: createCommentMutation.error,
    updateComment: updateCommentMutation.mutate,
    isUpdatingComment: updateCommentMutation.isPending,
    updateCommentError: updateCommentMutation.error,
    deleteComment: deleteCommentMutation.mutate,
    isDeletingComment: deleteCommentMutation.isPending,
    deleteCommentError: deleteCommentMutation.error,
  };
}
