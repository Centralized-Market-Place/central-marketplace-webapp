"use client"

import { useState } from "react"
import type { User } from "@/auth/shema"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CommunicationPreferences } from "../schemas"

interface CommunicationPreferencesFormProps {
  user: User
  isEditing: boolean
  onSave: (updatedData: Partial<User>) => void
  onCancel: () => void
  isLoading?: boolean
}

export function CommunicationPreferencesForm({ user, isEditing, onSave, onCancel, isLoading }: CommunicationPreferencesFormProps) {
  const [formData, setFormData] = useState<CommunicationPreferences>({
    language: user.communicationPreferences?.language || "en",
    emailNotifications: user.communicationPreferences?.emailNotifications || false,
    smsNotifications: user.communicationPreferences?.smsNotifications || false,
    marketingEmails: user.communicationPreferences?.marketingEmails || false,
    notificationFrequency: user.communicationPreferences?.notificationFrequency || "daily",
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave({
      communicationPreferences: {
        ...user.communicationPreferences,
        language: formData.language,
        emailNotifications: formData.emailNotifications,
        smsNotifications: formData.smsNotifications,
        marketingEmails: formData.marketingEmails,
        notificationFrequency: formData.notificationFrequency,
      },
    })
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Communication Preferences</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Preferred Language</h3>
            <p className="mt-1">{formData.language}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Notification Frequency</h3>
            <p className="mt-1">{formData.notificationFrequency}</p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-gray-200 flex items-center px-0.5">
              <div
                className={`h-5 w-5 rounded-full transition-transform ${formData.emailNotifications ? "bg-blue-500 translate-x-5" : "bg-white"}`}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">SMS Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications via SMS</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-gray-200 flex items-center px-0.5">
              <div
                className={`h-5 w-5 rounded-full transition-transform ${formData.smsNotifications ? "bg-blue-500 translate-x-5" : "bg-white"}`}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Marketing Emails</h3>
              <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-gray-200 flex items-center px-0.5">
              <div
                className={`h-5 w-5 rounded-full transition-transform ${formData.marketingEmails ? "bg-blue-500 translate-x-5" : "bg-white"}`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Edit Communication Preferences</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="language">Preferred Language</Label>
          <Select value={formData.language} onValueChange={(value) => handleChange("language", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notificationFrequency">Notification Frequency</Label>
          <Select
            value={formData.notificationFrequency}
            onValueChange={(value) => handleChange("notificationFrequency", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
              <SelectItem value="weekly">Weekly Digest</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
          </div>
          <Switch
            id="emailNotifications"
            checked={formData.emailNotifications}
            onCheckedChange={(checked: string | boolean) => handleChange("emailNotifications", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="smsNotifications">SMS Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
          </div>
          <Switch
            id="smsNotifications"
            checked={formData.smsNotifications}
            onCheckedChange={(checked: string | boolean) => handleChange("smsNotifications", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketingEmails">Marketing Emails</Label>
            <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
          </div>
          <Switch
            id="marketingEmails"
            checked={formData.marketingEmails}
            onCheckedChange={(checked: string | boolean) => handleChange("marketingEmails", checked)}
          />
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
