"use client"

import type { User } from "@/auth/shema"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  UserIcon,
  Phone,
  MapPin,
  Bell,
  Shield,
  CheckCircle,
  LogOut,
} from "lucide-react"

type CategoryType =
  | "personalInfo"
  | "contactInfo"
  | "locationInfo"
  | "communicationPreferences"
  | "privacySettings"
  | "verificationStatus"

interface SidebarProps {
  activeCategory: CategoryType
  onCategoryChange: (category: CategoryType) => void
  user: User
}

export function Sidebar({ activeCategory, onCategoryChange, user }: SidebarProps) {
  const categories = [
    { id: "personalInfo", label: "Personal Info", icon: <UserIcon className="h-5 w-5" /> },
    { id: "contactInfo", label: "Contact Info", icon: <Phone className="h-5 w-5" /> },
    { id: "locationInfo", label: "Location Info", icon: <MapPin className="h-5 w-5" /> },
    { id: "communicationPreferences", label: "Communication", icon: <Bell className="h-5 w-5" /> },
    { id: "privacySettings", label: "Privacy Settings", icon: <Shield className="h-5 w-5" /> },
    { id: "verificationStatus", label: "Verification", icon: <CheckCircle className="h-5 w-5" /> },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="p-6 flex flex-col items-center">
        <Avatar className="h-20 w-20 mb-2 bg-blue-400">
          <AvatarImage src={user.personalInfo?.profilePicture || undefined} alt={`${user.firstName} ${user.lastName}`} />
          <AvatarFallback className="text-xl">{`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="font-medium">Welcome,</p>
          <p className="font-bold">{user.firstName}</p>
        </div>
      </div>

      <div className="mt-6 px-4 py-2">
        <p className="text-xs uppercase font-semibold mb-2 px-4 text-blue-200">Profile</p>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id as CategoryType)}
            className={`flex items-center w-full px-4 py-3 text-left text-sm rounded-md transition-colors ${
              activeCategory === category.id ? "bg-gray-400 text-black" : "hover:bg-gray-200 hover:text-black"
            }`}
          >
            <span className="mr-3">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-gray-600">
        <button className="flex items-center w-full px-4 py-3 text-left text-sm hover:bg-gray-200 hover:text-black rounded-md transition-colors">
          <LogOut className="h-5 w-5 mr-3" />
          Log Out
        </button>
      </div>
    </div>
  )
}
