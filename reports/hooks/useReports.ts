import { apiGet } from "@/services/api";
import { ReportFilter, Reports, ReportsSchema } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { reportKeys } from "../utils";
import { useAuthContext } from "@/providers/auth-context";
import { API_URL } from "@/lib/utils";

export const DEFAULT_REPORT_FILTERS: ReportFilter = {
  pageSize: 10,
  page: 1,
  sortBy: "created_at",
  sortDesc: true,
};

const buildQuery = (filters: ReportFilter) => {
  const searchParams = new URLSearchParams();

  searchParams.append("page", filters.page.toString());
  searchParams.append("page_size", filters.pageSize.toString());

  if (filters.statusFilter) {
    searchParams.append("status_filter", filters.statusFilter);
  }

  if (filters.targetTypeFilter) {
    searchParams.append("target_type_filter", filters.targetTypeFilter);
  }

  if (filters.reportTypeFilter) {
    searchParams.append("report_type_filter", filters.reportTypeFilter);
  }

  if (filters.sortBy) {
    searchParams.append("sort_by", filters.sortBy);
  }

  if (filters.sortDesc !== undefined) {
    searchParams.append("sort_desc", filters.sortDesc.toString());
  }

  return `?${searchParams.toString()}`;
};

export function useReports(filters: ReportFilter = DEFAULT_REPORT_FILTERS) {
  const baseUrl = `${API_URL}/api/v1/reports`;
  const query = buildQuery(filters);
  const { token } = useAuthContext();

  const reportsQuery = useQuery({
    queryKey: reportKeys.list(query),
    queryFn: () =>
      apiGet<Reports>(`${baseUrl}${query}`, ReportsSchema, token ?? undefined),
    enabled: !!token,
  });

  return {
    reports: reportsQuery.data?.data.items || [],
    pagination: {
      page: reportsQuery.data?.data.page || 1,
      pageSize: reportsQuery.data?.data.pageSize || 10,
      total: reportsQuery.data?.data.total || 0,
    },
    isLoading: reportsQuery.isLoading,
    isError: reportsQuery.isError,
    error: reportsQuery.error,
    refetch: reportsQuery.refetch,
  };
}
