"use client";

import { Button } from "../ui/button";
import { Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useAuthContext } from "@/providers/auth-context";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { NotificationBell } from "@/notifications/components/notification-bell";
import { ProfileAvatar } from "@/profile/components/profile-avatar";

export function Header() {
  const { user, logout } = useAuthContext();
  const { setTheme, theme } = useTheme();
  const { toggleSidebar, isMobile } = useSidebar();

  const router = useRouter();

  return (
    <header className="border-b fixed top-0 w-full bg-white dark:bg-background z-50">
      <div className="container flex items-center justify-between h-16 px-4 md:ml-10">
        <div className="flex items-center gap-2">
          {isMobile && user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          <Link href="/" className="font-bold text-xl flex items-center">
            <Image
              src="/central_marketplace_dark_theme_icon.png"
              alt="Marketplace"
              width={120}
              height={40}
              className="h-8 w-auto hidden dark:block"
              priority
            />
            <Image
              src="/central_marketplace_light_theme_icon.png"
              alt="Marketplace"
              width={120}
              height={40}
              className="h-8 w-auto block dark:hidden"
              priority
            />
          </Link>
        </div>

        <div className="flex items-center justify-end gap-4 md:gap-6">
          {user && <NotificationBell />}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ProfileAvatar user={user} size="sm" />
                  <span className="hidden sm:inline">{user.firstName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className="cursor-pointer"
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="mr-2 md:mr-4"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
