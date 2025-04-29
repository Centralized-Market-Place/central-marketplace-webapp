import { apiGet } from "@/services/api";
import { Product, ProductSchema } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { productKeys } from "../utils";
import { API_URL } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-context";


export function useProduct(productId: string) {
    const baseUrl = `${API_URL}/api/v1/products/${productId}`;
    const { token } = useAuthContext();

    const getProduct = () => {
        return apiGet<Product>(baseUrl, ProductSchema, token ?? undefined);
    }

    const productQuery = useQuery({
        queryKey: productKeys.detail(productId),
        queryFn: getProduct,
    })

    return {
        product: productQuery.data?.data,
        isLoading: productQuery.isLoading,
        isError: productQuery.isError,
    }
}