import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

type PriceRange = {
  label: string;
  min: number;
  max: number | null;
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
  setPendingMin: (val: string) => void;
  setPendingMax: (val: string) => void;
  PRICE_RANGES: PriceRange[];
  applyFilters: () => void;
  channels: { id: string; title?: string | null; username?: string | null }[];
  isChannelLoading: boolean;
  isChannelError: boolean;
  pendingChannels: string[];
  setPendingChannels: (val: string[]) => void;
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
  setPendingMin,
  setPendingMax,
  PRICE_RANGES,
  applyFilters,
  channels,
  isChannelLoading,
  isChannelError,
  pendingChannels,
  setPendingChannels,
}) => {
  const isMaxLessThanMin =
    pendingMin !== "" &&
    pendingMax !== "" &&
    Number(pendingMax) < Number(pendingMin);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isMaxLessThanMin) {
      applyFilters();
    }
  };

  const toggleChannel = (channelId: string) => {
    setPendingChannels(
      pendingChannels.includes(channelId)
        ? pendingChannels.filter(id => id !== channelId)
        : [...pendingChannels, channelId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
      <div className="space-y-4 flex-grow">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Category</h3>
          <Select value={pendingFilter} onValueChange={setPendingFilter}>
            <SelectTrigger className="w-full transition-all duration-300">
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
                  <SelectItem key={cat.id} value={cat.categoryName} className="transition-colors duration-200 hover:bg-blue-50">
                    {cat.categoryName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Channels</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {isChannelLoading && (
              <p className="text-sm text-gray-500">Loading channels...</p>
            )}
            {isChannelError && (
              <p className="text-sm text-red-500">Failed to load channels</p>
            )}
            {!isChannelLoading &&
              !isChannelError &&
              channels.map((channel) => (
                <label key={channel.id} className="flex items-center space-x-2 text-sm transition-all duration-200 hover:bg-blue-50 rounded px-2 py-1 cursor-pointer">
                  <Checkbox
                    id={channel.id}
                    checked={pendingChannels.includes(channel.id)}
                    onCheckedChange={() => toggleChannel(channel.id)}
                    className="transition duration-200 focus:ring-2 focus:ring-blue-400"
                  />
                  <Label htmlFor={channel.id} className="text-sm">
                    {channel.title || channel.username}
                  </Label>
                </label>
              ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Price Range</h3>
          <div className="space-y-2">
            {PRICE_RANGES.map((range) => {
              const isChecked = pendingPriceRanges.some((r) => r.label === range.label);
              return (
                <label key={range.label} className="flex items-center space-x-2 text-sm transition-all duration-200 hover:bg-blue-50 rounded px-2 py-1 cursor-pointer">
                  <Checkbox
                    id={range.label}
                    checked={isChecked}
                    onCheckedChange={() => togglePendingPriceRange(range)}
                    disabled={pendingMin !== "" || pendingMax !== ""}
                    className="transition duration-200 focus:ring-2 focus:ring-blue-400"
                  />
                  <Label htmlFor={range.label} className="text-sm">
                    {range.label}
                  </Label>
                </label>
              );
            })}
          </div>

          {/* Custom Price Range Inputs */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm text-gray-700">Custom Price Range</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="min-price" className="text-xs text-gray-600">Min Price (ETB)</Label>
                <Input
                  id="min-price"
                  type="number"
                  min="0"
                  placeholder="e.g. 200"
                  value={pendingMin}
                  onChange={(e) => setPendingMin(e.target.value)}
                  disabled={pendingPriceRanges.length > 0}
                  className="transition duration-200 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="max-price" className="text-xs text-gray-600">Max Price (ETB)</Label>
                <Input
                  id="max-price"
                  type="number"
                  min="0"
                  placeholder="e.g. 10000"
                  value={pendingMax}
                  onChange={(e) => setPendingMax(e.target.value)}
                  disabled={pendingPriceRanges.length > 0}
                  className="transition duration-200 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            {(pendingMin !== "" || pendingMax !== "") && !isMaxLessThanMin && (
              <p className="text-xs text-blue-600">
                Custom range: ETB {pendingMin || "0"} - {pendingMax || "∞"}
              </p>
            )}
            {isMaxLessThanMin && (
              <p className="text-xs text-red-600">
                Max price cannot be less than min price.
              </p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full mt-4 transition-colors duration-200" disabled={isMaxLessThanMin}>
        Apply Filters
      </Button>
    </form>
  );
};