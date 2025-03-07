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

export default function LoginPage() {
  const router = useRouter();
  const { login, loginLoading } = useAuth();

  return (
    <main className="container max-w-md py-12 mx-auto">
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
                  router.push("/signup");
                },
              });
            }}
            isLoading={loginLoading}
          />
        </CardContent>
        <CardFooter>
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
