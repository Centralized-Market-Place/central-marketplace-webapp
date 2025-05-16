"use client";

import { API_URL } from "@/lib/utils";
import { useAlert } from "@/providers/alert-provider";
import { useAuthContext } from "@/providers/auth-context";
import { apiDelete, apiPost } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Notification,
  notificationSchema,
} from "../schema";
import { notificationKeys } from "../utils";

export function useNotificationActions() {
  const baseUrl = `${API_URL}/api/v1/notifications`;
  const { token } = useAuthContext();
  const alert = useAlert();
  const queryClient = useQueryClient();

  const deleteAllNotifications = () => {
    return apiDelete(baseUrl, token ?? undefined);
  };

  const deleteAllNotificationsMutation = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      alert?.success("All notifications cleared");
    },
    onError: () => {
      alert?.error("Failed to clear notifications");
    },
  });

  return {
    deleteAll: deleteAllNotificationsMutation.mutate,
    isDeletingAll: deleteAllNotificationsMutation.isPending,
  };
}

export function useNotificationAction(notificationId: string) {
  const baseUrl = `${API_URL}/api/v1/notifications`;
  const { token } = useAuthContext();
  const alert = useAlert();
  const queryClient = useQueryClient();

  const markAsRead = async () => {
    return apiPost<Notification>(
      `${baseUrl}/${notificationId}/read`,
      notificationSchema,
      {},
      token ?? undefined
    );
  };

  const deleteNotification = () => {
    return apiDelete(`${baseUrl}/${notificationId}`, token ?? undefined);
  };

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      alert?.success("Notification marked as read");
    },
    onError: () => {
      alert?.error("Failed to mark notification as read");
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      alert?.success("Notification deleted");
    },
    onError: () => {
      alert?.error("Failed to delete notification");
    },
  });

  return {
    markAsRead: markAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
  };
}
