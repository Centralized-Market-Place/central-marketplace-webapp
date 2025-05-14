"use client"

import { useState } from "react"
import type { User } from "@/auth/shema"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle } from "lucide-react"

interface VerificationStatusFormProps {
  user: User
  isEditing: boolean
  onSave: (updatedData: Partial<User>) => void
  onCancel: () => void
  isLoading?: boolean
}

export function VerificationStatusForm({ user, isEditing, onSave, onCancel, isLoading }: VerificationStatusFormProps) {
  const [formData, setFormData] = useState({
    emailVerified: user.verificationStatus.emailVerified,
    phoneVerified: user.verificationStatus.phoneVerified,
    identityVerified: user.verificationStatus.identityVerified,
    verificationMethod: user.verificationStatus.verificationMethod,
    verificationDate: user.verificationStatus.verificationDate,
  })

  const handleChange = (field: string, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave({
      verificationStatus: {
        ...user.verificationStatus,
        emailVerified: formData.emailVerified,
        phoneVerified: formData.phoneVerified,
        identityVerified: formData.identityVerified,
        verificationMethod: formData.verificationMethod,
        verificationDate: formData.verificationDate,
      },
    })
  }

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
  )

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Verification Status</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <h3 className="font-medium">Email Verification</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <StatusBadge verified={user.verificationStatus.emailVerified} />
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <h3 className="font-medium">Phone Verification</h3>
              <p className="text-sm text-gray-500">{user.contactInfo.phoneNumber || "No phone number"}</p>
            </div>
            <StatusBadge verified={user.verificationStatus.phoneVerified} />
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <h3 className="font-medium">Identity Verification</h3>
              <p className="text-sm text-gray-500">
                {user.verificationStatus.verificationMethod || "No verification method"}
              </p>
            </div>
            <StatusBadge verified={user.verificationStatus.identityVerified} />
          </div>

          {user.verificationStatus.verificationDate && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">Last Verification Date</h3>
              <p className="mt-1">{new Date(user.verificationStatus.verificationDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Edit Verification Status</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <h3 className="font-medium">Email Verification</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleChange("emailVerified", !formData.emailVerified)}>
            {formData.emailVerified ? "Mark as Unverified" : "Verify Email"}
          </Button>
        </div>

        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <h3 className="font-medium">Phone Verification</h3>
            <p className="text-sm text-gray-500">{user.contactInfo.phoneNumber || "No phone number"}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={!user.contactInfo.phoneNumber}
            onClick={() => handleChange("phoneVerified", !formData.phoneVerified)}
          >
            {formData.phoneVerified ? "Mark as Unverified" : "Verify Phone"}
          </Button>
        </div>

        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <h3 className="font-medium">Identity Verification</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleChange("identityVerified", !formData.identityVerified)}
          >
            {formData.identityVerified ? "Mark as Unverified" : "Verify Identity"}
          </Button>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="verificationMethod">Verification Method</Label>
          <Select
            value={formData.verificationMethod || ""}
            onValueChange={(value) => handleChange("verificationMethod", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id_card">ID Card</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="drivers_license">Driver's License</SelectItem>
              <SelectItem value="social_security">Social Security</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>Save Changes</Button>
      </div>
    </div>
  )
}
