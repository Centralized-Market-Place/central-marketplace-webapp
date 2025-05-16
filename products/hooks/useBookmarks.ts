import { API_URL } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-context";
import { apiGet } from "@/services/api";
import { Products, ProductsSchema } from "../schema";
import { useInfiniteQuery } from "@tanstack/react-query";
import { bookmarkKeys } from "../utils";

export interface BookmarkFilter {
  pageSize: number;
  page: number;
  sortBy: string;
  query: string;
  sortDesc: boolean;
}

export const DEFAULT_BOOKMARK_FILTERS = {
  pageSize: 10,
  page: 1,
  sortDesc: true,
  query: "",
  sortBy: "createdAt",
};

const buildQuery = (filters: BookmarkFilter) => {
  let query = `?page=${filters.page}&pageSize=${filters.pageSize}`;
  if (filters.sortBy) {
    query += `&sortBy=${filters.sortBy}`;
  }
  if (filters.query) {
    query += `&query=${filters.query}`;
  }
  if (filters.sortDesc) {
    query += `&sortDesc=${filters.sortDesc}`;
  }
  return query;
};

export function useBookmarks(
  filters: BookmarkFilter = DEFAULT_BOOKMARK_FILTERS
) {
  const baseUrl = `${API_URL}/api/v1/products/bookmarked`;
  const query = buildQuery(filters);
  const { token } = useAuthContext();

  const getBookmarkedProducts = ({ pageParam = 1 }: { pageParam?: number }) => {
    const queryString = buildQuery({ ...filters, page: pageParam });
    return apiGet<Products>(
      `${baseUrl}${queryString}`,
      ProductsSchema,
      token ?? undefined
    );
  };

  const bookmarksQuery = useInfiniteQuery({
    queryKey: bookmarkKeys.list(query),
    queryFn: getBookmarkedProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.items.length < filters.pageSize) return undefined;
      return allPages.length + 1;
    },
  });

  return {
    bookmarks:
      bookmarksQuery.data?.pages.flatMap((page) => page.data.items) || [],
    isLoading: bookmarksQuery.isLoading,
    isError: bookmarksQuery.isError,
    error: bookmarksQuery.error,
    fetchNextPage: bookmarksQuery.fetchNextPage,
    hasNextPage: bookmarksQuery.hasNextPage,
  };
}
