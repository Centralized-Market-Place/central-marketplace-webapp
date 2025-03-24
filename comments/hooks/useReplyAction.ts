import { useAlert } from "@/providers/alert-provider";
import { useAuthContext } from "@/providers/auth-context";
import { CommentSave, Comment, CommentSchema } from "../schema";
import { apiDelete, apiPost } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replyKeys } from "../utils";

export function useReplyAction(commentId: string) {
  const baseUrl = `/api/v1/comments/${commentId}/replies`;
  const alert = useAlert();
  const queryClient = useQueryClient();
  const { token } = useAuthContext();

  const createReply = async ({
    replySave,
  }: {
    replySave: CommentSave;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<Comment>(
      baseUrl,
      CommentSchema,
      replySave,
      token ?? undefined
    );
  };

  const updateReply = async ({
    replySave,
    replyId,
  }: {
    replySave: CommentSave;
    replyId: string;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<Comment>(
      `${baseUrl}/${replyId}`,
      CommentSchema,
      replySave,
      token ?? undefined
    );
  };

  const deleteReply = async ({
    replyId,
  }: {
    replyId: string;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiDelete(`${baseUrl}/${replyId}`, token ?? undefined);
  };

  const createReplyMutation = useMutation({
    mutationFn: createReply,
    onSuccess: (data, varaibles) => {
      const { onSuccess } = varaibles;
      alert?.success("Reply created successfully");
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: replyKeys.list(commentId),
      });
    },
    onError: (error, variables) => {
      const { onError } = variables;
      alert?.error(error.message);
      onError?.();
    },
  });

  const updateReplyMutation = useMutation({
    mutationFn: updateReply,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      alert?.success("Reply updated successfully");
      queryClient.invalidateQueries({
        queryKey: replyKeys.list(commentId),
      });
      onSuccess?.();
    },
    onError: (error, variables) => {
      const { onError } = variables;
      alert?.error(error.message);
      onError?.();
    },
  });

  const deleteReplyMutation = useMutation({
    mutationFn: deleteReply,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      alert?.success("Reply deleted successfully");
      queryClient.invalidateQueries({
        queryKey: replyKeys.list(commentId),
      });
      onSuccess?.();
    },
    onError: (error, variables) => {
      const { onError } = variables;
      alert?.error(error.message);
      onError?.();
    },
  });

  return {
    createReply: createReplyMutation.mutate,
    isCreatingReply: createReplyMutation.isPending,
    errorCreatingReply: createReplyMutation.error,
    updateReply: updateReplyMutation.mutate,
    isUpdatingReply: updateReplyMutation.isPending,
    errorUpdatingReply: updateReplyMutation.error,
    deleteReply: deleteReplyMutation.mutate,
    isDeletingReply: deleteReplyMutation.isPending,
    errorDeletingReply: deleteReplyMutation.error,
  };
}
