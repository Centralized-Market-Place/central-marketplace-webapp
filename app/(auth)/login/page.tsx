"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/auth/compenents/login-form";
import { useAuth } from "@/auth/hooks/useAuth";
import { UserLogin } from "@/auth/shema";
import TelegramLoginButton from "@/auth/compenents/telegram-auth-button";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginLoading } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  return (
    <main className="container max-w-md mt-16 py-12 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{"Login"}</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm
            onSave={async (userLogin: UserLogin) => {
              try {
                const data = await login.mutateAsync({ userLogin, })
                    if (data?.status === 200) {
                      router.push("/");
                    } else if (data?.status === 400) {
                      setErrorMsg("Invalid credentials");
                    }
                  } catch (error) {
                    setErrorMsg("An error occurred. Please try again.");
                }
            }}
            isLoading={loginLoading}
          />
           {errorMsg && (
            <div className="mt-2 text-center text-red-600">{errorMsg}</div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <TelegramLoginButton />
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => router.push("/signup")}
          >
            {"Need an account? Register"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
