import { apiGet } from "@/services/api";
import { Reports, ReportsSchema } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { reportKeys } from "../utils";
import { useAuthContext } from "@/providers/auth-context";
import { API_URL } from "@/lib/utils";

interface MyReportsParams {
  page?: number;
  pageSize?: number;
}

export function useMyReports({
  page = 1,
  pageSize = 10,
}: MyReportsParams = {}) {
  const baseUrl = `${API_URL}/api/v1/reports/me`;
  const { token } = useAuthContext();

  const searchParams = new URLSearchParams();
  searchParams.append("page", page.toString());
  searchParams.append("page_size", pageSize.toString());
  const query = `?${searchParams.toString()}`;

  const myReportsQuery = useQuery({
    queryKey: reportKeys.list(query),
    queryFn: () =>
      apiGet<Reports>(`${baseUrl}${query}`, ReportsSchema, token ?? undefined),
    enabled: !!token,
  });

  return {
    reports: myReportsQuery.data?.data.items || [],
    pagination: {
      page: myReportsQuery.data?.data.page || 1,
      pageSize: myReportsQuery.data?.data.pageSize || 10,
      total: myReportsQuery.data?.data.total || 0,
    },
    isLoading: myReportsQuery.isLoading,
    isError: myReportsQuery.isError,
    error: myReportsQuery.error,
    refetch: myReportsQuery.refetch,
  };
}
