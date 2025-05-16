"use client";

import { useState } from "react";
import type { User } from "@/auth/shema";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UpdateUserInfo } from "../schemas";
import { CommunicationPreferencesFormValues } from "../client-schemas";
import { formDataToUpdateUserInfo } from "../utils";
import {
  CheckCircle,
  BellRing,
  BellOff,
  Mail,
  MessageSquare,
} from "lucide-react";

interface CommunicationPreferencesFormProps {
  user: User;
  isEditing: boolean;
  onSave: (updatedData: UpdateUserInfo) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CommunicationPreferencesForm({
  user,
  isEditing,
  onSave,
  onCancel,
  isLoading,
}: CommunicationPreferencesFormProps) {
  const [formData, setFormData] = useState<CommunicationPreferencesFormValues>({
    language: user.communicationPreferences?.language || "en",
    emailNotifications:
      user.communicationPreferences?.emailNotifications || false,
    smsNotifications: user.communicationPreferences?.smsNotifications || false,
    marketingEmails: user.communicationPreferences?.marketingEmails || false,
    notificationFrequency:
      user.communicationPreferences?.notificationFrequency || "daily",
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const updateData = formDataToUpdateUserInfo(
      formData,
      "communicationPreferences"
    );
    onSave(updateData);
  };

  const NotificationIndicator = ({
    enabled,
    label,
    description,
    icon: Icon,
  }: {
    enabled: boolean;
    label: string;
    description: string;
    icon: React.ElementType;
  }) => (
    <div className="flex justify-between items-center p-3 rounded-lg border border-border bg-card shadow-sm hover:shadow transition-all">
      <div className="flex gap-4 items-center space-x-3">
        <div
          className={`p-2 rounded-full ${
            enabled
              ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">{label}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div
        className={`flex items-center ${
          enabled
            ? "text-green-600 dark:text-green-400"
            : "text-muted-foreground"
        }`}
      >
        {enabled ? (
          <>
            <CheckCircle className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Enabled</span>
          </>
        ) : (
          <span className="text-sm font-medium">Disabled</span>
        )}
      </div>
    </div>
  );

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">
          Communication Preferences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Preferred Language
            </h3>
            <p className="mt-1 text-foreground">{formData.language}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Notification Frequency
            </h3>
            <p className="mt-1 text-foreground">
              {formData.notificationFrequency}
            </p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <NotificationIndicator
            enabled={formData.emailNotifications}
            label="Email Notifications"
            description="Receive notifications via email"
            icon={Mail}
          />

          <NotificationIndicator
            enabled={formData.smsNotifications}
            label="SMS Notifications"
            description="Receive notifications via SMS"
            icon={MessageSquare}
          />

          <NotificationIndicator
            enabled={formData.marketingEmails}
            label="Marketing Emails"
            description="Receive marketing and promotional emails"
            icon={formData.marketingEmails ? BellRing : BellOff}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">
        Edit Communication Preferences
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="language">Preferred Language</Label>
          <Select
            value={formData.language}
            onValueChange={(value) => handleChange("language", value)}
          >
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
            onValueChange={(value) =>
              handleChange("notificationFrequency", value)
            }
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
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card transition-all hover:shadow">
          <div className="flex gap-4 items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                formData.emailNotifications
                  ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
          </div>
          <Switch
            id="emailNotifications"
            checked={formData.emailNotifications}
            onCheckedChange={(checked: string | boolean) =>
              handleChange("emailNotifications", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card transition-all hover:shadow">
          <div className="flex gap-4 items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                formData.smsNotifications
                  ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via SMS
              </p>
            </div>
          </div>
          <Switch
            id="smsNotifications"
            checked={formData.smsNotifications}
            onCheckedChange={(checked: string | boolean) =>
              handleChange("smsNotifications", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card transition-all hover:shadow">
          <div className="flex gap-4 items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                formData.marketingEmails
                  ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {formData.marketingEmails ? (
                <BellRing className="h-5 w-5" />
              ) : (
                <BellOff className="h-5 w-5" />
              )}
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="marketingEmails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive marketing and promotional emails
              </p>
            </div>
          </div>
          <Switch
            id="marketingEmails"
            checked={formData.marketingEmails}
            onCheckedChange={(checked: string | boolean) =>
              handleChange("marketingEmails", checked)
            }
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
