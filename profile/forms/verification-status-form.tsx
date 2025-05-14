"use client";

import type { User } from "@/auth/shema";
import { CheckCircle, XCircle } from "lucide-react";

interface VerificationStatusFormProps {
  user: User;
}

export function VerificationStatusForm({ user }: VerificationStatusFormProps) {
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
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <StatusBadge verified={user.verificationStatus?.emailVerified || false} />
        </div>

        <div className="flex justify-between items-center py-2 border-b">
          <div>
            <h3 className="font-medium">Phone Verification</h3>
            <p className="text-sm text-gray-500">
              {user.contactInfo?.phoneNumber || "No phone number"}
            </p>
          </div>
          <StatusBadge verified={user.verificationStatus?.phoneVerified || false} />
        </div>

        <div className="flex justify-between items-center py-2 border-b">
          <div>
            <h3 className="font-medium">Identity Verification</h3>
            <p className="text-sm text-gray-500">
              {user.verificationStatus?.verificationMethod ||
                "No verification method"}
            </p>
          </div>
          <StatusBadge verified={user.verificationStatus?.identityVerified || false} />
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
      </div>
    </div>
  );
}
