"use client";

import { useState } from "react";
import ForgotPasswordForm from "@/passwordrest/componets/forgot-password-form";
import { usePasswordRest } from "@/passwordrest/hooks/usePasswordRest";
import { PasswordResetRequest } from "@/auth/shema";

export default function ForgotPasswordPage() {
  const { passwordResetRequestMutation } = usePasswordRest();
  const [message, setMessage] = useState("");

  const handleSave = (data: PasswordResetRequest) => {
    setMessage("");
    passwordResetRequestMutation.mutate(
      { email: data.email },
      {
        onSuccess: (res) => {
          setMessage(res.data.message || "Password reset email sent. Check your inbox.");
        },
        // suppress eslit any error
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        onError: (err: any) => {
          setMessage(err?.response?.data?.detail || "Error sending reset email.");
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
      <ForgotPasswordForm onSave={handleSave} isLoading={passwordResetRequestMutation.isPending} message={message} />
    </div>
  );
} 