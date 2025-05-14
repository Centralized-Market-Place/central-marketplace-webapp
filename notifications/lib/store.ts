import { create } from 'zustand';
import { Notification } from '../schema';
import { notificationApi } from './api';
import { getUnreadCount } from '../utils';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isPolling: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  pollingInterval: NodeJS.Timeout | null;
}

interface NotificationActions {
  fetchNotifications: (token: string, page?: number) => Promise<void>;
  createNotification: (token: string, data: {
    userId: string;
    content: string;
    notificationType: string;
    metadata?: Record<string, any>;
  }) => Promise<void>;
  markAsRead: (token: string, id: string) => Promise<void>;
  deleteNotification: (token: string, id: string) => Promise<void>;
  deleteAllNotifications: (token: string) => Promise<void>;
  startPolling: (token: string) => void;
  stopPolling: () => void;
}

export const useNotificationStore = create<NotificationState & NotificationActions>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isPolling: false,
  error: null,
  page: 1,
  hasMore: true,
  pollingInterval: null,

  fetchNotifications: async (token: string, page = 1) => {
    console.log('Store: Fetching notifications', { page, isPolling: get().isPolling });
    
    // Only set loading state for initial load or manual refresh
    if (page === 1 && !get().isPolling) {
      console.log('Store: Setting loading state');
      set({ isLoading: true });
    }
    set({ error: null });
    
    try {
      const response = await notificationApi.getNotifications(page, 20, token);
      
      // Validate response data
      if (!response || !Array.isArray(response.items)) {
        console.error('Store: Invalid response format', response);
        set({ error: 'Invalid response format', isLoading: false });
        return;
      }

      console.log('Store: Received notifications', { 
        count: response.items.length,
        page: response.page,
        total: response.total
      });
      
      set(state => ({
        notifications: page === 1 ? response.items : [...state.notifications, ...response.items],
        unreadCount: getUnreadCount(response.items),
        page: response.page,
        hasMore: response.items.length === response.pageSize,
        isLoading: false
      }));
    } catch (error) {
      console.error('Store: Error fetching notifications', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch notifications', 
        isLoading: false 
      });
    }
  },

  createNotification: async (token: string, data: {
    userId: string;
    content: string;
    notificationType: string;
    metadata?: Record<string, any>;
  }) => {
    console.log('Store: Creating notification', data);
    try {
      const notification = await notificationApi.createNotification(data, token);
      set(state => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      }));
    } catch (error) {
      console.error('Store: Error creating notification', error);
      set({ error: 'Failed to create notification' });
    }
  },

  markAsRead: async (token: string, id: string) => {
    console.log('Store: Marking notification as read', { id });
    try {
      await notificationApi.markAsRead(id, token);
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n
        ),
        unreadCount: state.unreadCount - 1
      }));
    } catch (error) {
      console.error('Store: Error marking notification as read', error);
      set({ error: 'Failed to mark notification as read' });
    }
  },

  deleteNotification: async (token: string, id: string) => {
    console.log('Store: Deleting notification', { id });
    try {
      await notificationApi.deleteNotification(id, token);
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: state.notifications.find(n => n.id === id)?.read 
          ? state.unreadCount 
          : state.unreadCount - 1
      }));
    } catch (error) {
      console.error('Store: Error deleting notification', error);
      set({ error: 'Failed to delete notification' });
    }
  },

  deleteAllNotifications: async (token: string) => {
    console.log('Store: Deleting all notifications');
    try {
      await notificationApi.deleteAllNotifications(token);
      set({ notifications: [], unreadCount: 0 });
    } catch (error) {
      console.error('Store: Error deleting all notifications', error);
      set({ error: 'Failed to delete all notifications' });
    }
  },

  startPolling: (token: string) => {
    console.log('Store: Starting polling');
    
    // Clear any existing interval
    const { pollingInterval } = get();
    if (pollingInterval) {
      console.log('Store: Clearing existing polling interval');
      clearInterval(pollingInterval);
    }

    // Set polling state
    set({ isPolling: true });

    // Initial fetch
    console.log('Store: Performing initial fetch');
    get().fetchNotifications(token, 1);

    // Start polling with a longer interval
    console.log('Store: Setting up polling interval');
    const interval = setInterval(() => {
      console.log('Store: Polling interval triggered');
      get().fetchNotifications(token, 1);
    }, 10000); // Increased to 10 seconds
    
    set({ pollingInterval: interval });
  },

  stopPolling: () => {
    console.log('Store: Stopping polling');
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearInterval(pollingInterval);
      set({ pollingInterval: null, isPolling: false });
    }
  }
})); 