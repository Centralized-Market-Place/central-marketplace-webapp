import { API_URL } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { sellerAnalyticsKeys } from "../utils";
import { apiGet } from "@/services/api";
import { SellerAnalytics, SellerAnalyticsSchema } from "../schema";
import { useAuthContext } from "@/providers/auth-context";

export function useSellerAnalytics() {
  const baseUrl = `${API_URL}/api/v1/sellers/analytics`;
  const { token } = useAuthContext();

  const getSellerAnalytics = async () => {
    return await apiGet<SellerAnalytics>(
      baseUrl,
      SellerAnalyticsSchema,
      token ?? undefined
    );
  };

  const sellerAnalyticsQuery = useQuery({
    queryKey: sellerAnalyticsKeys.details(),
    queryFn: getSellerAnalytics,
    enabled: !!token,
  });

  return {
    sellerAnalytics: sellerAnalyticsQuery.data?.data,
    sellerAnalyticsLoading: sellerAnalyticsQuery.isLoading,
    sellerAnalyticsError: sellerAnalyticsQuery.error,
  };
}
