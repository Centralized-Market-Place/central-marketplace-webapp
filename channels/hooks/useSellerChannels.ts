import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/api";
import { Channel, ChannelSchema } from "../schema";
import { API_URL } from "@/lib/utils";
import { z } from "zod";
import { sellerChannelKeys } from "../utils";
import { useAuthContext } from "@/providers/auth-context";
import { UserRole } from "@/auth/shema";
export function useSellerChannels() {
  const baseUrl = `${API_URL}/api/v1/channels/me`;
  const { token, user } = useAuthContext();

  const getSellerChannels = async () => {
    const response = await apiGet<Channel[]>(
      baseUrl,
      z.array(ChannelSchema),
      token ?? undefined
    );
    return response;
  };

  const sellerChannelsQuery = useQuery({
    queryKey: sellerChannelKeys.lists(),
    queryFn: getSellerChannels,
    enabled: !!token && !!user && user.role === UserRole.Enum.SELLER,
  });

  return {
    channels: sellerChannelsQuery.data?.data,
    channelsLoading: sellerChannelsQuery.isLoading,
    channelsError: sellerChannelsQuery.error,
    refetch: sellerChannelsQuery.refetch,
  };
}
