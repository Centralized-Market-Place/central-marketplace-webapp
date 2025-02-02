"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

const menuItems = [
  { title: "Home", url: "#", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
];

export default function AppSidebar() {
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon" className="mt-6 pt-8 bg-gray-100 dark:bg-gray-900 shadow-md">
        <div className="flex justify-center bg-gray-100 dark:bg-gray-900">
          <SidebarTrigger className="text-pink-500 text-3xl font-bold" />
        </div>
        <SidebarContent className="pt-2 bg-gray-100 dark:bg-gray-900">
          <SidebarGroup>
            <SidebarGroupLabel>Central Marketplace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon size={20} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
