"use client";

import { useSellerChannels } from "@/channels/hooks/useSellerChannels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Package } from "lucide-react";
import Link from "next/link";
import SellerProductsContent from "./components/SellerProductsContent";

export default function SellerProductsPage() {
  const { channels, channelsLoading } = useSellerChannels();

  if (channelsLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          My Products
        </h1>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">My Products</h1>
        <Badge variant="secondary" className="text-sm self-start sm:self-auto">
          Seller Dashboard
        </Badge>
      </div>

      {channels && channels.length > 0 ? (
        <SellerProductsContent channels={channels} />
      ) : (
        <NoChannelsState />
      )}
    </div>
  );
}

function NoChannelsState() {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5" />
          Get Started
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-center py-6 sm:py-8">
          <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No channels registered</p>
          <p className="text-sm text-muted-foreground mb-4">
            Register your channels to start selling and manage your products
          </p>
          <Link href="/seller/apply">
            <Button>Register Channel</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
