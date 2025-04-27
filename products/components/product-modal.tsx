"use client";

import type { Product } from "@/products/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { CommentSection } from "@/comments/components/comment-section";
import { Share2, ThumbsDown, ThumbsUp, Eye } from "lucide-react";
import Image from "next/image";
import { cn, formatNumber } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-context";
import { format } from "date-fns";

interface ProductModalProps {
  product: Product;
  handleReaction: (reactionType: "upvote" | "downvote") => void;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
}

export function ProductModal({ product, handleReaction, isLoading, isOpen, onClose }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const { isAuthenticated } = useAuthContext();

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name || "Product",
          text: product.description || "Check out this product",
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full md:max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {product.name || "Unnamed Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-64 md:h-80 w-full rounded-md overflow-hidden">
            {product.images.length > 0 ? (
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name || "Product image"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {product.price !== null && product.price !== undefined && (
              <p className="text-2xl font-bold mb-2">
                ${product.price.toFixed(2)}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
              {/* {product.categories.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))} */}
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye size={16} />
                {formatNumber(product.views)} views
              </span>
              <span className="flex items-center gap-1">
                <Share2 size={16} />
                {formatNumber(product.forwards)} shares
              </span>
            </div>

            <p className="text-muted-foreground mb-4">
              {product.description || "No description available"}
            </p>

            {product.postedAt && (
              <p className="text-sm text-muted-foreground mb-4">
                Posted on: {format(product.postedAt, "PPP")}
              </p>
            )}

            <div className="flex items-center gap-2 mt-auto">
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => handleReaction("upvote")}
                disabled={isLoading || !isAuthenticated}
              >
                <ThumbsUp
                  className={cn(
                    product.userReaction === "upvote" &&
                      "fill-current"
                  )}
                  size={16}
                />
                {formatNumber(product.upvotes)}
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => handleReaction("downvote")}
                disabled={isLoading || !isAuthenticated}
              >
                <ThumbsDown
                  className={cn(
                    product.userReaction === "downvote" &&
                      "fill-current"
                  )}
                  size={16}
                />
                {formatNumber(product.downvotes)}
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-1 ml-auto"
                onClick={handleShare}
              >
                <Share2 size={16} />
                Share
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">
              <div className="flex items-center gap-2">
                <div>Comments</div>{" "}
                <div>
                  {product.comments < 100 ? `(${product.comments})` : `(99+)`}
                </div>{" "}
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Product Summary</h3>
              <p>{product.summary || "No summary available."}</p>

              {/* Additional product details could go here */}
            </div>
          </TabsContent>
          <TabsContent value="comments" className="mt-4">
            <CommentSection productId={product.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
