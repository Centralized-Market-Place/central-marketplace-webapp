"use client";

import { NotificationList } from "@/notifications/components/notification-list";

export default function NotificationsPage() {
  return (
    <div className="container max-w-4xl py-8 mx-4 ">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <NotificationList />
    </div>
  );
}
