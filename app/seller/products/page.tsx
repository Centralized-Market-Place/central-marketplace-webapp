"use client";

import { useSellerChannels } from "@/channels/hooks/useSellerChannels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Package } from "lucide-react";
import Link from "next/link";
import SellerProductsContent from "./components/SellerProductsContent";

function SellerProductsPageSkeleton() {
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
        <div className="h-8 bg-muted animate-pulse rounded w-48"></div>
        <div className="h-6 bg-muted animate-pulse rounded w-32 self-start sm:self-auto"></div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-muted animate-pulse rounded w-32"></div>
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="w-full lg:w-80 h-64 lg:h-56 flex-shrink-0 bg-muted animate-pulse"></div>

                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="h-6 bg-muted animate-pulse rounded w-3/4"></div>

                        <div className="flex items-center gap-3">
                          <div className="h-5 bg-muted animate-pulse rounded w-24"></div>
                          <div className="h-5 bg-muted animate-pulse rounded w-20"></div>
                        </div>

                        <div className="space-y-2">
                          <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
                          <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
                          <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
                          <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
                        </div>

                        <div className="flex gap-3">
                          <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
                          <div className="h-4 bg-muted animate-pulse rounded w-18"></div>
                          <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
                        </div>

                        <div className="flex gap-2">
                          <div className="h-5 bg-muted animate-pulse rounded w-16"></div>
                          <div className="h-5 bg-muted animate-pulse rounded w-20"></div>
                          <div className="h-5 bg-muted animate-pulse rounded w-14"></div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SellerProductsPage() {
  const { channels, channelsLoading } = useSellerChannels();

  if (channelsLoading) {
    return <SellerProductsPageSkeleton />;
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
