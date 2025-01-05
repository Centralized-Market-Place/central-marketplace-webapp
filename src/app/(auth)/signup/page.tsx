'use client';
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/lib/shemas/auth";
import { Register } from "@/domain/auth";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Register>({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: Register) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-[24rem]">
          <div>
            <label htmlFor="name" className="block text-gray-600 text-sm mb-2">
              Your Full Name
            </label>
            <div className="flex flex-col gap-1">
              <Input
                {...register("name")}
                type="text"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-gray-600 text-sm mb-2"
            >
              Username
            </label>
            <div className="flex flex-col gap-1">
              <Input
                {...register("username")}
                type="text"
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-600 text-sm mb-2"
            >
              Password
            </label>
            <div className="flex flex-col gap-1">
              <Input
                {...register("password")}
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
