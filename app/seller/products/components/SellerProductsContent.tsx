"use client";

import { DEFAULT_FILTERS, useProducts } from "@/products/hooks/useProducts";
import { Channel } from "@/channels/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SellerProductCard from "./SellerProductCard";

interface SellerProductsContentProps {
  channels: Channel[];
}

function SellerProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
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

                {/* Contact Info */}
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
  );
}

export default function SellerProductsContent({
  channels,
}: SellerProductsContentProps) {
  const { products, isLoading } = useProducts({
    filters: {
      ...DEFAULT_FILTERS,
      channelIds: channels.map((channel) => channel.id),
    },
    context: "seller-products",
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-muted animate-pulse rounded w-32"></div>
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SellerProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Badge variant="secondary" className="text-sm">
          {products?.length || 0} Products Found
        </Badge>
      </div>

      {!products || products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              No products found. Your products will appear here once they are
              imported from your channels.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => (
            <SellerProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
