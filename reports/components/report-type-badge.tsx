import { Badge } from "@/components/ui/badge";
import { ReportType } from "../schema";
import { cn } from "@/lib/utils";

interface ReportTypeBadgeProps {
  type: ReportType;
  className?: string;
}

export function ReportTypeBadge({ type, className }: ReportTypeBadgeProps) {
  const getTypeConfig = (type: ReportType) => {
    switch (type) {
      case "SCAM":
        return {
          label: "Scam",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        };
      case "NOT_RELATED":
        return {
          label: "Not Related",
          className:
            "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
        };
      case "INAPPROPRIATE":
        return {
          label: "Inappropriate",
          className:
            "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
        };
      case "SPAM":
        return {
          label: "Spam",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
        };
      case "FAKE_PRODUCT":
        return {
          label: "Fake Product",
          className:
            "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
        };
      case "MISLEADING":
        return {
          label: "Misleading",
          className:
            "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
        };
      case "OTHER":
        return {
          label: "Other",
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
        };
      default:
        return {
          label: type,
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
        };
    }
  };

  const config = getTypeConfig(type);

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
