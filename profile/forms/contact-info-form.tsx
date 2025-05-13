"use client"

import { useState } from "react"
import type { User } from "@/auth/shema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContactInfoFormProps {
  user: User
  isEditing: boolean
  onSave: (updatedData: Partial<User>) => void
  onCancel: () => void
}

export function ContactInfoForm({ user, isEditing, onSave, onCancel }: ContactInfoFormProps) {
  const [formData, setFormData] = useState({
    phoneNumber: user.contactInfo.phoneNumber,
    alternativeEmail: user.contactInfo.alternativeEmail,
    preferredContactMethod: user.contactInfo.preferredContactMethod,
  })

  const handleChange = (field: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave({
      contactInfo: {
        ...user.contactInfo,
        phoneNumber: formData.phoneNumber,
        alternativeEmail: formData.alternativeEmail,
        preferredContactMethod: formData.preferredContactMethod,
      },
    })
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Contact Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1">{user.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Alternative Email</h3>
            <p className="mt-1">{user.contactInfo.alternativeEmail || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
            <p className="mt-1">{user.contactInfo.phoneNumber || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Preferred Contact Method</h3>
            <p className="mt-1">{user.contactInfo.preferredContactMethod || "Not specified"}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Edit Contact Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email (Primary)</Label>
          <Input id="email" value={user.email} disabled className="bg-gray-50" />
          <p className="text-xs text-gray-500">Primary email cannot be changed here</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="alternativeEmail">Alternative Email</Label>
          <Input
            id="alternativeEmail"
            type="email"
            value={formData.alternativeEmail || ""}
            onChange={(e) => handleChange("alternativeEmail", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
          <Select
            value={formData.preferredContactMethod || ""}
            onValueChange={(value) => handleChange("preferredContactMethod", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select preferred method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save Changes</Button>
      </div>
    </div>
  )
}
