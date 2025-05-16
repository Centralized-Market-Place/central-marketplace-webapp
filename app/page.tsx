"use client";

import { useState } from "react";
import { Input } from "../components/ui/input";
import { ProductCard } from "@/products/components/product-card";
import { useDebounce } from "../hooks/use-debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_FILTERS, useProducts } from "@/products/hooks/useProducts";
import { EmptyState, ErrorState } from "@/components/common/empty-state";
import { Search } from "lucide-react";
import { ProductLoading } from "@/components/common/product-loading";


export default function Home() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { products, isLoading, isError, hasNextPage, fetchNextPage } =
    useProducts({
      ...DEFAULT_FILTERS,
      query: debouncedSearch,
    });

  return (
    <main className="container mt-4 px-4 mx-auto">
      <div className="mt-4 max-w-2xl mx-auto text-center mb-4 space-y-4">
        <h1 className="text-3xl font-bold">Search and find anything</h1>
        <Input
          type="search"
          placeholder="Type to search..."
          className="max-w-xl mx-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            {products.map((product) => (
              <ProductCard key={product.id} prod={product} />
            ))}
          </div>
        </InfiniteScroll>
      }
    </main>
  );
}
