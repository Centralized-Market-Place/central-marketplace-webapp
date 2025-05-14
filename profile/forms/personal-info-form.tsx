"use client"

import { useState } from "react"
import type { User } from "@/auth/shema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Upload } from "lucide-react"

interface PersonalInfoFormProps {
  user: User
  isEditing: boolean
  onSave: (updatedData: Partial<User>) => void
  onCancel: () => void
  isLoading?: boolean
}

export function PersonalInfoForm({ user, isEditing, onSave, onCancel, isLoading }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.personalInfo.dateOfBirth,
    gender: user.personalInfo.gender,
    nationality: user.personalInfo.nationality,
    profilePicture: user.personalInfo.profilePicture,
    bio: user.personalInfo.bio,
  })

  const handleChange = (field: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave({
      firstName: formData.firstName,
      lastName: formData.lastName,
      personalInfo: {
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        nationality: formData.nationality,
        profilePicture: formData.profilePicture,
        bio: formData.bio,
      },
    })
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={user.personalInfo.profilePicture || undefined}
              alt={`${user.firstName} ${user.lastName}`}
            />
            <AvatarFallback className="text-xl">{`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">First Name</h3>
            <p className="mt-1">{user.firstName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
            <p className="mt-1">{user.lastName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
            <p className="mt-1">{user.personalInfo.dateOfBirth || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Gender</h3>
            <p className="mt-1">{user.personalInfo.gender || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nationality</h3>
            <p className="mt-1">{user.personalInfo.nationality || "Not specified"}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Bio</h3>
          <p className="mt-1 whitespace-pre-line">{user.personalInfo.bio || "No bio provided"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={formData.profilePicture || undefined}
              alt={`${formData.firstName} ${formData.lastName}`}
            />
            <AvatarFallback className="text-xl">{`${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
            <Upload className="h-4 w-4" />
            <span className="sr-only">Upload profile picture</span>
          </Button>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Edit Personal Information</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateOfBirth ? format(new Date(formData.dateOfBirth), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                onSelect={(date: Date | undefined) => handleChange("dateOfBirth", date ? date.toISOString() : null)}
                initialFocus
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender || ""} onValueChange={(value) => handleChange("gender", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            value={formData.nationality || ""}
            onChange={(e) => handleChange("nationality", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={formData.bio || ""} onChange={(e) => handleChange("bio", e.target.value)} rows={4} />
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
