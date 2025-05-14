"use client";

import { Button } from "../ui/button";
import { Menu, Moon, Sun, User } from "lucide-react";
import Link from "next/link";
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


export function Header() {
  const { user, logout } = useAuthContext();
  const { setTheme, theme } = useTheme();
  const { toggleSidebar, isMobile } = useSidebar();

  const router = useRouter();

  return (
    <header className="border-b fixed top-0 w-full bg-white dark:bg-background z-50">
      <div className="container flex items-center justify-between h-16 px-4 md:ml-20">
        <div className="flex items-center gap-2">
          {isMobile && (
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
          <Link href="/" className="font-bold text-xl">
            Marketplace
          </Link>
        </div>

        <div className="flex items-center justify-end gap-4 md:gap-16">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{user.firstName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile")}>profile</DropdownMenuItem>
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
