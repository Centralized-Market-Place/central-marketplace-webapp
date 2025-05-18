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
import { PrivacySettingsFormValues } from "../client-schemas";
import { formDataToUpdateUserInfo } from "../utils";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Activity,
} from "lucide-react";

interface PrivacySettingsFormProps {
  user: User;
  isEditing: boolean;
  onSave: (updatedData: UpdateUserInfo) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PrivacySettingsForm({
  user,
  isEditing,
  onSave,
  onCancel,
  isLoading,
}: PrivacySettingsFormProps) {
  const [formData, setFormData] = useState<PrivacySettingsFormValues>({
    profileVisibility: user.privacySettings?.profileVisibility || "public",
    showEmail: user.privacySettings?.showEmail || false,
    showPhone: user.privacySettings?.showPhone || false,
    showLocation: user.privacySettings?.showLocation || false,
    showActivity: user.privacySettings?.showActivity || false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const updateData = formDataToUpdateUserInfo(formData, "privacySettings");
    onSave(updateData);
  };

  const PrivacyToggle = ({
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
              ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
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
          enabled ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
        }`}
      >
        {enabled ? (
          <>
            <Eye className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Visible</span>
          </>
        ) : (
          <>
            <EyeOff className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Hidden</span>
          </>
        )}
      </div>
    </div>
  );

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">
          Privacy Settings
        </h2>

        <div className="p-4 rounded-lg border border-border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">
            Profile Visibility
          </h3>
          <div className="mt-2 flex gap-4 items-center space-x-2">
            {formData.profileVisibility === "public" && (
              <>
                <div className="p-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <p className="text-green-600 dark:text-green-400 font-medium">
                  Public - Anyone can view
                </p>
              </>
            )}
            {formData.profileVisibility === "contacts" && (
              <>
                <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  Contacts Only - Only your contacts can view
                </p>
              </>
            )}
            {formData.profileVisibility === "private" && (
              <>
                <div className="p-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <p className="text-purple-600 dark:text-purple-400 font-medium">
                  Private - Only you can view
                </p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <PrivacyToggle
            enabled={formData.showEmail}
            label="Show Email"
            description="Allow others to see your email"
            icon={Mail}
          />

          <PrivacyToggle
            enabled={formData.showPhone}
            label="Show Phone"
            description="Allow others to see your phone number"
            icon={Phone}
          />

          <PrivacyToggle
            enabled={formData.showLocation}
            label="Show Location"
            description="Allow others to see your location"
            icon={MapPin}
          />

          <PrivacyToggle
            enabled={formData.showActivity}
            label="Show Activity"
            description="Allow others to see your online activity"
            icon={Activity}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">
        Edit Privacy Settings
      </h2>

      <div className="p-4 rounded-lg border border-border bg-card">
        <Label htmlFor="profileVisibility" className="font-medium">
          Profile Visibility
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Control who can see your profile information
        </p>
        <Select
          value={formData.profileVisibility}
          onValueChange={(value) => handleChange("profileVisibility", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public - Anyone can view</SelectItem>
            <SelectItem value="contacts">
              Contacts Only - Only your contacts can view
            </SelectItem>
            <SelectItem value="private">Private - Only you can view</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card transition-all hover:shadow">
          <div className="flex gap-4 items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                formData.showEmail
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="showEmail">Show Email</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to see your email
              </p>
            </div>
          </div>
          <Switch
            id="showEmail"
            checked={formData.showEmail}
            onCheckedChange={(checked: string | boolean) =>
              handleChange("showEmail", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card transition-all hover:shadow">
          <div className="flex gap-4 items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                formData.showPhone
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Phone className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="showPhone">Show Phone</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to see your phone number
              </p>
            </div>
          </div>
          <Switch
            id="showPhone"
            checked={formData.showPhone}
            onCheckedChange={(checked: string | boolean) =>
              handleChange("showPhone", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card transition-all hover:shadow">
          <div className="flex gap-4 items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                formData.showLocation
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <MapPin className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="showLocation">Show Location</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to see your location
              </p>
            </div>
          </div>
          <Switch
            id="showLocation"
            checked={formData.showLocation}
            onCheckedChange={(checked: string | boolean) =>
              handleChange("showLocation", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card transition-all hover:shadow">
          <div className="flex gap-4 items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                formData.showActivity
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Activity className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="showActivity">Show Activity</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to see your online activity
              </p>
            </div>
          </div>
          <Switch
            id="showActivity"
            checked={formData.showActivity}
            onCheckedChange={(checked: string | boolean) =>
              handleChange("showActivity", checked)
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
