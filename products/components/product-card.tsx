"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ProductModal } from "./product-modal";
import {
  MessageSquare,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Eye,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { useReaction } from "@/comments/hooks/useReaction";
import { useAuthContext } from "@/providers/auth-context";
import { Product } from "../schema";
import { useBookmarkAction } from "../hooks/useBookmarkAction";
import { useProduct } from "../hooks/useProduct";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductImageSlider } from "./product-image-slider";
import { FullScreenImageViewer } from "./full-screen-image-viewer";
import { ReportButton } from "@/reports/components/report-button";

interface ProductCardProps {
  prod: Product;
}

export function ProductCard({ prod }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [fullScreenIndex, setFullScreenIndex] = useState<number>(0);
  const { user, isAuthenticated } = useAuthContext();
  const { createReaction, isLoading: isReactionLoading } = useReaction(prod.id);
  const { product, isLoading } = useProduct(prod.id);
  const { addBookmark, removeBookmark, isAddingBookmark, isRemovingBookmark } =
    useBookmarkAction(prod.id);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const productIdParam = searchParams.get("productId");
    if (productIdParam === prod.id) {
      setIsModalOpen(true);
    }
  }, [searchParams, prod.id]);

  const handleModalOpen = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("productId", prod.id);

    if (!params.has("tab")) {
      params.set("tab", "details");
    }

    router.push(`?${params.toString()}`, { scroll: false });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("productId");
      params.delete("tab");

      router.push(
        params.toString() ? `?${params.toString()}` : window.location.pathname,
        { scroll: false }
      );
    }, 150);
  };

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

  const openFullScreenImage = (image: string, index: number) => {
    setFullScreenImage(image);
    setFullScreenIndex(index);
  };

  const closeFullScreenImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFullScreenImage(null);
  };

  if (!product || isLoading) {
    return <div className="h-[28rem] bg-muted animate-pulse rounded-lg"></div>;
  }

  const telegramLink =
    product.channel?.username && product.messageId
      ? `https://t.me/${product.channel.username}/${product.messageId}`
      : null;

  return (
    <>
      <Card className="h-[28rem] flex flex-col transition-all duration-200 hover:shadow-md">
        <CardHeader className="h-[14rem] p-0 overflow-hidden">
          <ProductImageSlider
            images={product.images}
            aspectRatio="card"
            altPrefix={product.title || "Product"}
            onImageClick={openFullScreenImage}
          />
        </CardHeader>
        <CardContent className="h-[9rem] p-4 overflow-hidden">
          <h3 className="font-semibold text-lg line-clamp-1">
            {product.title || "Unnamed Product"}
          </h3>

          {product.channel && (
            <div className="flex items-center text-sm text-muted-foreground mt-1 mb-1">
              <span className="line-clamp-1">
                {product.channel.title ||
                  product.channel.username ||
                  "Unknown Channel"}
              </span>
              {telegramLink && (
                <Link
                  href={telegramLink}
                  target="_blank"
                  className="ml-1 inline-flex items-center text-primary hover:underline"
                >
                  <ExternalLink size={12} className="ml-1" />
                </Link>
              )}
            </div>
          )}

          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
            {product.description || "No description available"}
          </p>
          {product.price !== null && product.price !== undefined && (
            <p className="font-bold mt-1">
              {product.price.toLocaleString("en-US", {
                style: "currency",
                currency: "ETB",
              })}
            </p>
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
                <Share2
                  size={14}
                  className={product.shares > 0 ? "text-primary" : ""}
                />
                {formatNumber(product.shares)}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleModalOpen}>
              <MessageSquare size={14} className="mr-1" />
              View Details
            </Button>
          </div>
          {user && (
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 px-2"
                  onClick={() => handleReaction("upvote")}
                  disabled={isReactionLoading}
                >
                  <ThumbsUp
                    size={12}
                    className={cn(
                      product.userReaction === "upvote" && "fill-current"
                    )}
                  />
                  {formatNumber(product?.upvotes || 0)}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 px-2"
                  onClick={() => handleReaction("downvote")}
                  disabled={isReactionLoading}
                >
                  <ThumbsDown
                    size={12}
                    className={cn(
                      product.userReaction === "downvote" && "fill-current"
                    )}
                  />
                  {formatNumber(product.downvotes)}
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center px-2"
                  onClick={() => handleBookmark()}
                  disabled={
                    isReactionLoading ||
                    isAddingBookmark ||
                    isRemovingBookmark ||
                    !isAuthenticated
                  }
                >
                  <Bookmark
                    size={12}
                    className={cn(product.isBookmarked && "fill-current")}
                  />
                </Button>
                <ReportButton
                  targetId={product.id}
                  targetType="PRODUCT"
                  targetTitle={product.title || "Product"}
                  variant="outline"
                  size="sm"
                  className="px-2"
                  showText={false}
                />
              </div>
            </div>
          )}
        </CardFooter>
      </Card>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        isLoading={isReactionLoading}
        handleReaction={handleReaction}
        handleBookmark={handleBookmark}
        isBookmarkLoading={isAddingBookmark || isRemovingBookmark}
        onClose={handleModalClose}
      />

      {product.images.length > 0 && (
        <FullScreenImageViewer
          images={product.images}
          isOpen={fullScreenImage !== null}
          initialIndex={fullScreenIndex}
          productName={product.title || "Product"}
          onClose={closeFullScreenImage}
        />
      )}
    </>
  );
}
