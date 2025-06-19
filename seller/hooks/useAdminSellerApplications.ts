import { apiGet } from "@/services/api";
import {
  PaginatedSellerApplicationSchema,
  SellerApplications,
  SellerApplicationStatus,
} from "../schema";
import { useQuery } from "@tanstack/react-query";
import { adminSellerApplicationQueryKey } from "../utils";
import { API_URL } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-context";

interface AdminSellerApplicationsParams {
  page?: number;
  pageSize?: number;
  status?: SellerApplicationStatus;
  search?: string;
}

export function useAdminSellerApplications(
  params: AdminSellerApplicationsParams = {}
) {
  const { page = 1, pageSize = 10, status, search } = params;
  const baseUrl = `${API_URL}/api/v1/sellers/applications`;
  const { token, user } = useAuthContext();

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("page_size", pageSize.toString());

  if (status) {
    queryParams.append("application_status", status);
  }

  if (search) {
    queryParams.append("search", search);
  }

  const getApplications = () => {
    const url = `${baseUrl}?${queryParams.toString()}`;
    return apiGet<SellerApplications>(
      url,
      PaginatedSellerApplicationSchema,
      token ?? undefined
    );
  };

  const applicationsQuery = useQuery({
    queryKey: adminSellerApplicationQueryKey.list(queryParams.toString()),
    queryFn: getApplications,
    enabled: !!token && (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"),
  });

  return {
    applications: applicationsQuery.data?.data.items ?? [],
    pagination: applicationsQuery.data?.data
      ? {
          total: applicationsQuery.data.data.total,
          page: applicationsQuery.data.data.page,
          pageSize: applicationsQuery.data.data.pageSize,
        }
      : { total: 0, page, pageSize },
    isLoading: applicationsQuery.isLoading,
    isError: applicationsQuery.isError,
  };
}
