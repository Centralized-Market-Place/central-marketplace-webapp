"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/products/components/product-card";
import { useDebounce } from "@/hooks/use-debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_FILTERS, useProducts } from "@/products/hooks/useProducts";
import { useChannel } from "@/channels/hooks/useChannel";
import { Search, ExternalLink } from "lucide-react";
import { ProductLoading } from "@/components/common/product-loading";
import { EmptyState, ErrorState } from "@/components/common/empty-state";

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
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { channel, isLoading: channelLoading } = useChannel(
    channelId as string
  );

  const {
    products,
    isLoading: productsLoading,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useProducts({
    ...DEFAULT_FILTERS,
    channelId: channelId as string,
    query: debouncedSearch,
  });

  return (
    <main className="container px-4 mx-auto pt-1">
      <div className="sticky top-0 z-50 py-4 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-xl mx-auto">
          <Input
            type="search"
            placeholder="Search for products in this channel..."
            className="w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

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
                <a
                  href={`https://t.me/${channel.data.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="ml-1 text-sm">Visit Channel</span>
                </a>
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
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[28rem] bg-muted animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} prod={product} />
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
