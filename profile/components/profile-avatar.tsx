"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/auth/shema";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  user: User | null;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function ProfileAvatar({
  user,
  className,
  size = "md",
}: ProfileAvatarProps) {
  if (!user) return null;

  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const getProfilePictureUrl = () => {
    if (user?.profilePictureUrl) {
      return user.profilePictureUrl;
    } else if (user?.telegram?.photoUrl) {
      return user.telegram.photoUrl;
    }
    return undefined;
  };

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage
        src={getProfilePictureUrl()}
        alt={`${user.firstName} ${user.lastName}`}
        className="object-cover"
      />
      <AvatarFallback className={cn(textSizeClasses[size])}>
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
}
