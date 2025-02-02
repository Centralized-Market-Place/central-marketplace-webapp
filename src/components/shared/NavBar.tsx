"use client";

import { useState } from "react";
import { Bell, Flame, Search, Zap, Sun, Moon, Menu } from "lucide-react";
import Image from "next/image";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "../ui/button";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <nav className="w-full flex items-center justify-between bg-gray-100 dark:bg-gray-900 p-2 shadow-md fixed top-0 z-50 dark:border-b dark:border-b-gray-800 border-b-0">
      <div className=" items-center space-x-2 hidden md:flex">
        <Image src="/market.png" alt="Logo" width={32} height={32} className="rounded-md" />
        <span className="text-gray-900 dark:text-white text-lg font-semibold">Ethio Marketplace</span>
      </div>

      <div className="relative w-full max-w-md md:w-1/2">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={18} />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 rounded-md pl-10 pr-16 py-2 focus:outline-none focus:ring-1 focus:ring-gray-600"
        />
        <div className="absolute inset-y-0 right-2 flex items-center space-x-1">
          <span className="text-xs text-gray-400 bg-gray-300 dark:bg-gray-600 px-1 rounded">Ctrl</span>
          <span className="text-xs text-gray-400 bg-gray-300 dark:bg-gray-600 px-1 rounded">K</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <Bell className="text-gray-900 dark:text-white cursor-pointer hidden md:block" size={20} />
        <div className=" items-center space-x-1 hidden md:flex">
          <Flame className="text-red-500" size={20} />
          <span className="text-gray-900 dark:text-white text-sm">1</span>
        </div>
        <div className=" items-center space-x-1 hidden md:flex">
          <Zap className="text-purple-500" size={20} />
          <span className="text-gray-900 dark:text-white text-sm">10</span>
        </div>

        <Image
          src="/profile.png"
          alt="Profile"
          width={32}
          height={32}
          className="rounded-lg hidden md:block"
        />

        <Button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white md:hidden"
        >
          <Menu size={20} />
        </Button>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={toggleSidebar}>
          </div>
        </div>
      )}
    </nav>
  );
}
