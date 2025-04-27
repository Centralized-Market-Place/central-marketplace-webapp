"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Channel } from "../schema";
import { ArrowRight } from "lucide-react";



export function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <Card className="h-full flex flex-col align-center justify-center w-full transition-shadow hover:shadow-md">
      <CardContent>
      <div className="flex p-2 gap-4">
          <Image
            src={channel.thumbnailUrl || "/tgthumbnail.jpeg"}
            alt={channel.title || "Channel Thumbnail"}
            width={64}
            height={64}
            className="w-16 h-16  rounded-full object-cover border"
            />
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-bold line-clamp-1">
            {channel.title}
          </h2>
          {channel.participants != null && (
            <p className="text-sm text-muted-foreground mt-1">
              {channel.participants.toLocaleString()} subscribers
            </p>
          )}
          {channel.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
              {channel.description}
            </p>
          )}
        </div>
      </div>
      </CardContent>

      <CardFooter className="flex justify-end p-4 pt-2">
        <Link href={`/channels/${channel.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowRight size={20} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
