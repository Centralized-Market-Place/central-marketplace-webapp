"use client";

import { useState } from "react";
import { ProductCard } from "@/products/components/product-card";
import { useDebounce } from "../hooks/use-debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_FILTERS, useProducts } from "@/products/hooks/useProducts";
import { EmptyState, ErrorState } from "@/components/common/empty-state";
import { Search } from "lucide-react";
import { ProductLoading } from "@/components/common/product-loading";
import { SearchBar } from "../components/ui/SearchBar";

export default function Home() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { products, isLoading, isError, hasNextPage, fetchNextPage } =
    useProducts({
      ...DEFAULT_FILTERS,
      query: debouncedSearch,
    });

  return (
    <main className="px-4 mx-auto ">
      <div className="mx-auto text-center space-y-4 my-16">
        <SearchBar
          placeholder="Type to search..."
          onSearch={setSearch}
          className="mx-auto "
        />
      </div>
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

      {
        <InfiniteScroll
          dataLength={products.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[28rem] bg-muted animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} prod={product} />
            ))}
          </div>
        </InfiniteScroll>
      }
    </main>
  );
}
