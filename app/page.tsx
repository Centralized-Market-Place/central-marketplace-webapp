"use client";

import { useState } from "react";
import { Input } from "../components/ui/input";
import { ProductCard } from "../components/product-card";
import { useDebounce } from "../hooks/use-debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_FILTERS, useProducts } from "@/products/hooks/useProducts";
import LoadingIcon from "@/components/state/loading";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { products, isLoading, isError , hasNextPage, fetchNextPage} = useProducts({
    ...DEFAULT_FILTERS,
    query: debouncedSearch,
  });

  return (
    <main className="container mt-20 px-4 mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-4 space-y-4">
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
        <p className="text-center text-red-500">
          Error: occurred. Please try again later.
        </p>
      )}

      {isLoading && products.length === 0 ? (
        <LoadingIcon className="size-8" />
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<LoadingSpinner />}
          endMessage={<p className="text-center"></p>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </InfiniteScroll>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <p className="text-center">No products found.</p>
      )}
    </main>
  );
}
