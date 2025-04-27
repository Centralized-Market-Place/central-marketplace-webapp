import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/api";
import { Channel, ChannelSchema } from "../schema";
import { API_URL } from "@/lib/utils";

export const useChannel = (channelId: string) => {
  const baseUrl = `${API_URL}/api/v1/channels/`;
  const fetchChannel = async () => {
    return apiGet<Channel>(`${baseUrl}${channelId}`, ChannelSchema);
  };

  const channelQuery = useQuery({
    queryKey: ["channel", channelId],
    queryFn: fetchChannel,
    enabled: !!channelId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  

  return {
    channel: channelQuery.data,
    isLoading: channelQuery.isLoading,
    isError: channelQuery.isError,
    error: channelQuery.error,
  };
};
