import { API_URL } from "@/lib/utils";
import { apiGet } from "@/services/api";
import { UserFilter, UsersResponse, UsersResponseSchema } from "../shema";
import { useQuery } from "@tanstack/react-query";
import { adminUsersKey } from "../utils";
import { useAuthContext } from "@/providers/auth-context";
import { UserRole } from "../shema";

export const DEFAULT_USER_FILTERS: UserFilter = {
  page: 1,
  pageSize: 10,
  sortBy: "created_at",
  sortDesc: true,
  query: "",
};

const buildQuery = (filters: UserFilter) => {
  const searchParams = new URLSearchParams();

  if (filters.page) {
    searchParams.append("page", filters.page.toString());
  }

  if (filters.pageSize) {
    searchParams.append("page_size", filters.pageSize.toString());
  }

  if (filters.role) {
    searchParams.append("role", filters.role);
  }

  if (filters.query) {
    searchParams.append("query", filters.query);
  }

  if (filters.sortBy) {
    searchParams.append("sort_by", filters.sortBy);
  }

  if (filters.sortDesc !== undefined) {
    searchParams.append("sort_desc", filters.sortDesc.toString());
  }

  return `?${searchParams.toString()}`;
};

export function useAdminUsers(filters: UserFilter = DEFAULT_USER_FILTERS) {
  const baseUrl = `${API_URL}/api/v1/users`;
  const query = buildQuery(filters);
  const { token, user } = useAuthContext();

  const getUsers = async () => {
    return apiGet<UsersResponse>(
      `${baseUrl}${query}`,
      UsersResponseSchema,
      token ?? undefined
    );
  };

  const usersQuery = useQuery({
    queryKey: adminUsersKey.list(query),
    queryFn: getUsers,
    enabled: !!token && user?.role === UserRole.Enum.SUPER_ADMIN,
  });

  return {
    users: usersQuery.data?.data.items || [],
    pagination: usersQuery.data?.data
      ? {
          page: usersQuery.data.data.page,
          pageSize: usersQuery.data.data.pageSize,
          total: usersQuery.data.data.total,
        }
      : null,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    refetch: usersQuery.refetch,
  };
}
