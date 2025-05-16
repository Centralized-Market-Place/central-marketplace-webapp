"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_FILTERS, useChannels } from "@/channels/hooks/useChannels";
import { ChannelCard } from "@/channels/components/channel-card";
import { Channel } from "@/channels/schema";
import { Search } from "lucide-react";

function ChannelLoadingCard() {
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden bg-card">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
          <div className="flex-1">
            <div className="h-5 w-2/3 bg-muted animate-pulse rounded mb-2"></div>
            <div className="h-3 w-1/3 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
        <div className="h-4 w-4/5 bg-muted animate-pulse rounded"></div>
        <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
      </div>
    </div>
  );
}

export default function ChannelsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const {
    channels,
    isLoading: channelsLoading,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useChannels({
    ...DEFAULT_FILTERS,
    query: debouncedSearch,
  });

  return (
    <main className="container px-4 pt-1 mx-auto">
      {/* Fixed search bar with proper spacing */}
      <div className="sticky top-0 z-50 py-4 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-xl mx-auto">
          <Input
            type="search"
            placeholder="Search for channels…"
            className="w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="py-6">
        {isError && (
          <p className="text-center text-red-500">
            An error occurred. Please try again later.
          </p>
        )}

        {channelsLoading && channels.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <ChannelLoadingCard key={index} />
            ))}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={channels.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ChannelLoadingCard key={index} />
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {channels.map((channel: Channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
          </InfiniteScroll>
        )}

        {!channelsLoading && !isError && channels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-medium">No channels found</p>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        )}
      </div>
    </main>
  );
}
