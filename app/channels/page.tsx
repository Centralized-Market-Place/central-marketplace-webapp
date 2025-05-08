"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { DEFAULT_FILTERS, useChannels } from "@/channels/hooks/useChannels";
import LoadingIcon from "@/components/state/loading";
import { ChannelCard } from "@/channels/components/channel-card";
import { Channel } from "@/channels/schema";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
    <main className="container px-4 mx-auto space-y-6">
      {/* sticky search bar */}
      <div className="sticky top-16 z-50 py-4">
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

      {isError && (
        <p className="text-center text-red-500">
          An error occurred. Please try again later.
        </p>
      )}

      {channelsLoading && channels.length === 0 ? (
        <LoadingIcon className="size-8 mx-auto" />
      ) : (
        <InfiniteScroll
          dataLength={channels.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<LoadingSpinner />}
          endMessage={<p className="text-center py-4">You’ve reached the end!</p>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel: Channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </InfiniteScroll>
      )}

      {!channelsLoading && !isError && channels.length === 0 && (
        <p className="text-center py-6">No channels found.</p>
      )}
    </main>
  );
}
