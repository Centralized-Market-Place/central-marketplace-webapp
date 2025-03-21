"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { Product } from "@/products/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        {product.images && product.images.length > 0 ? (
          <div className="h-64 relative overflow-hidden rounded-lg bg-muted">
            <Swiper spaceBetween={10} slidesPerView={1}>
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="h-64 relative">
                    <Image
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      sizes="size-64"
                      className="rounded-lg"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="aspect-square relative bg-muted rounded-lg">
            <p className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No Images Available
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <h3 className="font-semibold truncate mb-2">
          {product.name || "Untitled Product"}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.description || "No description available"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {product.views}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            {product.forwards}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {product.reactions?.length || 0}
          </span>
        </div>
        {/* Uncomment the Link below if you wish to enable the detail view */}
        <Link href={`/product/${product.id}`}>
          <Button variant="secondary" size="sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
