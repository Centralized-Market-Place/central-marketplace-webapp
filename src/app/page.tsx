import React from "react";

export default function WelcomePage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-gray-100 via-white to-gray-50">
      <header className="row-start-1 text-center text-gray-700 text-sm sm:text-base">
        <p>Central Marketplace</p>
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-800">
          Welcome to Central Marketplace
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-md text-center sm:text-left">
          Your one-stop shop for finding the best deals, products, and services all in one place. Start exploring today!
        </p>
        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-lg">
          Get Started
        </button>
      </main>

      <footer className="row-start-3 text-center text-gray-500 text-xs sm:text-sm">
        <p>&copy; {new Date().getFullYear()} Central Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
}
