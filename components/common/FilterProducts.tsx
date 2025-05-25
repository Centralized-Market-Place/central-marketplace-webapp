import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React from "react";

type PriceRange = {
  label: string;
  min: number;
  max: number;
};

interface FilterContentProps {
  pendingFilter: string;
  setPendingFilter: (val: string) => void;
  isCategoryLoading: boolean;
  isCategoryError: boolean;
  categories: { id: string; categoryName: string }[];
  pendingPriceRanges: PriceRange[];
  togglePendingPriceRange: (range: PriceRange) => void;
  pendingMin: string;
  pendingMax: string;
  PRICE_RANGES: PriceRange[];
  applyFilters: () => void;
}

export const FilterContent: React.FC<FilterContentProps> = ({
  pendingFilter,
  setPendingFilter,
  isCategoryLoading,
  isCategoryError,
  categories,
  pendingPriceRanges,
  togglePendingPriceRange,
  pendingMin,
  pendingMax,
  PRICE_RANGES,
  applyFilters,
}) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Category</h3>
      <Select value={pendingFilter} onValueChange={setPendingFilter}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Products</SelectItem>
          {isCategoryLoading && (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          )}
          {isCategoryError && (
            <SelectItem value="error" disabled>
              Failed to load
            </SelectItem>
          )}
          {!isCategoryLoading &&
            !isCategoryError &&
            categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.categoryName}>
                {cat.categoryName}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Price Range</h3>
      <div className="space-y-2">
        {PRICE_RANGES.map((range) => {
          const isChecked = pendingPriceRanges.some((r) => r.label === range.label);
          return (
            <div key={range.label} className="flex items-center space-x-2">
              <Checkbox
                id={range.label}
                checked={isChecked}
                onCheckedChange={() => togglePendingPriceRange(range)}
                disabled={pendingMin !== "" || pendingMax !== ""}
              />
              <Label htmlFor={range.label} className="text-sm">
                {range.label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>

    <Button className="w-full mt-4" onClick={applyFilters}>
      Apply Filters
    </Button>
  </div>
);