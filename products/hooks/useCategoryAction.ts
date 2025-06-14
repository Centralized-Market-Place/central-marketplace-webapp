import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/api";
import { FilterCategorySchema, FilterCategoryType } from "../schema";
import { useAuthContext } from "@/providers/auth-context";
import { API_URL } from "@/lib/utils";
import { z } from "zod";

// Schema for hierarchical categories
const CategoryHierarchySchema = z.record(z.string(), z.array(z.string()));
type CategoryHierarchy = z.infer<typeof CategoryHierarchySchema>;

// Schema for flat category list
const FlatCategoriesSchema = z.array(z.string());
type FlatCategories = z.infer<typeof FlatCategoriesSchema>;

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

export function useCategoryHierarchy() {
    const baseUrl = `${API_URL}/api/v1/category/hierarchy`;
    const { token } = useAuthContext();

    const fetchCategoryHierarchy = async () => {
        return await apiGet<CategoryHierarchy>(baseUrl, CategoryHierarchySchema, token ?? undefined);
    };

    const {
        data: hierarchy,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["category-hierarchy"],
        queryFn: fetchCategoryHierarchy,
        enabled: true
    });

    return {
        hierarchy: hierarchy?.data || {},
        isLoading,
        isError,
        error,
    };
}

export function useFlatCategories() {
    const baseUrl = `${API_URL}/api/v1/category/all`;
    const { token } = useAuthContext();

    const fetchFlatCategories = async () => {
        return await apiGet<FlatCategories>(baseUrl, FlatCategoriesSchema, token ?? undefined);
    };

    const {
        data: categories,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["flat-categories"],
        queryFn: fetchFlatCategories,
        enabled: true
    });

    return {
        categories: categories?.data || [],
        isLoading,
        isError,
        error,
    };
}