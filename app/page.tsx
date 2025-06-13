"use client";

import { useState } from "react";
import { ProductCard } from "@/products/components/product-card";
import { useDebounce } from "../hooks/use-debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_FILTERS, useProducts } from "@/products/hooks/useProducts";
import { EmptyState, ErrorState } from "@/components/common/empty-state";
import { Search, Filter } from "lucide-react";
import { ProductLoading } from "@/components/common/product-loading";
import { SearchBar } from "../components/ui/SearchBar";
import { useCategories } from "@/products/hooks/useCategoryAction";
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
  const [filter, setFilter] = useState("all");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [customMinPrice, setCustomMinPrice] = useState<string>("");
  const [customMaxPrice, setCustomMaxPrice] = useState<string>("");

  // Temporary values before applying
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingFilter, setPendingFilter] = useState("all");
  const [pendingPriceRanges, setPendingPriceRanges] = useState<PriceRange[]>([]);
  const [pendingMin, setPendingMin] = useState("");
  const [pendingMax, setPendingMax] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const {
    categories,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useCategories();

  const parsePrice = (value: string) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  };

  const { products, isLoading, isError, hasNextPage, fetchNextPage } = useProducts({
    ...DEFAULT_FILTERS,
    query: debouncedSearch,
    categories: filter !== "all" ? filter : undefined,
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
    setFilter(pendingFilter);
    setSelectedPriceRanges(pendingPriceRanges);
    setCustomMinPrice(pendingMin);
    setCustomMaxPrice(pendingMax);
    setIsFilterOpen(false);
  };

  const handleRemoveFilter = (filterType: "category" | "priceRange" | "customPrice") => {
    if (filterType === "category") {
      setFilter("all");
      setPendingFilter("all");
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
  };

  const activeFilters = {
    category: filter !== "all" ? categories.find(c => c.categoryName === filter)?.categoryName || "" : "",
    priceRange: selectedPriceRanges.length > 0 ? selectedPriceRanges[0].label : "",
    customPrice: customMinPrice || customMaxPrice ? `ETB ${customMinPrice || "0"} - ${customMaxPrice || "∞"}` : ""
  }

  const FilterContentWrapper = () => (
    <FilterContent
      pendingFilter={pendingFilter}
      setPendingFilter={setPendingFilter}
      isCategoryLoading={isCategoryLoading}
      isCategoryError={isCategoryError}
      categories={categories}
      pendingPriceRanges={pendingPriceRanges as unknown as PriceRange[]}
      togglePendingPriceRange={togglePendingPriceRange}
      pendingMin={pendingMin}
      pendingMax={pendingMax}
      setPendingMin={setPendingMin}
      setPendingMax={setPendingMax}
      PRICE_RANGES={PRICE_RANGES as unknown as PriceRange[]}
      applyFilters={applyFilters}
    />
  )

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <section className="lg:col-span-3 space-y-8">
        <div className="sticky top-0 z-20  flex items-center  ">
          <SearchBar
            placeholder="Search products..."
            onSearch={setPendingSearch}
            className="w-full"
            defaultValue={pendingSearch}
          />
          <div>
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger className="p-2 rounded-lg border">
                <Filter className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[300px]">
                <FilterContentWrapper />
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
