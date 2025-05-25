"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordSetupForm } from "@/profile/components/password-setup-form";
import { useRouter } from "next/navigation";
import { useEmailVerification } from "@/auth/hooks/useEmailVerification";
import LoadingIcon from "@/components/state/loading";
import { AxiosError } from "axios";

export default function TelegramEmailSetupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [isVerified, setIsVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const { verifyEmail, isVerifyingEmail } = useEmailVerification();

  const handleVerifyEmail = async () => {
    if (!token) return;

    return verifyEmail({
      data: { token },
      onSuccess: () => {
        setVerificationMessage("Email verified successfully!");
        setIsVerified(true);
      },
      onError: (err) => {
        setVerificationMessage(
          err instanceof AxiosError
            ? err.response?.data?.detail
            : "Error verifying email."
        );
      },
    });
  };

  if (!token) {
    return (
      <div className="container max-w-lg py-10">
        <Card>
          <CardHeader>
            <CardTitle>Invalid Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This verification link is invalid or has expired. Please request a
              new verification email.
            </p>
            <Button onClick={() => router.push("/settings")} className="mt-4">
              Return to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="container mx-auto max-w-lg py-10">
        <Card>
          <CardHeader>
            <CardTitle>Verify Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isVerifyingEmail ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingIcon className="w-4 h-4" />
                <span>Verifying your email...</span>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Click the button below to verify your email address.
                </p>
                <Button onClick={handleVerifyEmail} disabled={isVerifyingEmail}>
                  Verify Email
                </Button>

                {verificationMessage && (
                  <p
                    className={`mt-4 ${
                      verificationMessage.includes("Error")
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {verificationMessage}
                  </p>
                )}

                {verificationMessage.includes("expired") && (
                  <Button
                    onClick={() => router.push("/settings")}
                    variant="outline"
                    className="mt-2"
                  >
                    Return to Profile
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg py-10">
      <Card>
        <CardHeader>
          <CardTitle>Set Up Password</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordSetupForm
            token={token}
            onSuccess={() => {
              router.push("/settings");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
