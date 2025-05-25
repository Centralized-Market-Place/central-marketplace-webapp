"use client";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/password-reset/componets/reset-password-form";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      <ResetPasswordForm token={token} />
    </div>
  );
}
