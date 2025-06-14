"use client";

import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateReportDialog } from "./create-report-dialog";
import { ReportTarget } from "../schema";

interface ReportButtonProps {
  targetId: string;
  targetType: ReportTarget;
  targetTitle?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  showText?: boolean;
}

export function ReportButton({
  targetId,
  targetType,
  targetTitle,
  variant = "ghost",
  size = "sm",
  className,
  showText = true,
}: ReportButtonProps) {
  return (
    <CreateReportDialog
      targetId={targetId}
      targetType={targetType}
      targetTitle={targetTitle}
    >
      <Button variant={variant} size={size} className={className}>
        <Flag className={`h-4 w-4 ${showText ? "mr-2" : ""}`} />
        {showText && "Report"}
      </Button>
    </CreateReportDialog>
  );
}
