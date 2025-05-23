"use client";

import ForgotPasswordForm from "@/password-reset/componets/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
      <ForgotPasswordForm />
    </div>
  );
}
