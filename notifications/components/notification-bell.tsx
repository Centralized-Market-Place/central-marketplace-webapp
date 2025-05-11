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
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
} 