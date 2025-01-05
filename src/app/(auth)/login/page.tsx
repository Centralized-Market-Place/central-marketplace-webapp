import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Login</h1>
        <form className="space-y-6 w-[24rem]">
          <div>
            <label htmlFor="username" className="block text-gray-600 text-sm mb-2">
              Username
            </label>
            <Input id="username" type="text" placeholder="Enter your username" />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-600 text-sm mb-2">
              Password
            </label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Login</Button>
        </form>
      </div>
    </div>
  );
}
