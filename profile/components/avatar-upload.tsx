"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Trash2 } from "lucide-react";
import { useFileUpload } from "@/files/hooks/useFileUpload";
import { SignedUrlResponse } from "@/files/schema";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const avatarSizeClass = {
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

interface AvatarUploadProps {
  currentImageUrl: string | null | undefined;
  firstName: string;
  lastName: string;
  onImageUploaded: (url: string | null) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function AvatarUpload({
  currentImageUrl,
  firstName,
  lastName,
  onImageUploaded,
  size = "md",
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getSignedUrl, uploadToCloudinary, validateFile } = useFileUpload();

  const buttonSizeClass = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-9 w-9",
    xl: "h-10 w-10",
  };

  const iconSizeClass = {
    xs: "h-2 w-2",
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-5 w-5",
  };

  const buttonPositionClass = {
    xs: "-right-1 -bottom-1",
    sm: "-right-1.5 -bottom-1.5",
    md: "-right-2 -bottom-2",
    lg: "-right-2.5 -bottom-2.5",
    xl: "-right-3 -bottom-3",
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadProfileImage(file);
  };

  const uploadProfileImage = async (file: File) => {
    setError(null);

    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setIsUploading(true);

    try {
      getSignedUrl({
        signedUrlRequest: {
          fileType: file.type.split("/")[1],
          folder: "profile-pictures",
        },
        onSuccess: async (signedUrlData: SignedUrlResponse) => {
          try {
            const fileUrl = await uploadToCloudinary(file, signedUrlData);
            onImageUploaded(fileUrl);
            setIsUploading(false);
          } catch (err: unknown) {
            console.error("Upload error:", err);
            setError(
              err instanceof Error
                ? err.message
                : "Failed to upload profile picture. Please try again."
            );
            setIsUploading(false);
          }
        },
        onError: () => {
          setError("Failed to get upload URL. Please try again.");
          setIsUploading(false);
        },
      });
    } catch (err: unknown) {
      console.error("Processing error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onImageUploaded(null);
  };

  return (
    <div className="relative inline-block">
      <Avatar className={cn(avatarSizeClass[size])}>
        <AvatarImage
          src={currentImageUrl || undefined}
          alt={`${firstName} ${lastName}`}
          className="object-cover"
        />
        <AvatarFallback className={cn(textSizeClasses[size])}>
          {`${firstName.charAt(0)}${lastName.charAt(0)}`}
        </AvatarFallback>
      </Avatar>

      {isUploading ? (
        <div
          className={cn(
            "absolute rounded-full flex items-center justify-center shadow-sm",
            buttonSizeClass[size],
            buttonPositionClass[size],
            "bg-background border border-input"
          )}
        >
          <Loader2
            className={cn(iconSizeClass[size], "animate-spin text-foreground")}
          />
        </div>
      ) : (
        <div className={cn("absolute flex gap-1.5", buttonPositionClass[size])}>
          {currentImageUrl && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    className={cn(
                      "rounded-full shadow-sm",
                      buttonSizeClass[size]
                    )}
                    onClick={handleRemoveImage}
                    type="button"
                  >
                    <Trash2 className={iconSizeClass[size]} />
                    <span className="sr-only">Remove profile picture</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove profile picture</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <input
            id="avatar-upload"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleFileChange}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-full shadow-sm",
                    buttonSizeClass[size]
                  )}
                  onClick={() =>
                    document.getElementById("avatar-upload")?.click()
                  }
                  type="button"
                >
                  <Upload className={iconSizeClass[size]} />
                  <span className="sr-only">Upload profile picture</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload profile picture</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {error && <div className="mt-2 text-xs text-destructive">{error}</div>}
    </div>
  );
}
