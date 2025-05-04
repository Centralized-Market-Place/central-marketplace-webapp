import { apiGet } from "@/services/api";
import { SellerApplication, SellerApplicationSchema } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { sellerApplicationQueryKey } from "../utils";
import { API_URL } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-context";
import { z } from "zod";

export function useSellerApplications() {
  const baseUrl = `${API_URL}/api/v1/sellers/applications/me`;
  const { token } = useAuthContext();

  const getSellerApplications = () => {
    return apiGet<SellerApplication[]>(
      baseUrl,
      z.array(SellerApplicationSchema),
      token ?? undefined
    );
  };

  const sellerApplicationsQuery = useQuery({
    queryKey: sellerApplicationQueryKey.lists(),
    queryFn: getSellerApplications,
    enabled: !!token,
  });

  return {
    applications: sellerApplicationsQuery.data?.data ?? [],
    isLoading: sellerApplicationsQuery.isLoading,
    isError: sellerApplicationsQuery.isError,
  };
}
