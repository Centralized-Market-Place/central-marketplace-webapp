import { Badge } from "@/components/ui/badge";
import { ReportStatus } from "../schema";
import { cn } from "@/lib/utils";

interface ReportStatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

export function ReportStatusBadge({
  status,
  className,
}: ReportStatusBadgeProps) {
  const getStatusConfig = (status: ReportStatus) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Pending",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
        };
      case "UNDER_REVIEW":
        return {
          label: "Under Review",
          className:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
        };
      case "APPROVED":
        return {
          label: "Approved",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        };
      case "REJECTED":
        return {
          label: "Rejected",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        };
      default:
        return {
          label: status,
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={cn(config.className, className)}>{config.label}</Badge>
  );
}
