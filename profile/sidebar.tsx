"use client";

import type { User } from "@/auth/shema";
import {
  UserIcon,
  Phone,
  MapPin,
  Bell,
  Shield,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { ProfileAvatar } from "./components/profile-avatar";
import { useAuthContext } from "@/providers/auth-context";

type CategoryType =
  | "personalInfo"
  | "contactInfo"
  | "locationInfo"
  | "communicationPreferences"
  | "privacySettings"
  | "verificationStatus";

interface SidebarProps {
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  user: User;
}

export function Sidebar({
  activeCategory,
  onCategoryChange,
  user,
}: SidebarProps) {
  const { logout } = useAuthContext();

  const categories = [
    {
      id: "personalInfo",
      label: "Personal Info",
      icon: <UserIcon className="h-5 w-5" />,
    },
    {
      id: "contactInfo",
      label: "Contact Info",
      icon: <Phone className="h-5 w-5" />,
    },
    {
      id: "locationInfo",
      label: "Location Info",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      id: "communicationPreferences",
      label: "Communication",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      id: "privacySettings",
      label: "Privacy Settings",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      id: "verificationStatus",
      label: "Verification",
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ];

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen">
      <div className="p-6 flex flex-col items-center">
        <ProfileAvatar user={user} size="xl" className="mb-2" />
        <div className="text-center">
          <p className="font-medium">Welcome,</p>
          <p className="font-bold">{user.firstName}</p>
        </div>
      </div>

      <div className="mt-6 px-4 py-2">
        <p className="text-xs uppercase font-semibold mb-2 px-4 text-sidebar-primary">
          Profile
        </p>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id as CategoryType)}
            className={`flex items-center w-full px-4 py-3 text-left text-sm rounded-md transition-colors ${
              activeCategory === category.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground"
            }`}
          >
            <span className="mr-3">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-sidebar-border">
        <button
          className="flex items-center w-full px-4 py-3 text-left text-sm hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground rounded-md transition-colors"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Log Out
        </button>
      </div>
    </div>
  );
}
