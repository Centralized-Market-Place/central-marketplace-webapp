import { apiGet } from "@/services/api";
import { ProductFilter, Products, ProductsSchema } from "../schema";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productKeys } from "../utils";
import { useAuthContext } from "@/providers/auth-context";
import { API_URL } from "@/lib/utils";

export const DEFAULT_FILTERS: ProductFilter = {
  pageSize: 10,
  page: 1,
  query: "",
  sortBy: "date",
  sortDesc: true,
  channelId: "",
  categories: undefined,
  minPrice: undefined,
  maxPrice: undefined,
};

const buildQuery = (filters: ProductFilter) => {
  let query = `?page=${filters.page}&pageSize=${filters.pageSize}`;
  if (filters.query) {
    query += `&query=${filters.query}`;
  }
  if (filters.sortBy) {
    query += `&sort_by=${filters.sortBy}`;
  }
  if (filters.sortDesc) {
    query += `&sort_desc=${filters.sortDesc}`;
  }
  if (filters.channelId) {
    query += `&channel_id=${filters.channelId}`;
  }
  if (filters.categories) {
    query += `&categories=${filters.categories}`;
  }
  if (filters.minPrice !== undefined) {
    query += `&min_price=${filters.minPrice}`;
  }
  if (filters.maxPrice !== undefined) {
    query += `&max_price=${filters.maxPrice}`;
  }
  return query;
};

export function useProducts(filters: ProductFilter = DEFAULT_FILTERS) {
  const baseUrl = `${API_URL}/api/v1/products/`;
  const query = buildQuery(filters);
  const { token } = useAuthContext();

  const getProducts = ({ pageParam = 1 }: { pageParam?: number }) => {
    const queryString = buildQuery({ ...filters, page: pageParam });
    return apiGet<Products>(
      `${baseUrl}${queryString}`,
      ProductsSchema,
      token ?? undefined
    );
  };

  const productsQuery = useInfiniteQuery({
    queryKey: productKeys.list(query),
    queryFn: getProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.items.length < filters.pageSize) return undefined;
      return allPages.length + 1;
    },
  });

  return {
    products:
      productsQuery.data?.pages.flatMap((page) => page.data.items) || [],
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    fetchNextPage: productsQuery.fetchNextPage,
    hasNextPage: productsQuery.hasNextPage,
  };
}
