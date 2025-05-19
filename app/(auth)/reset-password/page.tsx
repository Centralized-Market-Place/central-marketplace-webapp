"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/passwordrest/componets/reset-password-form";
import { usePasswordRest } from "@/passwordrest/hooks/usePasswordRest";
import { PasswordResetConfirm } from "@/auth/shema";

export default function ResetPasswordPage() {
  const { passwordResetConfirmMutation } = usePasswordRest();
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();

  const handleSave = (data: PasswordResetConfirm) => {
    setMessage("");
    passwordResetConfirmMutation.mutate(
      { token: data.token, new_password: data.new_password },
      {
        onSuccess: (res) => {
          setMessage(res.data.message || "Password has been reset successfully.");
          setTimeout(() => router.push("/login"), 2000);
        },
        onError: (err: any) => {
          setMessage(err?.response?.data?.detail || "Error resetting password.");
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      <ResetPasswordForm onSave={handleSave} isLoading={passwordResetConfirmMutation.isPending} message={message} token={token} />
    </div>
  );
} 