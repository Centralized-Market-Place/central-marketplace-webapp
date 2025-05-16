"use client";

import {
  useNotifications,
  NotificationFilter,
} from "../hooks/use-notifications";
import { useNotificationActions } from "../hooks/use-notification-action";
import { NotificationItem } from "./notification-item";
import { ErrorState } from "@/components/common/empty-state";
import { Loader2, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export function NotificationList() {
  const [filter, setFilter] = useState<NotificationFilter>({
    page: 1,
    pageSize: 20,
  });

  const { notifications, isLoading, error, hasMore, refetch } =
    useNotifications(filter);

  const { deleteAll, isDeletingAll } = useNotificationActions();

  const handleDeleteAll = () => {
    deleteAll();
  };

  const loadMore = () => {
    if (hasMore) {
      setFilter((prev) => ({
        ...prev,
        page: prev.page ? prev.page + 1 : 2,
      }));
    }
  };

  if (isLoading && notifications.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="p-4 rounded-lg border">
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => refetch()} />;
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-muted/30 rounded-full p-4 mb-4">
          <Bell className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          When you receive notifications, they will appear here. Check back
          later or refresh to see new notifications.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 mx-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Notifications</h2>
        {notifications.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isDeletingAll}
              >
                {isDeletingAll ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Clearing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Clear All</span>
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All notifications will be
                  permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeletingAll}
                >
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>

      {hasMore && (
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={loadMore}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading more...</span>
            </>
          ) : (
            <span>Load More</span>
          )}
        </Button>
      )}
    </div>
  );
}
