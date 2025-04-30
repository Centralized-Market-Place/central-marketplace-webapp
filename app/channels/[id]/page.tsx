"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/products/components/product-card";
import { useDebounce } from "@/hooks/use-debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_FILTERS, useProducts } from "@/products/hooks/useProducts";
import LoadingIcon from "@/components/state/loading";
import { useChannel } from "@/channels/hooks/useChannel";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function ChannelPage() {
  const { id: channelId } = useParams();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { channel, isLoading: channelLoading } = useChannel(channelId as string);

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
    <main className="container mt-16 px-4 mx-auto space-y-6">
      {channelLoading ? (
        <LoadingIcon className="size-8 mx-auto" />
      ) : channel ? (
        <div>
          <div className="flex  md:flex-row items-center gap-4 md:gap-6 p-4  border-b ">
            <Image
              src={channel.data.thumbnailUrl || "/tgthumbnail.jpeg"}
              alt={channel.data.title || "Channel Thumbnail"}
              width={64}
              height={64}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border"
            />
            <div className="text-center md:text-left">
              <div className="flex gap-4">
                <h1 className="text-2xl font-bold">{channel.data.title}</h1>
                <a href={`https://t.me/${channel.data.username}`} target="_blank" rel="noopener noreferrer">
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="18"  height="18"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-link"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 15l6 -6" /><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" /><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" /></svg>
                </a>
              </div>
              {channel.data.participants && <p className="text-gray-700 text-md">
                <span className="font-semibold">{channel.data.participants.toLocaleString()} Subscribers</span>
              </p>}
              {channel.data.description && <p className="text-gray-600 text-sm">{channel.data.description}</p>}
            </div>
          </div>
          <div className="fixed top-0 left-0 w-full z-50 py-4">
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


      </div>
      ) : (
        <p className="text-center text-red-500">Channel not found.</p>
      )}

      {isError && (
        <p className="text-center text-red-500">
          An error occurred. Please try again later.
        </p>
      )}

      {productsLoading && products.length === 0 ? (
        <LoadingIcon className="size-8 mx-auto" />
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<LoadingSpinner />}
          endMessage={<p className="text-center py-4">You reached the end!</p>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} prod={product} />
            ))}
          </div>
        </InfiniteScroll>
      )}

      {!productsLoading && !isError && products.length === 0 && (
        <p className="text-center py-6">No products found in this channel.</p>
      )}
    </main>
  );
}
