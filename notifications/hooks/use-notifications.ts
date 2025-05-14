'use client'

import { useCallback, useEffect } from 'react';
import { useNotificationStore } from '../lib/store';
import { useAlert } from '@/providers/alert-provider';
import { useAuthContext } from '@/providers/auth-context';

export function useNotifications() {
  const store = useNotificationStore();
  const alert = useAlert();
  const { token, user } = useAuthContext();

  useEffect(() => {
 
    if (token && user) {
     
      store.startPolling(token);
      return () => {
       
        store.stopPolling();
      };
    } else {
      
      store.stopPolling();
    }
  }, [token, user]);

  const createNotification = useCallback(async (data: {
    userId: string;
    content: string;
    notificationType: string;
    metadata?: Record<string, any>;
  }) => {
    if (!token) {
      console.log('useNotifications: Cannot create notification - no token');
      return;
    }
    try {
      await store.createNotification(token, data);
      alert?.success('Notification created');
    } catch (error) {
      console.error('useNotifications: Error creating notification', error);
      alert?.error('Failed to create notification');
    }
  }, [alert, token]);

  const markAsRead = useCallback(async (id: string) => {
    if (!token) {
      console.log('useNotifications: Cannot mark as read - no token');
      return;
    }
    try {
      await store.markAsRead(token, id);
      alert?.success('Notification marked as read');
    } catch (error) {
      console.error('useNotifications: Error marking as read', error);
      alert?.error('Failed to mark notification as read');
    }
  }, [alert, token]);

  const deleteNotification = useCallback(async (id: string) => {
    if (!token) {
      console.log('useNotifications: Cannot delete - no token');
      return;
    }
    try {
      await store.deleteNotification(token, id);
      alert?.success('Notification deleted');
    } catch (error) {
      console.error('useNotifications: Error deleting notification', error);
      alert?.error('Failed to delete notification');
    }
  }, [alert, token]);

  const deleteAll = useCallback(async () => {
    if (!token) {
      console.log('useNotifications: Cannot delete all - no token');
      return;
    }
    try {
      await store.deleteAllNotifications(token);
      alert?.success('All notifications cleared');
    } catch (error) {
      console.error('useNotifications: Error deleting all notifications', error);
      alert?.error('Failed to clear notifications');
    }
  }, [alert, token]);

  return {
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    isLoading: store.isLoading,
    error: store.error,
    hasMore: store.hasMore,
    createNotification,
    markAsRead,
    deleteNotification,
    deleteAll,
    loadMore: () => {
      if (!token) {
        console.log('useNotifications: Cannot load more - no token');
        return;
      }
      store.fetchNotifications(token, store.page + 1);
    }
  };
} 