import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  message: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon: Icon,
}) => (
  <div className="flex flex-col items-center justify-center py-20">
    {Icon && <Icon className="w-16 h-16 text-muted-foreground mb-4" />}
    <p className="text-lg text-muted-foreground">{message}</p>
  </div>
);

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <AlertTriangle className="size-4 text-destructive mb-4" />
    <p className="text-sm text-destructive mb-4">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} size={"sm"}>
        Retry
      </Button>
    )}
  </div>
);
