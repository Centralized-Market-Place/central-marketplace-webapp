import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState } from "react";

type PriceRange = {
  label: string;
  min: number;
  max: number | null;
};

// Grouped state interfaces for better maintainability
interface CategoryState {
  pending: string[];
  setPending: (val: string[]) => void;
  isLoading: boolean;
  isError: boolean;
  hierarchy: Record<string, string[]>;
}

interface PriceState {
  pendingRanges: PriceRange[];
  toggleRange: (range: PriceRange) => void;
  pendingMin: string;
  pendingMax: string;
  setPendingMin: (val: string) => void;
  setPendingMax: (val: string) => void;
  availableRanges: PriceRange[];
}

interface FilterContentProps {
  categoryState: CategoryState;
  priceState: PriceState;
  onApplyFilters: () => void;
}

export const FilterContent: React.FC<FilterContentProps> = ({
  categoryState,
  priceState,
  onApplyFilters,
}) => {
  // Initialize expanded categories based on current selection
  const getInitialExpandedCategories = () => {
    const expanded = new Set<string>();
    
    // If any subcategories are selected, expand their parents
    categoryState.pending.forEach(selectedCategory => {
      Object.entries(categoryState.hierarchy).forEach(([parentCategory, subcategories]) => {
        if (subcategories.includes(selectedCategory)) {
          expanded.add(parentCategory);
        }
      });
    });
    
    return expanded;
  };

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => 
    getInitialExpandedCategories()
  );
  
  // Update expanded categories when pending categories or hierarchy changes
  React.useEffect(() => {
    categoryState.pending.forEach(selectedCategory => {
      Object.entries(categoryState.hierarchy).forEach(([parentCategory, subcategories]) => {
        if (subcategories.includes(selectedCategory)) {
          setExpandedCategories(prev => new Set([...prev, parentCategory]));
        }
      });
    });
  }, [categoryState.pending, categoryState.hierarchy]);
  
  const isMaxLessThanMin =
    priceState.pendingMin !== "" &&
    priceState.pendingMax !== "" &&
    Number(priceState.pendingMax) < Number(priceState.pendingMin);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isMaxLessThanMin) {
      onApplyFilters();
    }
  };

  const toggleCategoryExpansion = (parentCategory: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(parentCategory)) {
      newExpanded.delete(parentCategory);
    } else {
      newExpanded.add(parentCategory);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategorySelect = (category: string) => {
    const isSelected = categoryState.pending.includes(category);
    
    if (isSelected) {
      // Remove category from selection
      categoryState.setPending(categoryState.pending.filter(cat => cat !== category));
    } else {
      // Add category to selection
      categoryState.setPending([...categoryState.pending, category]);
      
      // If selecting a subcategory, ensure its parent remains expanded
      Object.entries(categoryState.hierarchy).forEach(([parentCategory, subcategories]) => {
        if (subcategories.includes(category)) {
          setExpandedCategories(prev => new Set([...prev, parentCategory]));
        }
      });
    }
  };

  const clearAllCategories = () => {
    categoryState.setPending([]);
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Filters
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Categories Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">
                Categories
              </h3>
              {categoryState.pending.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllCategories}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  Clear All ({categoryState.pending.length})
                </button>
              )}
            </div>
            
            {categoryState.isLoading && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading categories...</p>
            )}
            {categoryState.isError && (
              <p className="text-sm text-red-500 dark:text-red-400">Failed to load categories</p>
            )}
            
            {!categoryState.isLoading && !categoryState.isError && (
              <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {/* Hierarchical categories */}
                {Object.entries(categoryState.hierarchy).map(([parentCategory, subcategories]) => (
                  <div key={parentCategory} className="space-y-1">
                    {/* Parent category */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => toggleCategoryExpansion(parentCategory)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200 flex-shrink-0"
                      >
                        {expandedCategories.has(parentCategory) ? (
                          <ChevronDown className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <ChevronRight className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                        )}
                      </button>
                      <label className="flex items-center space-x-2 text-sm transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded px-2 py-1 cursor-pointer flex-1 min-w-0">
                        <Checkbox
                          checked={categoryState.pending.includes(parentCategory)}
                          onCheckedChange={() => handleCategorySelect(parentCategory)}
                          className="transition duration-200 focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                        />
                        <span className="font-medium capitalize text-gray-900 dark:text-gray-100 truncate">
                          {parentCategory}
                        </span>
                      </label>
                    </div>
                    
                    {/* Subcategories */}
                    {expandedCategories.has(parentCategory) && (
                      <div className="ml-6 space-y-1">
                        {subcategories.map((subcategory) => (
                          <label key={subcategory} className="flex items-center space-x-2 text-sm transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded px-2 py-1 cursor-pointer min-w-0">
                            <Checkbox
                              checked={categoryState.pending.includes(subcategory)}
                              onCheckedChange={() => handleCategorySelect(subcategory)}
                              className="transition duration-200 focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                            />
                            <span className="capitalize text-gray-700 dark:text-gray-300 truncate">
                              {subcategory}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">
              Price Range
            </h3>
            <div className="space-y-2 max-h-40 sm:max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {priceState.availableRanges.map((range) => {
                const isChecked = priceState.pendingRanges.some((r) => r.label === range.label);
                
                const handleRangeToggle = () => {
                  // Clear custom price inputs when selecting a predefined range
                  if (!isChecked) {
                    priceState.setPendingMin("");
                    priceState.setPendingMax("");
                  }
                  priceState.toggleRange(range);
                };
                
                return (
                  <label key={range.label} className="flex items-center space-x-2 text-sm transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded px-2 py-1 cursor-pointer min-w-0">
                    <Checkbox
                      id={range.label}
                      checked={isChecked}
                      onCheckedChange={handleRangeToggle}
                      className="transition duration-200 focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                    />
                    <Label htmlFor={range.label} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer truncate">
                      {range.label}
                    </Label>
                  </label>
                );
              })}
            </div>

            {/* Custom Price Range Inputs */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                Custom Price Range
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="min-price" className="text-xs text-gray-600 dark:text-gray-400">
                    Min Price (ETB)
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    min="0"
                    placeholder="e.g. 200"
                    value={priceState.pendingMin}
                    onChange={(e) => {
                      // Clear predefined ranges when typing custom price
                      if (priceState.pendingRanges.length > 0) {
                        priceState.pendingRanges.forEach(range => priceState.toggleRange(range));
                      }
                      priceState.setPendingMin(e.target.value);
                    }}
                    className="transition duration-200 focus:ring-2 focus:ring-blue-400 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="max-price" className="text-xs text-gray-600 dark:text-gray-400">
                    Max Price (ETB)
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    min="0"
                    placeholder="e.g. 10000"
                    value={priceState.pendingMax}
                    onChange={(e) => {
                      // Clear predefined ranges when typing custom price
                      if (priceState.pendingRanges.length > 0) {
                        priceState.pendingRanges.forEach(range => priceState.toggleRange(range));
                      }
                      priceState.setPendingMax(e.target.value);
                    }}
                    className="transition duration-200 focus:ring-2 focus:ring-blue-400 text-sm"
                  />
                </div>
              </div>
              {(priceState.pendingMin !== "" || priceState.pendingMax !== "") && !isMaxLessThanMin && (
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Custom range: ETB {priceState.pendingMin || "0"} - {priceState.pendingMax || "∞"}
                </p>
              )}
              {isMaxLessThanMin && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Max price cannot be less than min price.
                </p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Footer - Fixed */}
      <div className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          onClick={onApplyFilters}
          className="w-full transition-colors duration-200 text-sm sm:text-base py-2 sm:py-3" 
          disabled={isMaxLessThanMin}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};