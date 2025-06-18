"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ProductCard } from "@/products/components/product-card";
import { useDebounce } from "@/hooks/use-debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_FILTERS, useProducts } from "@/products/hooks/useProducts";
import { useChannel } from "@/channels/hooks/useChannel";
import { Search, ExternalLink, Filter } from "lucide-react";
import { ProductLoading } from "@/components/common/product-loading";
import { EmptyState, ErrorState } from "@/components/common/empty-state";
import { ReportButton } from "@/reports/components/report-button";
import { SearchBar } from "@/components/ui/SearchBar";
import { useCategoryHierarchy } from "@/products/hooks/useCategoryAction";
import { FilterContent } from "@/components/common/FilterProducts";
import { FilterChips } from "@/components/common/FilterChips";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

function ChannelHeaderSkeleton() {
  return (
    <div className="flex md:flex-row items-center gap-4 md:gap-6 p-4 border-b">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted animate-pulse"></div>
      <div className="flex-1">
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-3"></div>
        <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2"></div>
        <div className="h-4 w-full max-w-md bg-muted animate-pulse rounded"></div>
      </div>
    </div>
  );
}

export default function ChannelPage() {
  const { id: channelId } = useParams();

  // Search/filter values to be used when the user hits Apply
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>(
    []
  );
  const [customMinPrice, setCustomMinPrice] = useState<string>("");
  const [customMaxPrice, setCustomMaxPrice] = useState<string>("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    channelId as string,
  ]); // Default to current channel

  // Temporary values before applying
  const [pendingCategories, setPendingCategories] = useState<string[]>([]);
  const [pendingPriceRanges, setPendingPriceRanges] = useState<PriceRange[]>(
    []
  );
  const [pendingMin, setPendingMin] = useState("");
  const [pendingMax, setPendingMax] = useState("");
  const [pendingChannels, setPendingChannels] = useState<string[]>([
    channelId as string,
  ]); // Default to current channel

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const { channel, isLoading: channelLoading } = useChannel(
    channelId as string
  );

  const {
    hierarchy: categoryHierarchy,
    isLoading: isHierarchyLoading,
    isError: isHierarchyError,
  } = useCategoryHierarchy();

  const parsePrice = (value: string) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  };

  const {
    products,
    isLoading: productsLoading,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useProducts({
    filters: {
      ...DEFAULT_FILTERS,
      channelIds: selectedChannels,
      query: debouncedSearch,
      categories:
        selectedCategories.length > 0
          ? selectedCategories.join(",")
          : undefined,
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
          ? Math.max(
              ...selectedPriceRanges.map((r) =>
                r.max === null ? Number.MAX_SAFE_INTEGER : r.max
              )
            )
          : undefined,
    },
    context: "channel",
  });

  const togglePendingPriceRange = useCallback(
    (range: PriceRange) => {
      const isAlreadySelected = pendingPriceRanges.some(
        (r) => r.label === range.label
      );

      if (isAlreadySelected) {
        setPendingPriceRanges([]);
      } else {
        setPendingPriceRanges([range]);
        setPendingMin("");
        setPendingMax("");
      }
    },
    [pendingPriceRanges]
  );

  const applyFilters = () => {
    setSelectedCategories(pendingCategories);
    setSelectedPriceRanges(pendingPriceRanges);
    setCustomMinPrice(pendingMin);
    setCustomMaxPrice(pendingMax);
    setSelectedChannels(pendingChannels);
    setIsFilterOpen(false);
  };

  const handleRemoveFilter = (
    filterType:
      | "search"
      | "category"
      | "priceRange"
      | "customPrice"
      | "channels"
  ) => {
    if (filterType === "search") {
      setSearch("");
    }
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
      // Reset to current channel only
      setSelectedChannels([channelId as string]);
      setPendingChannels([channelId as string]);
    }
  };

  const handleClearAllFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setCustomMinPrice("");
    setCustomMaxPrice("");
    // Reset to current channel only (don't clear the channel filter completely)
    setSelectedChannels([channelId as string]);
    setPendingCategories([]);
    setPendingPriceRanges([]);
    setPendingMin("");
    setPendingMax("");
    setPendingChannels([channelId as string]);
  };

  const activeFilters = {
    search: search ? `"${search}"` : "",
    category:
      selectedCategories.length > 0
        ? `${selectedCategories.length} categor${
            selectedCategories.length > 1 ? "ies" : "y"
          }`
        : "",
    priceRange:
      selectedPriceRanges.length > 0 ? selectedPriceRanges[0].label : "",
    customPrice:
      customMinPrice || customMaxPrice
        ? `ETB ${customMinPrice || "0"} - ${customMaxPrice || "∞"}`
        : "",
    channels:
      selectedChannels.length > 1 ? `${selectedChannels.length} channels` : "", // Only show if more than current channel
  };

  // Memoize state objects to prevent unnecessary re-renders
  const categoryState = useMemo(
    () => ({
      pending: pendingCategories,
      setPending: setPendingCategories,
      isLoading: isHierarchyLoading,
      isError: isHierarchyError,
      hierarchy: categoryHierarchy,
    }),
    [
      pendingCategories,
      setPendingCategories,
      isHierarchyLoading,
      isHierarchyError,
      categoryHierarchy,
    ]
  );

  const priceState = useMemo(
    () => ({
      pendingRanges: pendingPriceRanges,
      toggleRange: togglePendingPriceRange,
      pendingMin: pendingMin,
      pendingMax: pendingMax,
      setPendingMin: setPendingMin,
      setPendingMax: setPendingMax,
      availableRanges: PRICE_RANGES,
    }),
    [
      pendingPriceRanges,
      togglePendingPriceRange,
      pendingMin,
      pendingMax,
      setPendingMin,
      setPendingMax,
    ]
  );

  const channelState = useMemo(
    () => ({
      pending: pendingChannels,
      setPending: setPendingChannels,
    }),
    [pendingChannels, setPendingChannels]
  );

  return (
    <main className="container px-4 mx-auto pt-1">
      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-50 py-4 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2 sm:gap-3 max-w-4xl mx-auto">
          <SearchBar
            placeholder="Search for products in this channel..."
            onSearch={setSearch}
            realTimeSearch={true}
            className="flex-1"
            defaultValue={search}
          />
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger className="p-3 sm:p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 flex-shrink-0">
              <Filter className="h-5 w-5 dark:text-gray-400 p-0" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85%] sm:w-[350px] md:w-[400px] p-0 overflow-hidden"
            >
              <div className="h-full p-4 sm:p-6">
                <FilterContent
                  categoryState={categoryState}
                  priceState={priceState}
                  channelState={channelState}
                  onApplyFilters={applyFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <FilterChips
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
      </div>

      {/* Channel Header */}
      <div className="mt-6 mb-8">
        {channelLoading ? (
          <ChannelHeaderSkeleton />
        ) : channel ? (
          <div className="flex md:flex-row items-center gap-4 md:gap-6 p-4 rounded-lg border shadow-sm">
            <Image
              src={channel.data.thumbnailUrl || "/tgthumbnail.jpeg"}
              alt={channel.data.title || "Channel Thumbnail"}
              width={64}
              height={64}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border"
            />
            <div className="flex-1">
              <div className="flex gap-4 items-center mb-1">
                <h1 className="text-2xl font-bold">{channel.data.title}</h1>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://t.me/${channel.data.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="ml-1 text-sm">Visit Channel</span>
                  </a>
                  <ReportButton
                    targetId={channel.data.id}
                    targetType="CHANNEL"
                    targetTitle={channel.data.title || "Channel"}
                    variant="outline"
                    size="sm"
                    showText={false}
                  />
                </div>
              </div>
              {channel.data.participants && (
                <p className="text-muted-foreground mb-1">
                  <span className="font-medium">
                    {channel.data.participants.toLocaleString()} Subscribers
                  </span>
                </p>
              )}
              {channel.data.description && (
                <p className="text-muted-foreground text-sm mt-2">
                  {channel.data.description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <ErrorState
            message="Channel not found."
            onRetry={() => window.location.reload()}
          />
        )}
      </div>

      {isError && (
        <ErrorState
          message="An error occurred. Please try again later."
          onRetry={() => window.location.reload()}
        />
      )}

      {productsLoading && products.length === 0 ? (
        <ProductLoading />
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[28rem] bg-muted animate-pulse rounded-lg"
                ></div>
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
      )}

      {!productsLoading && !isError && products.length === 0 && (
        <EmptyState
          message="No products found in this channel."
          icon={Search}
        />
      )}
    </main>
  );
}
