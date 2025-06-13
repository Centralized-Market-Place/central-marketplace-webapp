import { useAuthContext } from "@/providers/auth-context";
import { useAlert } from "@/providers/alert-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Channel, ChannelSchema, ChannelUpdate } from "../schema";
import { apiPost } from "@/services/api";
import { API_URL } from "@/lib/utils";
import { sellerChannelKeys } from "../utils";
import humps from "humps";

export function useChannelAction() {
  const baseUrl = `${API_URL}/api/v1/channels`;

  const { token } = useAuthContext();
  const alert = useAlert();
  const queryClient = useQueryClient();

  const updateChannel = async ({
    channelId,
    channelUpdate,
  }: {
    channelId: string;
    channelUpdate: ChannelUpdate;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return await apiPost<Channel>(
      `${baseUrl}/${channelId}`,
      ChannelSchema,
      humps.decamelizeKeys(channelUpdate),
      token ?? undefined
    );
  };

  const updateChannelQuery = useMutation({
    mutationFn: updateChannel,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: sellerChannelKeys.lists(),
      });

      alert?.success("Channel updated successfully");
    },
    onError: (error, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error("Failed to update channel");
    },
  });

  return {
    updateChannel: updateChannelQuery.mutate,
    isUpdating: updateChannelQuery.isPending,
    isUpdatingError: updateChannelQuery.error,
  };
}
