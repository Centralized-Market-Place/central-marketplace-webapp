import { apiGet } from "@/services/api";
import { Comments, CommentsSchema } from "../schema";
import { useInfiniteQuery } from "@tanstack/react-query";
import { commentKeys } from "../utils";

const buildQuery = (page: number, size: number) => {
  return `?page=${page}&pageSize=${size}`;
};
export function useComments(size: number, productId: string) {
  const baseUrl = `/api/v1/products/${productId}/comments`;

  const getComments = ({ pageParam = 1 }: { pageParam?: number }) => {
    const queryString = buildQuery(pageParam, size);
    return apiGet<Comments>(`${baseUrl}${queryString}`, CommentsSchema);
  };
  const commentsQuery = useInfiniteQuery({
    queryKey: commentKeys.list(productId),
    queryFn: getComments,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.items.length < size) return undefined;
      return allPages.length + 1;
    },
  });

  return {
    comments:
      commentsQuery.data?.pages.flatMap((page) => page.data.items) || [],
    isLoading: commentsQuery.isLoading,
    isError: commentsQuery.isError,
    error: commentsQuery.error,
    fetchNextPage: commentsQuery.fetchNextPage,
    hasNextPage: commentsQuery.hasNextPage,
  };
}
