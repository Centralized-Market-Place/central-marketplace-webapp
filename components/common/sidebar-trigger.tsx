"use client";
import { PanelLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CustomSidebarTrigger() {
  const { state, toggleSidebar } = useSidebar();

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuButton
            onClick={toggleSidebar}
            className="w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground transition-colors"
          >
            <PanelLeft
              className={cn(
                "size-5 transition-transform duration-200",
                state === "collapsed" && "rotate-180"
              )}
            />
            <span
              className={cn(
                "ml-2 transition-opacity duration-200",
                state === "collapsed" && "opacity-0 w-0 -ml-0"
              )}
            >
              {state === "expanded" ? "Collapse Sidebar" : "Expand Sidebar"}
            </span>
          </SidebarMenuButton>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed"}
        >
          {state === "collapsed" ? "Expand Sidebar" : "Close Sidebar"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
