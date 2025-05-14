"use client"

import { useState } from "react"
import type { User } from "@/auth/shema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LocationInfoFormProps {
  user: User
  isEditing: boolean
  onSave: (updatedData: Partial<User>) => void
  onCancel: () => void
  isLoading?: boolean
}

export function LocationInfoForm({ user, isEditing, onSave, onCancel, isLoading }: LocationInfoFormProps) {
  const [formData, setFormData] = useState({
    country: user.locationInfo.country,
    city: user.locationInfo.city,
    address: user.locationInfo.address,
    postalCode: user.locationInfo.postalCode,
    timezone: user.locationInfo.timezone,
  })

  const handleChange = (field: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave({
      locationInfo: {
        ...user.locationInfo,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        postalCode: formData.postalCode,
        timezone: formData.timezone,
      },
    })
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Location Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Country</h3>
            <p className="mt-1">{user.locationInfo.country || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">City</h3>
            <p className="mt-1">{user.locationInfo.city || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="mt-1">{user.locationInfo.address || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Postal Code</h3>
            <p className="mt-1">{user.locationInfo.postalCode || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Timezone</h3>
            <p className="mt-1">{user.locationInfo.timezone || "Not specified"}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Edit Location Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select value={formData.country || ""} onValueChange={(value) => handleChange("country", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="fr">France</SelectItem>
              <SelectItem value="jp">Japan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={formData.city || ""} onChange={(e) => handleChange("city", e.target.value)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            value={formData.postalCode || ""}
            onChange={(e) => handleChange("postalCode", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={formData.timezone || ""} onValueChange={(value) => handleChange("timezone", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
              <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
              <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
              <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
              <SelectItem value="UTC+0">Greenwich Mean Time (UTC+0)</SelectItem>
              <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
              <SelectItem value="UTC+8">China Standard Time (UTC+8)</SelectItem>
              <SelectItem value="UTC+9">Japan Standard Time (UTC+9)</SelectItem>
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
