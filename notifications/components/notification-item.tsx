"use client";

import { Notification } from "../schema";
import { useNotificationAction } from "../hooks/use-notification-action";
import { formatDistanceToNow } from "date-fns";
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
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead, deleteNotification, isMarkingAsRead, isDeleting } =
    useNotificationAction(notification.id);
  const [isAttemptingDelete, setIsAttemptingDelete] = useState(false);

  const handleDelete = async () => {
    setIsAttemptingDelete(true);
    try {
      await deleteNotification();
    } finally {
      setIsAttemptingDelete(false);
    }
  };

  const handleMarkAsRead = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!notification.read) {
      markAsRead();
    }
  };

  return (
    <div
      className={cn(
        "group p-4 rounded-lg border transition-all",
        notification.read
          ? "bg-background hover:bg-muted/50"
          : "bg-primary/5 hover:bg-primary/10 border-primary/20"
      )}
      role="region"
      aria-label={`Notification: ${notification.content}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-start gap-3">
            {!notification.read && (
              <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            )}
            <div className="space-y-1 flex-1">
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  !notification.read && "font-medium"
                )}
              >
                {notification.content}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!notification.read && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMarkAsRead}
                    className="h-8 w-8 text-primary"
                    disabled={isMarkingAsRead}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mark as read</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete notification?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This notification will be
                  permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isAttemptingDelete || isDeleting}
                >
                  {isAttemptingDelete || isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
