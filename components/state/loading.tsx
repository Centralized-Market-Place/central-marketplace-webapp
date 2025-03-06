import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

const LoadingIcon = ({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Loader2
        className={cn("h-8 w-8 animate-spin text-blue-900", className)}
      />
      {message && (
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
};

export default LoadingIcon;
