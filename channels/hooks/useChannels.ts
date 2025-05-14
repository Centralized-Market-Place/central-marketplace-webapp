import { apiGet } from "@/services/api";
import { ChannelFilter, Channels, ChannelsSchema } from "../schema";
import { useInfiniteQuery } from "@tanstack/react-query";
import { channelKeys } from "../utils";
import { useAuthContext } from "@/providers/auth-context";
import { API_URL } from "@/lib/utils";

export const DEFAULT_FILTERS: ChannelFilter = {
  pageSize: 10,
  page: 1,
  query: "",
  sortBy: "createdAt",
  sortDesc: true,
  channelName: "",
};

const buildQuery = (filters: ChannelFilter) => {
  let query = `?page=${filters.page}&pageSize=${filters.pageSize}`;
  if (filters.query) {
    query += `&query=${filters.query}`;
  }
  if (filters.sortBy) {
    query += `&sortBy=${filters.sortBy}`;
  }
  if (filters.sortDesc) {
    query += `&sortDesc=${filters.sortDesc}`;
  }
  if (filters.channelName) {
    query += `&channelId=${filters.channelName}`;
  }
  return query;
};

export function useChannels(filters: ChannelFilter = DEFAULT_FILTERS) {
  const baseUrl = `${API_URL}/api/v1/channels/`;
  const query = buildQuery(filters);
  const { token } = useAuthContext();

  const getChannels = ({ pageParam = 1 }: { pageParam?: number }) => {
    const queryString = buildQuery({ ...filters, page: pageParam });
    return apiGet<Channels>(`${baseUrl}${queryString}`, ChannelsSchema, token ?? undefined);
  };

  const channelsQuery = useInfiniteQuery({
    queryKey: channelKeys.list(query),
    queryFn: getChannels,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.items.length < filters.pageSize) return undefined;
      return allPages.length + 1;
    },
  });
  console.log("channelsQuery", channelsQuery.error);

  return {
    channels: channelsQuery.data?.pages.flatMap((page) => page.data.items) || [],
    isLoading: channelsQuery.isLoading,
    isError: channelsQuery.isError,
    error: channelsQuery.error,
    fetchNextPage: channelsQuery.fetchNextPage,
    hasNextPage: channelsQuery.hasNextPage,
  };
}
