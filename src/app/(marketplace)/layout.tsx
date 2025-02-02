"use client";

import { useEffect } from "react";
import Navbar from "@/components/shared/NavBar";
import AppSidebar from "@/components/shared/SideBar";
import { useThemeStore } from "@/stores/themeStore";

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const setDarkMode = useThemeStore((state) => state.setDarkMode);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
    }
  }, [setDarkMode]);

  return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <header className="mb-10">
          <Navbar />
        </header>
        <div className="flex">
            <section className="mt-10">
              <AppSidebar />
            </section>

          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
  );
}
