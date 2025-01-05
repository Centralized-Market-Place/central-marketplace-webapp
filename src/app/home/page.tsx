// app/home/page.tsx
'use client';
import React from "react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function HomePage() {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Welcome, {user?.name}</h1>
          <Button
            variant="ghost"
            onClick={logout}
            className="text-gray-600 hover:text-gray-800"
          >
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Search and find anything
          </h2>
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Type to search..."
                className="w-full pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}