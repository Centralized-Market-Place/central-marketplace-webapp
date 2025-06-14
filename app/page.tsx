"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/products/components/product-card";
import { useDebounce } from "../hooks/use-debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_FILTERS, useProducts } from "@/products/hooks/useProducts";
import { EmptyState, ErrorState } from "@/components/common/empty-state";
import { Search, Filter } from "lucide-react";
import { ProductLoading } from "@/components/common/product-loading";
import { SearchBar } from "../components/ui/SearchBar";
import { useCategoryHierarchy } from "@/products/hooks/useCategoryAction";
import { FilterContent } from "@/components/common/FilterProducts";
import { FilterChips } from "@/components/common/FilterChips";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";


type PriceRange = {
  label: string;
  min: number;
  max: number | null;
};

const PRICE_RANGES: PriceRange[] = [
  { label: "ETB 0 – 500", min: 0, max: 500 },
  { label: "ETB 500 – 1,000", min: 500, max: 1000 },
  { label: "ETB 1,000 – 5,000", min: 1000, max: 5000 },
  { label: "ETB 5,000 – 10,000", min: 5000, max: 10000 },
  { label: "ETB 10,000 – 20,000", min: 10000, max: 20000 },
  { label: "ETB 20,000 – 100,000", min: 20000, max: 100000 },
  { label: "ETB 100,000+", min: 100000, max: null },
];

export default function Home() {
  // Search/filter values to be used when the user hits Apply
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [customMinPrice, setCustomMinPrice] = useState<string>("");
  const [customMaxPrice, setCustomMaxPrice] = useState<string>("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  // Temporary values before applying
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingCategories, setPendingCategories] = useState<string[]>([]);
  const [pendingPriceRanges, setPendingPriceRanges] = useState<PriceRange[]>([]);
  const [pendingMin, setPendingMin] = useState("");
  const [pendingMax, setPendingMax] = useState("");
  const [pendingChannels, setPendingChannels] = useState<string[]>([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const {
    hierarchy: categoryHierarchy,
    isLoading: isHierarchyLoading,
    isError: isHierarchyError,
  } = useCategoryHierarchy();

  const parsePrice = (value: string) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  };

  const { products, isLoading, isError, hasNextPage, fetchNextPage } = useProducts({
    ...DEFAULT_FILTERS,
    query: debouncedSearch,
    categories: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
    channelIds: selectedChannels,
    minPrice:
      customMinPrice !== ""
        ? parsePrice(customMinPrice)
        : selectedPriceRanges.length > 0
          ? Math.min(...selectedPriceRanges.map((r) => r.min))
          : undefined,
    maxPrice:
      customMaxPrice !== ""
        ? parsePrice(customMaxPrice)
        : selectedPriceRanges.length > 0
          ? Math.max(...selectedPriceRanges.map((r) => (r.max === null ? Number.MAX_SAFE_INTEGER : r.max)))
          : undefined,
  });

  const togglePendingPriceRange = (range: PriceRange) => {
    const isAlreadySelected = pendingPriceRanges.some((r) => r.label === range.label);

    if (isAlreadySelected) {
      setPendingPriceRanges([]);
    } else {
      setPendingPriceRanges([range]);
      setPendingMin("");
      setPendingMax("");
    }
  };

  const applyFilters = () => {
    setSearch(pendingSearch);
    setSelectedCategories(pendingCategories);
    setSelectedPriceRanges(pendingPriceRanges);
    setCustomMinPrice(pendingMin);
    setCustomMaxPrice(pendingMax);
    setSelectedChannels(pendingChannels);
    setIsFilterOpen(false);
  };

  const handleRemoveFilter = (filterType: "category" | "priceRange" | "customPrice" | "channels") => {
    if (filterType === "category") {
      setSelectedCategories([]);
      setPendingCategories([]);
    }
    if (filterType === "priceRange") {
      setSelectedPriceRanges([]);
      setPendingPriceRanges([]);
    }
    if (filterType === "customPrice") {
        setCustomMinPrice("");
        setCustomMaxPrice("");
        setPendingMin("");
        setPendingMax("");
    }
    if (filterType === "channels") {
        setSelectedChannels([]);
        setPendingChannels([]);
    }
  };

  const activeFilters = {
    category: selectedCategories.length > 0 ? `${selectedCategories.length} categor${selectedCategories.length > 1 ? 'ies' : 'y'}` : "",
    priceRange: selectedPriceRanges.length > 0 ? selectedPriceRanges[0].label : "",
    customPrice: customMinPrice || customMaxPrice ? `ETB ${customMinPrice || "0"} - ${customMaxPrice || "∞"}` : "",
    channels: selectedChannels.length > 0 ? `${selectedChannels.length} channel${selectedChannels.length > 1 ? 's' : ''}` : ""
  }

  // Memoize state objects to prevent unnecessary re-renders
  const categoryState = useMemo(() => ({
    pending: pendingCategories,
    setPending: setPendingCategories,
    isLoading: isHierarchyLoading,
    isError: isHierarchyError,
    hierarchy: categoryHierarchy,
  }), [pendingCategories, setPendingCategories, isHierarchyLoading, isHierarchyError, categoryHierarchy]);

  const priceState = useMemo(() => ({
    pendingRanges: pendingPriceRanges,
    toggleRange: togglePendingPriceRange,
    pendingMin: pendingMin,
    pendingMax: pendingMax,
    setPendingMin: setPendingMin,
    setPendingMax: setPendingMax,
    availableRanges: PRICE_RANGES,
  }), [pendingPriceRanges, togglePendingPriceRange, pendingMin, pendingMax, setPendingMin, setPendingMax]);

  return (
    <main className=" mx-auto px-4 py-10">
      <section className="lg:col-span-3 space-y-8">
        <div className="sticky top-0 z-20  pb-4  border-gray-200 dark:border-gray-700 max-w-7xl mx-auto text-center">
          <div className="flex items-center gap-2 sm:gap-3 max-w-4xl mx-auto">
            <SearchBar
              placeholder="Search products..."
              onSearch={setPendingSearch}
              className="flex-1"
              defaultValue={pendingSearch}
            />
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger className="p-3 sm:p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 flex-shrink-0">
                <Filter className="h-5 w-5  dark:text-gray-400 p-0" />
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[85%] sm:w-[350px] md:w-[400px] p-0 overflow-hidden"
              >
                <div className="h-full p-4 sm:p-6">
                  <FilterContent
                    categoryState={categoryState}
                    priceState={priceState}
                    onApplyFilters={applyFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <FilterChips activeFilters={activeFilters} onRemoveFilter={handleRemoveFilter} />

        {isError && (
          <ErrorState
            message="Something went wrong. Please try again."
            onRetry={() => window.location.reload()}
          />
        )}
        {!isLoading && !isError && products.length === 0 && (
          <EmptyState message="No products found." icon={Search} />
        )}
        {isLoading && <ProductLoading />}

        <InfiniteScroll
          dataLength={products.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-[28rem] bg-gray-100 animate-pulse rounded-xl" />
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} prod={product} />
            ))}
          </div>
        </InfiniteScroll>
      </section>
    </main>
  );
}
