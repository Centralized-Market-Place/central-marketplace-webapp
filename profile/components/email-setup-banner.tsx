"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmailSetupBannerProps {
  onSetupClick: () => void;
}

export function EmailSetupBanner({ onSetupClick }: EmailSetupBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Alert className="relative mb-6">
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          Add an email address to your account to enable email/password login
          and receive important notifications.
        </div>
        <div className="flex items-center gap-4 ml-4">
          <Button variant="default" onClick={onSetupClick}>
            Add Email
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
