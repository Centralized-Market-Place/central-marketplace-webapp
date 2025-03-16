import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/api";
import { Channel, ChannelSchema } from "../schema";

export const useChannel = (channelId: string) => {
  const fetchChannel = async () => {
    return apiGet<Channel>(`/api/v1/channels/${channelId}`, ChannelSchema);
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
