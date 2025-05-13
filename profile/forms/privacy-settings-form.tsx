"use client"

import { useState } from "react"
import type { User } from "@/auth/shema"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface PrivacySettingsFormProps {
  user: User
  isEditing: boolean
  onSave: (updatedData: Partial<User>) => void
  onCancel: () => void
}

export function PrivacySettingsForm({ user, isEditing, onSave, onCancel }: PrivacySettingsFormProps) {
  const [formData, setFormData] = useState({
    profileVisibility: user.privacySettings.profileVisibility,
    showEmail: user.privacySettings.showEmail,
    showPhone: user.privacySettings.showPhone,
    showLocation: user.privacySettings.showLocation,
    showActivity: user.privacySettings.showActivity,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave({
      privacySettings: {
        ...user.privacySettings,
        profileVisibility: formData.profileVisibility,
        showEmail: formData.showEmail,
        showPhone: formData.showPhone,
        showLocation: formData.showLocation,
        showActivity: formData.showActivity,
      },
    })
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Privacy Settings</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Profile Visibility</h3>
            <p className="mt-1">{formData.profileVisibility}</p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Show Email</h3>
              <p className="text-sm text-gray-500">Allow others to see your email</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-gray-200 flex items-center px-0.5">
              <div
                className={`h-5 w-5 rounded-full transition-transform ${formData.showEmail ? "bg-blue-500 translate-x-5" : "bg-white"}`}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Show Phone</h3>
              <p className="text-sm text-gray-500">Allow others to see your phone number</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-gray-200 flex items-center px-0.5">
              <div
                className={`h-5 w-5 rounded-full transition-transform ${formData.showPhone ? "bg-blue-500 translate-x-5" : "bg-white"}`}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Show Location</h3>
              <p className="text-sm text-gray-500">Allow others to see your location</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-gray-200 flex items-center px-0.5">
              <div
                className={`h-5 w-5 rounded-full transition-transform ${formData.showLocation ? "bg-blue-500 translate-x-5" : "bg-white"}`}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Show Activity</h3>
              <p className="text-sm text-gray-500">Allow others to see your online activity</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-gray-200 flex items-center px-0.5">
              <div
                className={`h-5 w-5 rounded-full transition-transform ${formData.showActivity ? "bg-blue-500 translate-x-5" : "bg-white"}`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Edit Privacy Settings</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profileVisibility">Profile Visibility</Label>
          <Select
            value={formData.profileVisibility}
            onValueChange={(value) => handleChange("profileVisibility", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public - Anyone can view</SelectItem>
              <SelectItem value="contacts">Contacts Only - Only your contacts can view</SelectItem>
              <SelectItem value="private">Private - Only you can view</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showEmail">Show Email</Label>
            <p className="text-sm text-muted-foreground">Allow others to see your email</p>
          </div>
          <Switch
            id="showEmail"
            checked={formData.showEmail}
            onCheckedChange={(checked: string | boolean) => handleChange("showEmail", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showPhone">Show Phone</Label>
            <p className="text-sm text-muted-foreground">Allow others to see your phone number</p>
          </div>
          <Switch
            id="showPhone"
            checked={formData.showPhone}
            onCheckedChange={(checked: string | boolean) => handleChange("showPhone", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showLocation">Show Location</Label>
            <p className="text-sm text-muted-foreground">Allow others to see your location</p>
          </div>
          <Switch
            id="showLocation"
            checked={formData.showLocation}
            onCheckedChange={(checked: string | boolean) => handleChange("showLocation", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showActivity">Show Activity</Label>
            <p className="text-sm text-muted-foreground">Allow others to see your online activity</p>
          </div>
          <Switch
            id="showActivity"
            checked={formData.showActivity}
            onCheckedChange={(checked: string | boolean) => handleChange("showActivity", checked)}
          />
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
