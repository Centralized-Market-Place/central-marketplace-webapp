"use client";

import {
  BookMarked,
  FileText,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  Zap,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Image from "next/image";
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
import { NotificationBell } from "@/notifications/components/notification-bell";
import { UserRole } from "@/auth/shema";

const menuButtonHoverClass =
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground transition-colors";

export function AppSidebar() {
  const { state } = useSidebar();
  const { user } = useAuthContext();

  if (!user) {
    return null;
  }
  return (
    <Sidebar collapsible="icon" className="mt-16">
      <SidebarHeader className="flex flex-col items-start gap-4 px-4 pt-4 border-b border-sidebar-border pb-4">
        <div className="flex items-center">
          <div className="flex h-7 w-7 items-center justify-center">
            <Image
              src="/dark-theme-icon.png"
              alt="Marketplace"
              width={28}
              height={28}
              className="h-7 w-auto hidden dark:block"
              priority
            />
            <Image
              src="/light-theme-icon.png"
              alt="Marketplace"
              width={28}
              height={28}
              className="h-7 w-auto block dark:hidden"
              priority
            />
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
                  className={menuButtonHoverClass}
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
                  className={menuButtonHoverClass}
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
                  className={menuButtonHoverClass}
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
                  className={menuButtonHoverClass}
                >
                  <Link href="/notifications">
                    <NotificationBell />
                    <span
                      className={cn(
                        "ml-2 transition-opacity duration-200",
                        state === "collapsed" && "opacity-0 w-0 -ml-0"
                      )}
                    >
                      Notifications
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={state === "collapsed" ? "Search" : undefined}
                  className={menuButtonHoverClass}
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

              {user.role !== UserRole.Enum.ADMIN &&
                user.role !== UserRole.Enum.SUPER_ADMIN && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip={
                        state === "collapsed"
                          ? user?.role === "SELLER"
                            ? "Register your Channel"
                            : "Become a Seller"
                          : undefined
                      }
                      className={menuButtonHoverClass}
                    >
                      <Link href="/seller/apply">
                        <Store className="size-5" />
                        <span
                          className={cn(
                            "ml-2 transition-opacity duration-200",
                            state === "collapsed" && "opacity-0 w-0 -ml-0"
                          )}
                        >
                          {user?.role === "SELLER"
                            ? "Register your Channel"
                            : "Become a Seller"}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

              {user.role !== UserRole.Enum.ADMIN &&
                user.role !== UserRole.Enum.SUPER_ADMIN && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip={
                        state === "collapsed" ? "My Applications" : undefined
                      }
                      className={menuButtonHoverClass}
                    >
                      <Link href="/seller/applications">
                        <FileText className="size-5" />
                        <span
                          className={cn(
                            "ml-2 transition-opacity duration-200",
                            state === "collapsed" && "opacity-0 w-0 -ml-0"
                          )}
                        >
                          My Applications
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user.role === UserRole.Enum.SELLER && (
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
                    className={menuButtonHoverClass}
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
                    className={menuButtonHoverClass}
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
                    tooltip={
                      state === "collapsed" ? "Channel Management" : undefined
                    }
                    className={menuButtonHoverClass}
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {(user.role === UserRole.Enum.ADMIN ||
          user.role === UserRole.Enum.SUPER_ADMIN) && (
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
                    className={menuButtonHoverClass}
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
                      state === "collapsed" ? "Content Moderation" : undefined
                    }
                    className={menuButtonHoverClass}
                  >
                    <Link href="/admin/reports">
                      <AlertTriangle className="size-5" />
                      <span
                        className={cn(
                          "ml-2 transition-opacity duration-200",
                          state === "collapsed" && "opacity-0 w-0 -ml-0"
                        )}
                      >
                        Content Moderation
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={
                      state === "collapsed" ? "Seller Applications" : undefined
                    }
                    className={menuButtonHoverClass}
                  >
                    <Link href="/admin/seller-applications">
                      <Store className="size-5" />
                      <span
                        className={cn(
                          "ml-2 transition-opacity duration-200",
                          state === "collapsed" && "opacity-0 w-0 -ml-0"
                        )}
                      >
                        Seller Applications
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {user.role === UserRole.Enum.SUPER_ADMIN && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip={
                          state === "collapsed" ? "User Management" : undefined
                        }
                        className={menuButtonHoverClass}
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
                          state === "collapsed" ? "Admin Invites" : undefined
                        }
                        className={menuButtonHoverClass}
                      >
                        <Link href="/admin/invites">
                          <Mail className="size-5" />
                          <span
                            className={cn(
                              "ml-2 transition-opacity duration-200",
                              state === "collapsed" && "opacity-0 w-0 -ml-0"
                            )}
                          >
                            Admin Invites
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
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
                  className={menuButtonHoverClass}
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
