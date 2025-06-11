"use client";

import { DEFAULT_FILTERS, useProducts } from "@/products/hooks/useProducts";
import { Channel } from "@/channels/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SellerProductCard from "./SellerProductCard";

interface SellerProductsContentProps {
  channels: Channel[];
}

export default function SellerProductsContent({
  channels,
}: SellerProductsContentProps) {
  const { products, isLoading } = useProducts({
    ...DEFAULT_FILTERS,
    channelIds: channels.map((channel) => channel.id),
  });

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
        ))}
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
