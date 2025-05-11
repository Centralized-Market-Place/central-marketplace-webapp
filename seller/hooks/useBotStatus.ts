import { apiGet } from "@/services/api";
import { BotStatus, BotStatusSchema } from "../schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { botStatusQueryKey } from "../utils";
import { API_URL } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-context";

export function useBotStatus(channelId: string, shouldPoll: boolean = true) {
  const baseUrl = `${API_URL}/api/v1/sellers/bot-status/${channelId}`;
  const { token } = useAuthContext();
  const queryClient = useQueryClient();

  const getBotStatus = async () => {
    const response = await apiGet<BotStatus>(
      baseUrl,
      BotStatusSchema,
      token ?? undefined
    );

    return response.data;
  };

  const botStatusQuery = useQuery({
    queryKey: botStatusQueryKey.detail(channelId),
    queryFn: getBotStatus,
    enabled: !!token && !!channelId,
    refetchInterval: (query) => {
      if (!shouldPoll) return false;

      const data = query.state.data;
      const shouldRefetch =
        data?.verifiedChannelOwnership || data?.hasBotAdminAccess;

      return shouldRefetch ? false : 3000;
    },
  });
  const refetchBotStatus = () => {
    queryClient.invalidateQueries({
      queryKey: botStatusQueryKey.detail(channelId),
    });
  };

  return {
    botStatus: botStatusQuery.data,
    isLoading: botStatusQuery.isLoading,
    isError: botStatusQuery.isError,
    refetch: botStatusQuery.refetch,
    refetchBotStatus,
  };
}
