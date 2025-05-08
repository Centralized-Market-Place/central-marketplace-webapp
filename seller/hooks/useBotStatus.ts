import { apiGet } from "@/services/api";
import { BotStatus, BotStatusSchema } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { botStatusQueryKey } from "../utils";
import { API_URL } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-context";

export function useBotStatus(channelId: string) {
  const baseUrl = `${API_URL}/api/v1/sellers/bot-status/${channelId}`;
  const { token } = useAuthContext();

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
      const data = query.state.data;
      const isChannelOwner = data?.verifiedChannelOwnership;

      return isChannelOwner ? false : 3000;
    },
  });

  return {
    botStatus: botStatusQuery.data,
    isLoading: botStatusQuery.isLoading,
    isError: botStatusQuery.isError,
    refetch: botStatusQuery.refetch,
  };
}
