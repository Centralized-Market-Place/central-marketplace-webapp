import { apiGet } from "@/services/api";
import {
  AdminInvitationsResponse,
  AdminInviteFilter,
  adminInvitationsResponseSchema,
  AdminInvitation,
  adminInvitationSchema,
} from "../schema";
import { useQuery } from "@tanstack/react-query";
import { adminInviteKeys } from "../utils";
import { API_URL } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-context";
import { UserRole } from "@/auth/shema";

export const DEFAULT_ADMIN_INVITE_FILTERS: AdminInviteFilter = {
  page: 1,
  pageSize: 10,
  sortBy: "createdAt",
  sortDesc: true,
};

const buildQuery = (filters: AdminInviteFilter) => {
  const searchParams = new URLSearchParams();

  if (filters.page) {
    searchParams.append("page", filters.page.toString());
  }

  if (filters.pageSize) {
    searchParams.append("page_size", filters.pageSize.toString());
  }

  if (filters.status) {
    searchParams.append("status", filters.status);
  }

  if (filters.sortBy) {
    searchParams.append("sort_by", filters.sortBy);
  }

  if (filters.sortDesc !== undefined) {
    searchParams.append("sort_desc", filters.sortDesc.toString());
  }

  return `?${searchParams.toString()}`;
};

export function useAdminInvitations(
  filters: AdminInviteFilter = DEFAULT_ADMIN_INVITE_FILTERS
) {
  const baseUrl = `${API_URL}/api/v1/admin-invites`;
  const query = buildQuery(filters);
  const { token, user } = useAuthContext();

  const getAdminInvitations = async () => {
    return apiGet<AdminInvitationsResponse>(
      `${baseUrl}${query}`,
      adminInvitationsResponseSchema,
      token ?? undefined
    );
  };

  const adminInvitationsQuery = useQuery({
    queryKey: adminInviteKeys.list(query),
    queryFn: getAdminInvitations,
    enabled: !!token && user?.role === UserRole.Enum.SUPER_ADMIN,
  });

  return {
    invitations: adminInvitationsQuery.data?.data.items || [],
    pagination: adminInvitationsQuery.data?.data
      ? {
          page: adminInvitationsQuery.data.data.page,
          pageSize: adminInvitationsQuery.data.data.pageSize,
          total: adminInvitationsQuery.data.data.total,
        }
      : null,
    isLoading: adminInvitationsQuery.isLoading,
    isError: adminInvitationsQuery.isError,
    error: adminInvitationsQuery.error,
  };
}

export function useAdminInvitationByToken(token: string) {
  const baseUrl = `${API_URL}/api/v1/admin-invites/token/${token}`;

  const getInvitationByToken = async () => {
    return apiGet<AdminInvitation>(baseUrl, adminInvitationSchema);
  };

  const invitationQuery = useQuery({
    queryKey: adminInviteKeys.detail(token),
    queryFn: getInvitationByToken,
    enabled: !!token,
  });

  return {
    invitation: invitationQuery.data?.data,
    isLoading: invitationQuery.isLoading,
    isError: invitationQuery.isError,
    error: invitationQuery.error,
  };
}
