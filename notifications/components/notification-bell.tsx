'use client';

import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/use-notifications';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <Bell className={cn(
        "size-5 transition-colors",
        unreadCount > 0 && "text-primary"
      )} />
    </div>
  );
} 