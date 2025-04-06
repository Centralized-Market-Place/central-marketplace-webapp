import { apiGet } from "@/services/api";
import { Comments, CommentsSchema } from "../schema";
import { useInfiniteQuery } from "@tanstack/react-query";
import { replyKeys } from "../utils";
import { API_URL } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-context";

const buildQuery = (page: number, size: number) => {
  return `?page=${page}&pageSize=${size}`;
};
export function useReplies(size: number, commentId: string) {
  const baseUrl = `${API_URL}/api/v1/comments/${commentId}/replies`;

  const { token } = useAuthContext();

  const getReplies = ({ pageParam = 1 }: { pageParam?: number }) => {
    const queryString = buildQuery(pageParam, size);
    return apiGet<Comments>(`${baseUrl}${queryString}`, CommentsSchema);
  };

  const repliesQuery = useInfiniteQuery({
    queryKey: replyKeys.list(commentId),
    queryFn: getReplies,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.items.length < size) return undefined;
      return allPages.length + 1;
    },
    enabled: !!token,
  });

  return {
    replies: repliesQuery.data?.pages.flatMap((page) => page.data.items) || [],
    isLoading: repliesQuery.isLoading,
    isError: repliesQuery.isError,
    error: repliesQuery.error,
    fetchNextPage: repliesQuery.fetchNextPage,
    hasNextPage: repliesQuery.hasNextPage,
  };
}
