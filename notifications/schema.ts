import { z } from 'zod';

export const NotificationType = {
  COMMENT: 'comment',
  LIKE: 'like',
  MESSAGE: 'message',
  POST: 'post',
  NEW_APPLICATION: 'new_application',
  APPLICATION_STATUS_UPDATE: 'application_status_update',
  SYSTEM: 'system'
} as const;

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  content: z.string(),
  notificationType: z.string(),
  metadata: z.record(z.any()),
  read: z.boolean(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable()
});

export const notificationsResponseSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  items: z.array(notificationSchema)
});

export type Notification = z.infer<typeof notificationSchema>;
export type NotificationsResponse = z.infer<typeof notificationsResponseSchema>; 