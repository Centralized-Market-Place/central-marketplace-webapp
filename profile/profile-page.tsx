"use client";

import { useState } from "react";
import { Sidebar } from "@/profile/sidebar";
import { PersonalInfoForm } from "@/profile/forms/personal-info-form";
import { ContactInfoForm } from "@/profile/forms/contact-info-form";
import { LocationInfoForm } from "@/profile/forms/location-info-form";
import { CommunicationPreferencesForm } from "@/profile/forms/communication-preferences-form";
import { PrivacySettingsForm } from "@/profile/forms/privacy-settings-form";
import { VerificationStatusForm } from "@/profile/forms/verification-status-form";
import { useAuthContext } from "@/providers/auth-context";
import { useProfileUpdate } from "@/profile/hooks/useProfileUpdate";
import { UpdateUserInfo } from "./schemas";
import { User } from "@/auth/shema";

type CategoryType =
  | "personalInfo"
  | "contactInfo"
  | "locationInfo"
  | "communicationPreferences"
  | "privacySettings"
  | "verificationStatus";

export function ProfilePage() {
  const { user, setUser } = useAuthContext();
  const [activeCategory, setActiveCategory] =
    useState<CategoryType>("personalInfo");
  const [isEditing, setIsEditing] = useState(false);
  const { updateProfile, isLoading } = useProfileUpdate();

  if (!user) return null;

  const handleUpdateUser = (updatedData: UpdateUserInfo) => {
    updateProfile({
      data: updatedData,
      onSuccess: (data: User) => {
        console.log("Profile updated successfully:", data);
        setIsEditing(false);
        setUser(data);
      },
      onError: (error) => {
        console.error("Error updating profile:", error);
      },
    });
  };

  const renderForm = () => {
    switch (activeCategory) {
      case "personalInfo":
        return (
          <PersonalInfoForm
            user={user}
            isEditing={isEditing}
            onSave={handleUpdateUser}
            onCancel={() => setIsEditing(false)}
            isLoading={isLoading}
          />
        );
      case "contactInfo":
        return (
          <ContactInfoForm
            user={user}
            isEditing={isEditing}
            onSave={handleUpdateUser}
            onCancel={() => setIsEditing(false)}
            isLoading={isLoading}
          />
        );
      case "locationInfo":
        return (
          <LocationInfoForm
            user={user}
            isEditing={isEditing}
            onSave={handleUpdateUser}
            onCancel={() => setIsEditing(false)}
            isLoading={isLoading}
          />
        );
      case "communicationPreferences":
        return (
          <CommunicationPreferencesForm
            user={user}
            isEditing={isEditing}
            onSave={handleUpdateUser}
            onCancel={() => setIsEditing(false)}
            isLoading={isLoading}
          />
        );
      case "privacySettings":
        return (
          <PrivacySettingsForm
            user={user}
            isEditing={isEditing}
            onSave={handleUpdateUser}
            onCancel={() => setIsEditing(false)}
            isLoading={isLoading}
          />
        );
      case "verificationStatus":
        return <VerificationStatusForm user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gray-200">
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={(category) => {
          setActiveCategory(category);
          setIsEditing(false); // Reset editing state when changing categories
        }}
        user={user}
      />
      <main className="flex-1 mt-16 border-l border-gray-200">
        <div className="max-w-4xl mx-auto rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">
                Your Profile Information
              </h1>
              {!isEditing && activeCategory !== "verificationStatus" && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-200 hover:text-black transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
            {renderForm()}
          </div>
        </div>
      </main>
    </div>
  );
}
