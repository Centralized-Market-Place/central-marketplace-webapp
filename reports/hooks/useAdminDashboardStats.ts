import { apiGet } from "@/services/api";
import { AdminDashboardStats, AdminDashboardStatsSchema } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { reportKeys } from "../utils";
import { useAuthContext } from "@/providers/auth-context";
import { API_URL } from "@/lib/utils";

export function useAdminDashboardStats() {
  const baseUrl = `${API_URL}/api/v1/reports/dashboard-stats`;
  const { token } = useAuthContext();

  const statsQuery = useQuery({
    queryKey: reportKeys.detail("stats"),
    queryFn: () =>
      apiGet<AdminDashboardStats>(
        baseUrl,
        AdminDashboardStatsSchema,
        token ?? undefined
      ),
    enabled: !!token,
    refetchInterval: 5 * 60 * 1000,
  });

  return {
    stats: statsQuery.data?.data,
    isLoading: statsQuery.isLoading,
    isError: statsQuery.isError,
    error: statsQuery.error,
    refetch: statsQuery.refetch,
  };
}
