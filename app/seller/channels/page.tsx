"use client";

import { useState } from "react";
import { useSellerChannels } from "@/channels/hooks/useSellerChannels";
import { Channel } from "@/channels/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Users, Package, Shield, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { ChannelEditModal } from "./components/ChannelEditModal";

export default function SellerChannelsPage() {
  const { channels, channelsLoading, refetch } = useSellerChannels();
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditChannel = (channel: Channel) => {
    setEditingChannel(channel);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingChannel(null);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  const getStatusBadge = (channel: Channel) => {
    if (channel.scam) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle size={12} />
          Flagged as Scam
        </Badge>
      );
    }
    if (channel.restricted) {
      return (
        <Badge variant="secondary" className="gap-1">
          <AlertTriangle size={12} />
          Restricted
        </Badge>
      );
    }
    if (channel.verified) {
      return (
        <Badge variant="default" className="gap-1">
          <Shield size={12} />
          Verified
        </Badge>
      );
    }
    return <Badge variant="outline">Unverified</Badge>;
  };

  if (channelsLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Channels</h1>
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Channels</h1>
        <Badge variant="secondary" className="text-sm">
          {channels?.length || 0} Channel{channels?.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {!channels || channels.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              No channels found. Your channels will appear here once they are
              processed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {channels.map((channel) => (
            <Card key={channel.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <Image
                      src={channel.thumbnailUrl || "/tgthumbnail.jpeg"}
                      alt={channel.title || "Channel"}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover w-30 h-30"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold line-clamp-1">
                          {channel.title ||
                            channel.username ||
                            "Unnamed Channel"}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {channel.participants.toLocaleString()} subscribers
                          </span>
                          {channel.totalProducts !== undefined && (
                            <span className="flex items-center gap-1">
                              <Package size={14} />
                              {channel.totalProducts} products
                            </span>
                          )}
                        </div>
                        <div className="mt-2">{getStatusBadge(channel)}</div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditChannel(channel)}
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>

                    <p className="text-muted-foreground line-clamp-2 mb-3">
                      {channel.description || "No description available"}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {channel.username && <span>@{channel.username}</span>}
                      {channel.trustScore !== undefined && (
                        <span>
                          Trust Score: {channel.trustScore.toFixed(1)}
                        </span>
                      )}
                      {channel.dateCreated && (
                        <span>
                          Created:{" "}
                          {new Date(channel.dateCreated).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingChannel && (
        <ChannelEditModal
          channel={editingChannel}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
