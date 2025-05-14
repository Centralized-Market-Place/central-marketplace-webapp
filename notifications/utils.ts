import { Notification } from './schema';

export function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter(n => !n.read).length;
} 