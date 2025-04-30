"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProductModal } from "./product-modal";
import {
  MessageSquare,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Eye,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import { cn, formatNumber } from "@/lib/utils";
import { useReaction } from "@/comments/hooks/useReaction";
import { useAuthContext } from "@/providers/auth-context";
import { SwiperSlide, Swiper } from "swiper/react";
import { Product } from "../schema";
import { useBookmarkAction } from "../hooks/useBookmarkAction";
import { useProduct } from "../hooks/useProduct";

interface ProductCardProps {
  prod: Product;
}

export function ProductCard({ prod }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuthContext();
  const { createReaction, isLoading: isReactionLoading } = useReaction(prod.id);
  const { product, isLoading } = useProduct(prod.id);
  const { addBookmark, removeBookmark, isAddingBookmark, isRemovingBookmark } =
    useBookmarkAction(prod.id);

  const handleBookmark = () => {
    if (!isAuthenticated || !product) return;

    if (product.isBookmarked) {
      removeBookmark({});
    } else {
      addBookmark({});
    }
  };

  const handleReaction = (reactionType: "upvote" | "downvote") => {
    if (!isAuthenticated || !product) return;

    createReaction({
      reactionSave: {
        targetId: product.id,
        targetType: "product",
        reactionType,
      },
    });
  };

  if (!product || isLoading) {
    return (
      <div className="h-[28rem] bg-muted animate-pulse rounded-lg"></div>
    );
  }

  return (
    <>
      <Card className="h-[28rem] flex flex-col transition-all duration-200 hover:shadow-md">
        <CardHeader className="h-[14rem] p-0 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <div className="h-full relative overflow-hidden bg-muted">
              <Swiper spaceBetween={10} slidesPerView={1}>
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="h-full relative">
                      <Image
                        src={image}
                        alt={`Product Image ${index + 1}`}
                        objectFit="cover"
                        width={500}
                        height={500}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="h-full relative bg-muted">
              <p className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No Images Available
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="h-[9rem] p-4 overflow-hidden">
          <h3 className="font-semibold text-lg line-clamp-1">
            {product.name || "Unnamed Product"}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 mt-1">
            {product.description || "No description available"}
          </p>
          {product.price !== null && product.price !== undefined && (
            <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
          )}
        </CardContent>
        <CardFooter className="h-[5rem] p-4 pt-0 flex flex-col gap-2">
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {formatNumber(product.views)}
              </span>
              <span className="flex items-center gap-1">
                <Share2 size={14} />
                {formatNumber(product.forwards)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <MessageSquare size={14} className="mr-1" />
              View Details
            </Button>
          </div>
          {user && (
            <div className="w-full flex justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleReaction("upvote")}
                  disabled={isReactionLoading}
                >
                  <ThumbsUp
                    size={14}
                    className={cn(
                      product.userReaction === "upvote" && "fill-current"
                    )}
                  />
                  {formatNumber(product?.upvotes || 0)}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleReaction("downvote")}
                  disabled={isReactionLoading}
                >
                  <ThumbsDown
                    size={14}
                    className={cn(
                      product.userReaction === "downvote" && "fill-current"
                    )}
                  />
                  {formatNumber(product.downvotes)}
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-center"
                onClick={() => handleBookmark()}
                disabled={isReactionLoading || isAddingBookmark || isRemovingBookmark}
              >
                <Bookmark
                  size={14}
                  className={cn(product.isBookmarked && "fill-current")}
                />
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        isLoading={isLoading}
        handleReaction={handleReaction}
        handleBookmark={handleBookmark}
        isBookmarkLoading={isAddingBookmark || isRemovingBookmark}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
