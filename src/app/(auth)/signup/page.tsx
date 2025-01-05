import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Signup() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Sign Up</h1>
        <form className="space-y-6 w-[24rem]">
          <div>
            <label htmlFor="name" className="block text-gray-600 text-sm mb-2">
              Your Full Name
            </label>
            <Input id="name" type="text" placeholder="Enter your full name" />
          </div>
          <div>
            <label htmlFor="username" className="block text-gray-600 text-sm mb-2">
              Username
            </label>
            <Input id="username" type="text" placeholder="Choose a username" />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-600 text-sm mb-2">
              Password
            </label>
            <Input id="password" type="password" placeholder="Create a password" />
          </div>
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Sign Up</Button>
        </form>
      </div>
    </div>
  );
}
