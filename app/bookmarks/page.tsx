"use client";

import { EmptyState, ErrorState } from "@/components/common/empty-state";
import { Bookmark } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  DEFAULT_BOOKMARK_FILTERS,
  useBookmarks,
} from "@/products/hooks/useBookmarks";
import { useState } from "react";
import { ProductLoading } from "@/components/common/product-loading";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/products/components/product-card";

export default function BookmarksPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { bookmarks, isLoading, isError, fetchNextPage, hasNextPage } =
    useBookmarks({ ...DEFAULT_BOOKMARK_FILTERS, query: debouncedSearch });

  return (
    <main className="container mt-20 px-4 mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-4 space-y-4">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
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

      {!isLoading && !isError && bookmarks.length === 0 && (
        <EmptyState message="No products found." icon={Bookmark} />
      )}

      {isLoading && <ProductLoading />}

      {
        <InfiniteScroll
          dataLength={bookmarks.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[28rem] bg-muted animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          }
        >
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bookmarks.map((product) => (
              <ProductCard key={product.id} prod={product} />
            ))}
          </div>
        </InfiniteScroll>
      }
    </main>
  );
}
