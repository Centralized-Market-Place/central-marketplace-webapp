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

export default function LoginPage() {
  const router = useRouter();
  const { login, loginLoading, loginErrMsg } = useAuth();

  return (
    <main className="container max-w-md mt-16 py-12 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{"Login"}</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm
            onSave={(userLogin: UserLogin) => {
              login({
                userLogin,
                onSuccess: () => {
                  console.log("onSuccess");
                },
              });
            }}
            isLoading={loginLoading}
          />
          {loginErrMsg && (
            <div className="mt-2 text-center text-red-600">{loginErrMsg}</div>
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
