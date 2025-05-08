import { apiGet } from "@/services/api";
import { SellerApplication, SellerApplicationSchema } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { sellerApplicationQueryKey } from "../utils";
import { API_URL } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-context";

export function useSellerApplication(applicationId: string) {
  const baseUrl = `${API_URL}/api/v1/sellers/applications/${applicationId}`;
  const { token } = useAuthContext();

  const getSellerApplication = () => {
    return apiGet<SellerApplication>(
      baseUrl,
      SellerApplicationSchema,
      token ?? undefined
    );
  };

  const sellerApplicationQuery = useQuery({
    queryKey: sellerApplicationQueryKey.detail(applicationId),
    queryFn: getSellerApplication,
    enabled: !!token && !!applicationId,
  });

  return {
    application: sellerApplicationQuery.data?.data,
    isLoading: sellerApplicationQuery.isLoading,
    isError: sellerApplicationQuery.isError,
  };
}
