"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Channel } from "../schema";
import { ArrowRight } from "lucide-react";

export function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <Card className="h-full flex flex-col w-full transition-shadow hover:shadow-md overflow-hidden">
      <CardContent className="flex-1 p-4">
        <div className="flex gap-3">
          <Image
            src={channel.thumbnailUrl || "/tgthumbnail.jpeg"}
            alt={channel.title || "Channel Thumbnail"}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover border flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-base line-clamp-1">
              {channel.title}
            </h2>
            {channel.participants != null && (
              <p className="text-xs text-muted-foreground mt-1">
                {channel.participants.toLocaleString()} subscribers
              </p>
            )}
          </div>
        </div>

        {channel.description && (
          <p className="text-xs text-muted-foreground mt-4 line-clamp-2">
            {channel.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-end p-2 border-t">
        <Link href={`/channels/${channel.id}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <span className="text-xs">View</span>
            <ArrowRight size={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
