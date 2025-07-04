"use client";

import {
  BarChart3,
  Bell,
  BookMarked,
  CheckCircle,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { CustomSidebarTrigger } from "./sidebar-trigger";
import { useAuthContext } from "@/providers/auth-context";

export function AppSidebar() {
  const { state } = useSidebar();
  const { user } = useAuthContext();

  if (!user) {
    return null;
  }
  return (
    <Sidebar collapsible="icon" className="mt-16">
      <SidebarHeader className="flex flex-col items-start gap-4 px-4 pt-4">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Store className="size-5 text-primary-foreground" />
          </div>
          <span
            className={cn(
              "ml-2 text-lg font-semibold tracking-tight duration-300",
              state === "collapsed" && "opacity-0"
            )}
          >
            MarketPlace
          </span>
        </div>
        <CustomSidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel
            className={cn("px-2 py-1", state === "collapsed" && "sr-only")}
          >
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={state === "collapsed" ? "Marketplace" : undefined}
                >
                  <Link href="/">
                    <ShoppingBag className="size-5" />
                    <span
                      className={cn(
                        "ml-2 transition-opacity duration-200",
                        state === "collapsed" && "opacity-0 w-0 -ml-0"
                      )}
                    >
                      Marketplace
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={state === "collapsed" ? "Channels" : undefined}
                >
                  <Link href="/channels">
                    <MessageSquare className="size-5" />
                    <span
                      className={cn(
                        "ml-2 transition-opacity duration-200",
                        state === "collapsed" && "opacity-0 w-0 -ml-0"
                      )}
                    >
                      Channels
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={state === "collapsed" ? "Bookmarks" : undefined}
                >
                  <Link href="/bookmarks">
                    <BookMarked className="size-5" />
                    <span
                      className={cn(
                        "ml-2 transition-opacity duration-200",
                        state === "collapsed" && "opacity-0 w-0 -ml-0"
                      )}
                    >
                      Bookmarks
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={state === "collapsed" ? "Notifications" : undefined}
                >
                  <Link href="/notifications">
                    <Bell className="size-5" />
                    <span
                      className={cn(
                        "ml-2 transition-opacity duration-200",
                        state === "collapsed" && "opacity-0 w-0 -ml-0"
                      )}
                    >
                      Notifications
                    </span>
                    <span
                      className={cn(
                        "ml-auto bg-primary/15 text-primary rounded-full px-2 py-0.5 text-xs font-medium",
                        state === "collapsed" && "opacity-0 w-0"
                      )}
                    >
                      3
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={state === "collapsed" ? "Search" : undefined}
                >
                  <Link href="/search">
                    <Search className="size-5" />
                    <span
                      className={cn(
                        "ml-2 transition-opacity duration-200",
                        state === "collapsed" && "opacity-0 w-0 -ml-0"
                      )}
                    >
                      Search
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user.role === "SELLER" && (
          <SidebarGroup>
            <SidebarGroupLabel
              className={cn("px-2 py-1", state === "collapsed" && "sr-only")}
            >
              Seller
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={
                      state === "collapsed" ? "Seller Dashboard" : undefined
                    }
                  >
                    <Link href="/seller/dashboard">
                      <LayoutDashboard className="size-5" />
                      <span
                        className={cn(
                          "ml-2 transition-opacity duration-200",
                          state === "collapsed" && "opacity-0 w-0 -ml-0"
                        )}
                      >
                        Dashboard
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={state === "collapsed" ? "My Products" : undefined}
                  >
                    <Link href="/seller/products">
                      <Package className="size-5" />
                      <span
                        className={cn(
                          "ml-2 transition-opacity duration-200",
                          state === "collapsed" && "opacity-0 w-0 -ml-0"
                        )}
                      >
                        My Products
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={state === "collapsed" ? "Analytics" : undefined}
                  >
                    <Link href="/seller/analytics">
                      <BarChart3 className="size-5" />
                      <span
                        className={cn(
                          "ml-2 transition-opacity duration-200",
                          state === "collapsed" && "opacity-0 w-0 -ml-0"
                        )}
                      >
                        Analytics
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={
                      state === "collapsed" ? "Channel Management" : undefined
                    }
                  >
                    <Link href="/seller/channels">
                      <Zap className="size-5" />
                      <span
                        className={cn(
                          "ml-2 transition-opacity duration-200",
                          state === "collapsed" && "opacity-0 w-0 -ml-0"
                        )}
                      >
                        Channel Management
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={state === "collapsed" ? "Verification" : undefined}
                  >
                    <Link href="/seller/verification">
                      <CheckCircle className="size-5" />
                      <span
                        className={cn(
                          "ml-2 transition-opacity duration-200",
                          state === "collapsed" && "opacity-0 w-0 -ml-0"
                        )}
                      >
                        Verification
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {user.role === "ADMIN" && (
          <SidebarGroup>
            <SidebarGroupLabel
              className={cn("px-2 py-1", state === "collapsed" && "sr-only")}
            >
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={
                      state === "collapsed" ? "Admin Dashboard" : undefined
                    }
                  >
                    <Link href="/admin/dashboard">
                      <ShieldCheck className="size-5" />
                      <span
                        className={cn(
                          "ml-2 transition-opacity duration-200",
                          state === "collapsed" && "opacity-0 w-0 -ml-0"
                        )}
                      >
                        Admin Dashboard
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={
                      state === "collapsed"
                        ? "Verification Requests"
                        : undefined
                    }
                  >
                    <Link href="/admin/verification-requests">
                      <CheckCircle className="size-5" />
                      <span
                        className={cn(
                          "ml-2 transition-opacity duration-200",
                          state === "collapsed" && "opacity-0 w-0 -ml-0"
                        )}
                      >
                        Verification Requests
                      </span>
                      <span
                        className={cn(
                          "ml-auto bg-primary/15 text-primary rounded-full px-2 py-0.5 text-xs font-medium",
                          state === "collapsed" && "opacity-0 w-0"
                        )}
                      >
                        5
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={
                      state === "collapsed" ? "User Management" : undefined
                    }
                  >
                    <Link href="/admin/users">
                      <Users className="size-5" />
                      <span
                        className={cn(
                          "ml-2 transition-opacity duration-200",
                          state === "collapsed" && "opacity-0 w-0 -ml-0"
                        )}
                      >
                        User Management
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={
                      state === "collapsed" ? "Channel Management" : undefined
                    }
                  >
                    <Link href="/admin/channels">
                      <MessageSquare className="size-5" />
                      <span
                        className={cn(
                          "ml-2 transition-opacity duration-200",
                          state === "collapsed" && "opacity-0 w-0 -ml-0"
                        )}
                      >
                        Channel Management
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={state === "collapsed" ? "Reports" : undefined}
                  >
                    <a href="/admin/reports">
                      <FileText className="size-5" />
                      <span
                        className={cn(
                          "ml-2 transition-opacity duration-200",
                          state === "collapsed" && "opacity-0 w-0 -ml-0"
                        )}
                      >
                        Reports
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={state === "collapsed" ? "Settings" : undefined}
                >
                  <a href="/settings">
                    <Settings className="size-5" />
                    <span
                      className={cn(
                        "ml-2 transition-opacity duration-200",
                        state === "collapsed" && "opacity-0 w-0 -ml-0"
                      )}
                    >
                      Settings
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <div className="flex items-center justify-center">
          <span
            className={cn(
              "text-xs text-muted-foreground transition-opacity duration-200",
              state === "collapsed" && "opacity-0"
            )}
          >
            MarketPlace v1.0
          </span>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
