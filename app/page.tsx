"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "../components/ui/input";
import { ProductCard } from "../components/product-card";
import { useDebounce } from "../hooks/use-debounce";
import InfiniteScroll from "react-infinite-scroll-component";

interface Product {
  id: string;
  name: string | null;
  description: string | null;
  views: number;
  forwards: number;
  reactions: [string, number][];
  posted_at: string;
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debouncedSearch = useDebounce(search, 500);

  const fetchProducts = useCallback(
    async (pageNumber: number, isNewSearch = false) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: pageNumber.toString(),
          page_size: "20",
          ...(debouncedSearch && { query: debouncedSearch }),
        });

        const url = `https://central-marketplace-backend.onrender.com/products/?${params}`;
        console.log("Fetching from URL:", url);

        const response = await fetch(url);
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(
          "Received data:",
          JSON.stringify(data).slice(0, 200) + "..."
        );

        if (!data || !data.data || !Array.isArray(data.data.items)) {
          throw new Error("Invalid data structure received from API");
        }

        if (isNewSearch) {
          setProducts(data.data.items);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...data.data.items]);
        }
        // If we receive less than 20 items, assume it's the last page
        setHasMore(data.data.items.length === 20);
        console.log("Products set, count:", data.data.items.length);
      } catch (error) {
        console.error("Caught error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch]
  );

  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [fetchProducts]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  return (
    <main className="container py-6 space-y-6 mx-auto">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-bold">Search and find anything</h1>
        <Input
          type="search"
          placeholder="Type to search..."
          className="max-w-xl mx-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-center text-red-500">
          Error: {error}. Please try again later.
        </p>
      )}

      {loading && products.length === 0 ? (
        // Display spinner if initially loading and no products yet
        <LoadingSpinner />
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={loadMore}
          hasMore={hasMore}
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

      {!loading && !error && products.length === 0 && (
        <p className="text-center">No products found.</p>
      )}
    </main>
  );
}
