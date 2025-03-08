import { apiGet } from "@/services/api";
import { Product, ProductSchema } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { productKeys } from "../utils";


export function useProduct(productId: string) {
    const baseUrl = `/api/v1/products/${productId}`;

    const getProduct = () => {
        return apiGet<Product>(baseUrl, ProductSchema)
    }

    const productQuery = useQuery({
        queryKey: productKeys.detail(productId),
        queryFn: getProduct,
    })

    console.log("error", productQuery.error);

    return {
        product: productQuery.data?.data,
        isLoading: productQuery.isLoading,
        isError: productQuery.isError,
    }
}