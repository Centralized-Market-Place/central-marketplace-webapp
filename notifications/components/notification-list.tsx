'use client';

import { useNotifications } from '../hooks/use-notifications';
import { NotificationItem } from './notification-item';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/empty-state';
import LoadingIcon from '@/components/state/loading';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Bell } from 'lucide-react';

export function NotificationList() {
  const { 
    notifications, 
    isLoading, 
    error, 
    hasMore,
    deleteAll,
    loadMore 
  } = useNotifications();

  // Only show loading state on initial load
  if (isLoading && notifications.length === 0) {
    return <LoadingIcon message="Loading notifications..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadMore} />;
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Bell className="size-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
        <p className="text-sm text-muted-foreground text-center">
          When you receive notifications, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">Clear All</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={deleteAll}>
                Confirm
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="space-y-2">
        {notifications.map(notification => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>

      {hasMore && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={loadMore}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  );
} 