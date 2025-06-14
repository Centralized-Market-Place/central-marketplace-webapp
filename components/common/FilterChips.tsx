import { X } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface FilterChipsProps {
  activeFilters: {
    category: string;
    priceRange: string;
    customPrice: string;
    channels: string;
  };
  onRemoveFilter: (filterType: "category" | "priceRange" | "customPrice" | "channels") => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  activeFilters,
  onRemoveFilter,
}) => {
  const chipVariants = {
    initial: { opacity: 0, y: -10, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.9 },
  };

  const hasActiveFilters = Object.values(activeFilters).some((filter) => filter);

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
}; 