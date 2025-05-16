"use client";

import { useNotifications } from "../hooks/use-notifications";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className }: NotificationBadgeProps) {
  const { unreadCount, isLoading } = useNotifications();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("relative", className)}
            asChild
          >
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && !isLoading && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center rounded-full px-[5px] text-[10px] font-semibold"
                  variant="destructive"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "No new notifications"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
