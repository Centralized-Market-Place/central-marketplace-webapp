"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEmailVerification } from "@/auth/hooks/useEmailVerification";
import { Button } from "@/components/ui/button";
import LoadingIcon from "@/components/state/loading";


export default function VerifyEmailPage() {
  const { verifyEmailMutation } = useEmailVerification();
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();
  
  const verifyEmail = async () => {
    return verifyEmailMutation.mutate({ token },
      {
        onSuccess: (res) => {
          setMessage(res.data?.message || "Email verified successfully!");
          setTimeout(() => router.push("/profile"), 20000);
        },
        onError: (err) => {
          setMessage(err instanceof Error ? err.message : "Error verifying email.");
        }
      }
    );
  };
 
  

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Email Verification</h2>
      <div className="text-center">
        {verifyEmailMutation.isPending ? (
          <div className="flex items-center justify-center space-x-2">
            <LoadingIcon className="w-4 h-4" />
            <span>Verifying your email...</span>
          </div>
        ) : (
          <>
          <button 
          onClick={verifyEmail}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Verify Email
          </button>

          {message.includes("expired token") && (
            <div className="flex  flex-col items-center justify-center space-x-2 space-y-2">
            <p className="mb-4 text-red-500 mt-4">Token expired. Please request a new verification email.
            </p>
            <Button onClick={() => {router.prefetch("/profile"); router.push("/profile")}} >
              Return to Profile
            </Button>
            </div>
          )}  
          {message.includes("Email already verified") && (
            <div className="flex  flex-col items-center justify-center space-x-2 space-y-2">
            <p className="mb-4 text-green-500 mt-4">Email already verified.
            </p>
            <Button onClick={() => {router.prefetch("/"); router.push("/")}} >
              Return to Home
            </Button>
            </div>
          )}
          {message.includes("Email verified successfully") && (
            <div className="flex  flex-col items-center justify-center space-x-2 space-y-2">
            <p className="mb-4 text-green-500 mt-4">Email verified successfully.
            </p>
            <Button onClick={() => {router.prefetch("/"); router.push("/")}} >    
              Return to Home
            </Button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
} 