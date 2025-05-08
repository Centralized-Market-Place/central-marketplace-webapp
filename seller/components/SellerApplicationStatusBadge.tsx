import { cn } from "@/lib/utils";
import { SellerApplicationStatus } from "../schema";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface SellerApplicationStatusBadgeProps {
  status: SellerApplicationStatus;
  className?: string;
}

export function SellerApplicationStatusBadge({
  status,
  className,
}: SellerApplicationStatusBadgeProps) {
  // Define badge styles based on status
  const config = {
    PENDING: {
      icon: Clock,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200",
      label: "Pending Review",
    },
    APPROVED: {
      icon: CheckCircle,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-200",
      label: "Approved",
    },
    REJECTED: {
      icon: AlertCircle,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-200",
      label: "Rejected",
    },
  };

  const { icon: Icon, bgColor, textColor, borderColor, label } = config[status];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border",
        bgColor,
        textColor,
        borderColor,
        className
      )}
    >
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </div>
  );
}
