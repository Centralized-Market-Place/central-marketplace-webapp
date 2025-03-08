import { apiGet } from "@/services/api";
import { ProductFilter, Products, ProductsSchema } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { productKeys } from "../utils";

export const DEFAULT_FILTERS: ProductFilter = {
  pageSize: 10,
  page: 1,
  query: "",
  sortBy: "createdAt",
  sortDesc: true,
};

const buildQuery = (filters: ProductFilter) => {
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
    return query;
}

export function useProducts(filters: ProductFilter = DEFAULT_FILTERS) {
  const baseUrl = `api/v1/products`;
  const query = buildQuery(filters);
  

  const getProducts = () => {
    return apiGet<Products>(`${baseUrl}${query}`, ProductsSchema);
  };

  const productsQuery = useQuery({
    queryKey: productKeys.lists(),
    queryFn: getProducts,
  });



    return {
        products: productsQuery.data?.data.items || [],
        isLoading: productsQuery.isLoading,
        isError: productsQuery.isError,
        error: productsQuery.error,
    };


}
