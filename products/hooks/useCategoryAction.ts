import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/api";
import { FilterCategorySchema, FilterCategoryType } from "../schema";
import { useAuthContext } from "@/providers/auth-context";
import { API_URL } from "@/lib/utils";
import { z } from "zod";

export function useCategories() {
    const baseUrl = `${API_URL}/api/v1/category/`;
    const { token } = useAuthContext();

    const fetchCategories = async () => {

        return await apiGet<FilterCategoryType>(baseUrl, FilterCategorySchema, token ?? undefined);
    };

    const {
        data: categories,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        enabled: true
    });

    console.log("error", error)

    return {
        categories: categories?.data.items || [],
        isLoading,
        isError,
        error,
    };
}