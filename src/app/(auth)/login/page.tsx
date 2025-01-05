'use client';
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/lib/shemas/auth";
import { Login } from "@/domain/auth";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";


export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: yupResolver(loginSchema),
  });
  const login = useAuthStore(state => state.login);
  const loading = useAuthStore(state => state.loading);
  const { toast } = useToast();
  
  const onSubmit = async (data: Login) => {
    try {
        await login(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: `error occured: ${error}`,
          description: "Invalid credentials. Please try again.",
        });
      }
  };

  

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-[24rem]">
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
                placeholder="Enter your username"
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
              <Input {...register("password")} type="password" placeholder="Enter your password" />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
            {loading ? <Loader2 className="w-6 h-6 text-white" /> : "Login"}
          </Button>

          <p className="text-center text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-indigo-600">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
