"use client";

import type { User } from "@/auth/shema";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmailVerification } from "@/auth/hooks/useEmailVerification";
import { useState } from "react";
import LoadingIcon from "@/components/state/loading";
import { AxiosError } from "axios";

interface VerificationStatusFormProps {
  user: User;
}

export function VerificationStatusForm({ user }: VerificationStatusFormProps) {
  const { resendVerification, isResendingVerification } =
    useEmailVerification();
  const [message, setMessage] = useState("");

  const StatusBadge = ({ verified }: { verified: boolean }) => (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {verified ? (
        <>
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </>
      ) : (
        <>
          <XCircle className="w-3 h-3 mr-1" />
          Not Verified
        </>
      )}
    </div>
  );

  const handleResendVerification = () => {
    if (!user.email) return;

    setMessage("");
    resendVerification({
      data: { email: user.email as string },
      onSuccess: (res) => {
        setMessage(
          res?.message || "Verification email sent. Please check your inbox."
        );
      },
      onError: (err: Error) => {
        if (err instanceof AxiosError) {
          setMessage(
            err?.response?.data?.detail || "Error sending verification email."
          );
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Verification Status</h2>
      <p className="text-sm text-gray-500">
        Verification status can only be updated by administrators.
      </p>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b">
          <div>
            <h3 className="font-medium">Email Verification</h3>
            <p className="text-sm text-gray-500">
              {user.email || "No email provided"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge
              verified={user.verificationStatus?.emailVerified || false}
            />
            {!user.verificationStatus?.emailVerified && user.email && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendVerification}
                disabled={isResendingVerification}
              >
                {isResendingVerification ? (
                  <LoadingIcon className="w-4 h-4 mr-2" />
                ) : null}
                Resend Verification
              </Button>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center py-2 border-b">
          <div>
            <h3 className="font-medium">Phone Verification</h3>
            <p className="text-sm text-gray-500">
              {user.contactInfo?.phoneNumber || "No phone number"}
            </p>
          </div>
          <StatusBadge
            verified={user.verificationStatus?.phoneVerified || false}
          />
        </div>

        <div className="flex justify-between items-center py-2 border-b">
          <div>
            <h3 className="font-medium">Identity Verification</h3>
            <p className="text-sm text-gray-500">
              {user.verificationStatus?.verificationMethod ||
                "No verification method"}
            </p>
          </div>
          <StatusBadge
            verified={user.verificationStatus?.identityVerified || false}
          />
        </div>

        {user.verificationStatus?.verificationDate && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">
              Last Verification Date
            </h3>
            <p className="mt-1">
              {new Date(
                user.verificationStatus?.verificationDate || ""
              ).toLocaleDateString()}
            </p>
          </div>
        )}

        {message && (
          <div className="mt-4 p-3 rounded-md bg-blue-50 text-blue-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
