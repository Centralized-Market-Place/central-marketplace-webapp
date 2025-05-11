import { apiGet, apiPost, apiDelete, ApiResult } from '@/services/api';
import { notificationSchema, notificationsResponseSchema } from '../schema';
import { Notification, NotificationsResponse } from '../schema';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8443/api/v1';

export const notificationApi = {
  getNotifications: async (page: number, pageSize: number, token: string): Promise<NotificationsResponse> => {
    console.log('Fetching notifications:', { page, pageSize });
    try {
      const response = await apiGet<NotificationsResponse>(
        `${API_BASE_URL}/notifications?page=${page}&page_size=${pageSize}`,
        notificationsResponseSchema,
        token
      );
      
      // Log the raw response for debugging
      console.log('Raw API response:', response);
      
      // The response from apiGet is wrapped in ApiResult
      // We need to return the data property which contains our paginated response
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }
      throw error;
    }
  },

  createNotification: async (data: {
    userId: string;
    content: string;
    notificationType: string;
    metadata?: Record<string, any>;
  }, token: string): Promise<Notification> => {
    console.log('Creating notification:', data);
    try {
      const response = await apiPost<Notification>(
        `${API_BASE_URL}/notifications`,
        notificationSchema,
        data,
        token
      );
      console.log('Create notification response:', response);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  markAsRead: async (id: string, token: string): Promise<Notification> => {
    console.log('Marking notification as read:', id);
    try {
      const response = await apiPost<Notification>(
        `${API_BASE_URL}/notifications/${id}/read`,
        notificationSchema,
        {},
        token
      );
      console.log('Mark as read response:', response);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  deleteNotification: async (id: string, token: string): Promise<void> => {
    console.log('Deleting notification:', id);
    try {
      await apiDelete(
        `${API_BASE_URL}/notifications/${id}`,
        token
      );
      console.log('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  deleteAllNotifications: async (token: string): Promise<void> => {
    console.log('Deleting all notifications');
    try {
      await apiDelete(
        `${API_BASE_URL}/notifications`,
        token
      );
      console.log('All notifications deleted successfully');
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }
}; 