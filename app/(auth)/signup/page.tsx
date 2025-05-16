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

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signUpLoading, signUpErrMsg } = useAuth();

  return (
    <main className="container m-16 max-w-md py-12 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{"SignUp"}</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm
            onSave={(userRegister: UserRegister) => {
              signUp({
                userRegister,
                onSuccess: () => {
                  router.push("/login");
                },
              });
            }}
            isLoading={signUpLoading}
            error={!!signUpErrMsg}
          />
          {signUpErrMsg && (
            <div className="mt-2 text-center text-red-600">{signUpErrMsg}</div>
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
