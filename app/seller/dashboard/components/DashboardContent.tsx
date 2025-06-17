"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MessageSquare, Users, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";
import { DEFAULT_FILTERS, useProducts } from "@/products/hooks/useProducts";
import { Channel } from "@/channels/schema";
import { useSellerAnalytics } from "@/channels/hooks/useSellerAnalytics";

interface DashboardContentProps {
  channels: Channel[];
}

export default function DashboardContent({ channels }: DashboardContentProps) {
  const { products, isLoading: productsLoading } = useProducts({
    filters: {
      ...DEFAULT_FILTERS,
      channelIds: channels.map((channel) => channel.id),
      pageSize: 3,
    },
    context: "seller-dashboard",
  });

  const { sellerAnalytics, sellerAnalyticsLoading } = useSellerAnalytics();

  const totalChannels = channels?.length || 0;

  const totalProducts = sellerAnalytics?.totalProducts || 0;
  const totalViews = sellerAnalytics?.totalViews || 0;
  const averagePrice = sellerAnalytics?.averagePrice || 0;
  const availabilityPercentage = sellerAnalytics?.availabilityPercentage || 0;
  const availableProducts = Math.round(
    (totalProducts * availabilityPercentage) / 100
  );

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      description: `${availableProducts} available`,
      icon: Package,
      color: "text-blue-600",
      href: "/seller/products",
    },
    {
      title: "Channels",
      value: totalChannels,
      description: "Registered channels",
      icon: MessageSquare,
      color: "text-green-600",
      href: "/seller/channels",
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      description: "Across all products",
      icon: Eye,
      color: "text-purple-600",
    },
    {
      title: "Avg. Price",
      value: averagePrice > 0 ? `${averagePrice.toFixed(0)} ETB` : "No prices",
      description: "Average product price",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  if (sellerAnalyticsLoading || productsLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="transition-all hover:shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                <stat.icon
                  className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color} flex-shrink-0`}
                />
              </div>
              {stat.href && (
                <Link href={stat.href}>
                  <Button variant="ghost" size="sm" className="mt-2 w-full">
                    Manage
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-6 sm:mb-8">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              Recent Products
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {products && products.length > 0 ? (
              <div className="space-y-3">
                {products.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded-lg transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1 mr-3">
                      <p className="font-medium line-clamp-1 text-sm sm:text-base">
                        {product.title || "Unnamed Product"}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {product.views}
                        </span>
                        <Badge
                          variant={
                            product.isAvailable ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {product.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {product.price && (
                        <p className="font-medium text-sm sm:text-base">
                          {product.price.toLocaleString()} ETB
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <Link href="/seller/products">
                  <Button variant="outline" className="w-full mt-2">
                    View All Products
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <Package className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Products from your channels will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              My Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {channels.slice(0, 3).map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-3 border rounded-lg transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="font-medium line-clamp-1 text-sm sm:text-base">
                      {channel.title || channel.username || "Unnamed Channel"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {channel.participants.toLocaleString()}
                      </span>
                      {channel.verified && (
                        <Badge variant="default" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {channel.totalProducts !== undefined && (
                      <p className="font-medium text-sm sm:text-base">
                        {channel.totalProducts} products
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <Link href="/seller/channels">
                <Button variant="outline" className="w-full mt-2">
                  Manage Channels
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {totalProducts > 0 && (
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {totalViews.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {averagePrice > 0
                    ? `${averagePrice.toFixed(0)} ETB`
                    : "No prices"}
                </p>
                <p className="text-sm text-muted-foreground">Average Price</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-purple-600">
                  {availabilityPercentage.toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Availability Rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
