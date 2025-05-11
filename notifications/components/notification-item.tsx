'use client';

import { Notification } from '../schema';
import { useNotifications } from '../hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div 
      className={cn(
        "p-4 rounded-lg border cursor-pointer transition-colors",
        notification.read 
          ? "bg-background hover:bg-muted/30" 
          : "bg-primary/5 hover:bg-primary/10 border-primary/20"
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1 flex-1">
          <div className="flex items-start gap-2">
            {!notification.read && (
              <span className="size-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            )}
            <p className={cn(
              "text-sm",
              !notification.read && "font-medium"
            )}>{notification.content}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="size-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete notification?</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="destructive" 
                onClick={() => deleteNotification(notification.id)}
              >
                Delete
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
} 