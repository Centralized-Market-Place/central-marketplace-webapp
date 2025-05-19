"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDescriptionProps {
  description: string | null | undefined;
  className?: string;
  maxLength?: number;
  maxHeightWhenExpanded?: string;
}

export function ProductDescription({
  description,
  className = "",
  maxLength = 280,
  maxHeightWhenExpanded = "max-h-40",
}: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description || description.length <= maxLength) {
    return (
      <div className={className}>
        <p className="text-muted-foreground">
          {description || "No description available"}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={`relative ${
          isExpanded
            ? `${maxHeightWhenExpanded} overflow-y-auto pr-2`
            : "line-clamp-6"
        }`}
      >
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-xs mt-1 h-6 px-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <>
            <ChevronUp size={14} />
            <span>Show less</span>
          </>
        ) : (
          <>
            <ChevronDown size={14} />
            <span>Show more</span>
          </>
        )}
      </Button>
    </div>
  );
}
