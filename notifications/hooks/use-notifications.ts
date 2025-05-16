"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/api";
import { notificationKeys } from "../utils";
import { NotificationsResponse, notificationsResponseSchema } from "../schema";
import { useAuthContext } from "@/providers/auth-context";
import { API_URL } from "@/lib/utils";

export interface NotificationFilter {
  page?: number;
  pageSize?: number;
}

export const DEFAULT_NOTIFICATION_FILTERS: NotificationFilter = {
  page: 1,
  pageSize: 20,
};

const buildQuery = (filters: NotificationFilter) => {
  return `?page=${filters.page}&page_size=${filters.pageSize}`;
};

export function useNotifications(
  filters: NotificationFilter = DEFAULT_NOTIFICATION_FILTERS,
  pollInterval: number = 45000
) {
  const { token, user } = useAuthContext();
  const baseUrl = `${API_URL}/api/v1/notifications`;
  const query = buildQuery(filters);

  const fetchNotifications = async () => {
    const response = await apiGet<NotificationsResponse>(
      `${baseUrl}${query}`,
      notificationsResponseSchema,
      token ?? undefined
    );
    return response.data;
  };

  const notificationsQuery = useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: fetchNotifications,
    enabled: !!token && !!user,
    refetchInterval: pollInterval,
    staleTime: 30000,
  });

  const hasMore =
    !!notificationsQuery.data &&
    notificationsQuery.data.page <
      Math.ceil(
        notificationsQuery.data.total / notificationsQuery.data.pageSize
      );

  return {
    notifications: notificationsQuery.data?.items || [],
    unreadCount:
      notificationsQuery.data?.items.filter((n) => !n.read).length || 0,
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error ? "Failed to load notifications" : null,
    hasMore,
    page: notificationsQuery.data?.page || 1,
    pageSize: notificationsQuery.data?.pageSize || filters.pageSize,
    total: notificationsQuery.data?.total || 0,
    refetch: notificationsQuery.refetch,
  };
}
