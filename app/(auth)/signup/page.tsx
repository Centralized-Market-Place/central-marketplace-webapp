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
import { useAuth } from "@/auth/hooks/useAuth";
import { UserRegister } from "@/auth/shema";
import SignUpForm from "@/auth/compenents/signup-form";
import TelegramLoginButton from "@/auth/compenents/telegram-auth-button";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signUpLoading } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignUp = async (userRegister: UserRegister) => {
    setErrorMsg(null);
    try {
      const data = await signUp.mutateAsync({ userRegister });
      if (data.status === 200) {
        router.push("/login");
      } else if (data.status === 409) {
        setErrorMsg("A user with this email already exists.");
      } else {
        setErrorMsg("An error occurred. Please try again.");
      }
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : "An error occurred. Please try again.");
    }
  };

  return (
    <main className="container m-16 max-w-md py-12 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{"SignUp"}</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm
            onSave={handleSignUp}
            isLoading={signUpLoading}
            error={!!errorMsg}
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
            onClick={() => router.push("/login")}
          >
            {"Have an account? Login"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
