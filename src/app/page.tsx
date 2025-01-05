import { Button } from "@/components/ui/button";
import React from "react";
import Link from 'next/link';

export default function WelcomePage() {

  return (
    <div className="min-h-screen grid grid-rows-[20px_1fr_20px] items-center justify-items-center">

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-800">
          Welcome to Central Marketplace
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-md text-center sm:text-left">
          Your one-stop shop for finding the best deals, products, and services all in one place. Start exploring today!
        </p>
        <Button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-lg">
          <Link href="/home">Get Started</Link>
        </Button>
      </main>

      <footer className="row-start-3 text-center text-gray-500 text-xs sm:text-sm">
        <p>&copy; {new Date().getFullYear()} Central Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
}
