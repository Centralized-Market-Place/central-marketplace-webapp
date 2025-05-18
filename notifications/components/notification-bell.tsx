'use client';

import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/use-notifications';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function NotificationBell() {
  const { unreadCount, notifications, } = useNotifications();
  const router = useRouter();
  const unreadNotifications = notifications.filter(n => !n.read);

  const handleNotificationClick = async () => {
    router.push('/notifications');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className={cn(
            "size-4 transition-colors",
            unreadCount > 0 && "text-primary"
          )} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 text-red-500 font-bold  text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center ">
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto p-0">
        {unreadNotifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">No unread notifications</div>
        ) : (
          unreadNotifications.slice(0, 8).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onClick={() => handleNotificationClick()}
              className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
            >
              {notification.content.length > 40
                ? notification.content.slice(0, 40) + '...'
                : notification.content}
            </DropdownMenuItem>
          ))
        )}
        {unreadNotifications.length > 8 && (
          <div className="p-2 text-center text-xs text-muted-foreground">+{unreadNotifications.length - 8} more</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 