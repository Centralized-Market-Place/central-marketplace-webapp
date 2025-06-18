import { X } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface FilterChipsProps {
  activeFilters: {
    search?: string;
    category: string;
    priceRange: string;
    customPrice: string;
    channels: string;
  };
  onRemoveFilter: (
    filterType:
      | "search"
      | "category"
      | "priceRange"
      | "customPrice"
      | "channels"
  ) => void;
  onClearAll?: () => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  activeFilters,
  onRemoveFilter,
  onClearAll,
}) => {
  const chipVariants = {
    initial: { opacity: 0, y: -10, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.9 },
  };

  const activeFilterCount = Object.values(activeFilters).filter(
    (filter) => filter
  ).length;

  const hasActiveFilters = activeFilterCount > 0;
  const hasMultipleFilters = activeFilterCount > 1;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <AnimatePresence>
        {activeFilters.search && (
          <motion.div
            layout
            variants={chipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <Badge variant="secondary" className="flex items-center gap-1">
              {activeFilters.search}
              <button
                onClick={() => onRemoveFilter("search")}
                className="rounded-full hover:bg-gray-200/50 p-0.5"
                aria-label="Remove search filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </motion.div>
        )}
        {activeFilters.category && (
          <motion.div
            layout
            variants={chipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <Badge variant="secondary" className="flex items-center gap-1">
              {activeFilters.category}
              <button
                onClick={() => onRemoveFilter("category")}
                className="rounded-full hover:bg-gray-200/50 p-0.5"
                aria-label="Remove category filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </motion.div>
        )}
        {activeFilters.channels && (
          <motion.div
            layout
            variants={chipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <Badge variant="secondary" className="flex items-center gap-1">
              {activeFilters.channels}
              <button
                onClick={() => onRemoveFilter("channels")}
                className="rounded-full hover:bg-gray-200/50 p-0.5"
                aria-label="Remove channels filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </motion.div>
        )}
        {activeFilters.priceRange && (
          <motion.div
            layout
            variants={chipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <Badge variant="secondary" className="flex items-center gap-1">
              {activeFilters.priceRange}
              <button
                onClick={() => onRemoveFilter("priceRange")}
                className="rounded-full hover:bg-gray-200/50 p-0.5"
                aria-label="Remove price range filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </motion.div>
        )}
        {activeFilters.customPrice && (
          <motion.div
            layout
            variants={chipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <Badge variant="secondary" className="flex items-center gap-1">
              {activeFilters.customPrice}
              <button
                onClick={() => onRemoveFilter("customPrice")}
                className="rounded-full hover:bg-gray-200/50 p-0.5"
                aria-label="Remove custom price filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </motion.div>
        )}

        {/* Clear All Filters chip - only show when there are multiple filters */}
        {hasMultipleFilters && onClearAll && (
          <motion.div
            layout
            variants={chipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={onClearAll}
            >
              Clear All
              <X className="h-3 w-3" />
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
