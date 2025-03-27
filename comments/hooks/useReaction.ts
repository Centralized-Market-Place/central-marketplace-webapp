import { useAlert } from "@/providers/alert-provider";
import { Reaction, ReactionSave, ReactionSchema } from "../schema";
import { apiGet, apiPost } from "@/services/api";
import { useAuthContext } from "@/providers/auth-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import humps from "humps";
import { API_URL } from "@/lib/utils";
import { commentKeys, reactionKeys } from "../utils";
import { productKeys } from "@/products/utils";

export function useReaction(targetId: string) {
  const baseUrl = `${API_URL}/api/v1/reactions/`;
  const alert = useAlert();
  const queryClient = useQueryClient();
  const { token } = useAuthContext();
  const createReaction = ({
    reactionSave,
  }: {
    reactionSave: ReactionSave;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<Reaction>(
      baseUrl,
      ReactionSchema,
      humps.decamelizeKeys(reactionSave),
      token ? token : undefined
    );
  };

  const getReaction = () => {
    return apiGet<Reaction | null>(
      `${baseUrl}${targetId}`,
      ReactionSchema,
      token ?? undefined
    );
  };

  const createReactionMutation = useMutation({
    mutationFn: createReaction,
    onSuccess: (data, varaibles) => {
      const { onSuccess } = varaibles;
      alert?.success("Reaction created successfully");
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: reactionKeys.detail(targetId),
      });
      if (data.data.targetType === "product") {
        queryClient.invalidateQueries({
          queryKey: productKeys.detail(targetId),
        });
      }
      if (data.data.targetType === "comment") {
        queryClient.invalidateQueries({
          queryKey: commentKeys.detail(targetId),
        });
      }
    },
    onError: (error, variables) => {
      const { onError } = variables;
      alert?.error(error.message);
      onError?.();
    },
  });

  const reactionQuery = useQuery({
    queryKey: reactionKeys.detail(targetId),
    queryFn: getReaction,
    enabled: !!token,
  });

  return {
    createReaction: createReactionMutation.mutate,
    isLoading: createReactionMutation.isPending,
    isError: createReactionMutation.isError,
    error: createReactionMutation.error,
    reaction: reactionQuery.data?.data,
    isReactionLoading: reactionQuery.isLoading,
    isReactionError: reactionQuery.isError,
    reactionError: reactionQuery.error,
  };
}
