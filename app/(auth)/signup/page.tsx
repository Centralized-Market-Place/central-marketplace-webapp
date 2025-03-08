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

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signUpLoading } = useAuth();

  return (
    <main className="container m-16 max-w-md py-12 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{"SignUp"}</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm
            onSave={(userRegister: UserRegister) => {
              console.log("user", userRegister);
              signUp({
                userRegister,
                onSuccess: () => {
                  router.push("/login");
                },
              });
            }}
            isLoading={signUpLoading}
          />
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => router.push("/login")}
          >
            {"Need an account? Register"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
