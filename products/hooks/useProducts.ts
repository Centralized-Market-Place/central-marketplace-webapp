import { apiGet } from "@/services/api";
import { ProductFilter, Products, ProductsSchema } from "../schema";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productKeys } from "../utils";
import { useAuthContext } from "@/providers/auth-context";
import { API_URL } from "@/lib/utils";

export const DEFAULT_FILTERS: ProductFilter = {
  pageSize: 20,
  page: 1,
  query: "",
  sortBy: "created_at",
  sortDesc: true,
  channelIds: [],
  categories: undefined,
  minPrice: undefined,
  maxPrice: undefined,
};

const buildQuery = (filters: ProductFilter) => {
  const searchParams = new URLSearchParams();

  searchParams.append("page", filters.page.toString());
  searchParams.append("page_size", filters.pageSize.toString());

  if (filters.query) {
    searchParams.append("query", filters.query);
  }

  if (filters.sortBy) {
    searchParams.append("sort_by", filters.sortBy);
  }

  if (filters.sortDesc !== undefined) {
    searchParams.append("sort_desc", filters.sortDesc.toString());
  }

  if (filters.channelIds && filters.channelIds.length > 0) {
    filters.channelIds.forEach((channelId) => {
      searchParams.append("channel_ids", channelId);
    });
  }

  if (filters.categories) {
    searchParams.append("categories", filters.categories);
  }

  if (filters.minPrice !== undefined) {
    searchParams.append("min_price", filters.minPrice.toString());
  }

  if (filters.maxPrice !== undefined) {
    searchParams.append("max_price", filters.maxPrice.toString());
  }

  return `?${searchParams.toString()}`;
};

export type ProductsContext =
  | "home"
  | "channel"
  | "seller-dashboard"
  | "seller-products";

interface UseProductsOptions {
  filters: ProductFilter;
  context: ProductsContext;
}

export function useProducts(
  filtersOrOptions: ProductFilter | UseProductsOptions = {
    filters: DEFAULT_FILTERS,
    context: "home",
  }
) {
  // Backward compatibility: if first param is filters object without context, treat as home context
  const isLegacyCall =
    !("context" in filtersOrOptions) && !("filters" in filtersOrOptions);
  const options: UseProductsOptions = isLegacyCall
    ? { filters: filtersOrOptions as ProductFilter, context: "home" }
    : "context" in filtersOrOptions
    ? (filtersOrOptions as UseProductsOptions)
    : { filters: filtersOrOptions as ProductFilter, context: "home" };

  const { filters, context } = options;
  const baseUrl = `${API_URL}/api/v1/products`;
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
    queryKey: productKeys.contextList(context, query),
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
