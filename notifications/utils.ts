import { createQueryKeyStructure } from "@/lib/query_keys";
import { Notification } from "./schema";

export const notificationKeys = createQueryKeyStructure("notification");

export function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length;
}
