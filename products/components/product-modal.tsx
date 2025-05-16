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
import { useState, useEffect } from "react";
import { CommentSection } from "@/comments/components/comment-section";
import {
  Share2,
  ThumbsDown,
  ThumbsUp,
  Eye,
  Bookmark,
  Copy,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { cn, formatNumber } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-context";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useShareAction } from "../hooks/useShareAction";
import { useAlert } from "@/providers/alert-provider";

interface ProductModalProps {
  product: Product;
  handleReaction: (reactionType: "upvote" | "downvote") => void;
  handleBookmark: () => void;
  isBookmarkLoading: boolean;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
}

export function ProductModal({
  product,
  handleReaction,
  isLoading,
  handleBookmark,
  isBookmarkLoading,
  isOpen,
  onClose,
}: ProductModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const { isAuthenticated } = useAuthContext();
  const searchParams = useSearchParams();
  const { shareProduct, isSharing } = useShareAction(product.id);
  const alert = useAlert();

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab === "comments" || currentTab === "details") {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);

    window.history.replaceState({}, "", url.toString());
  };

  const getShareableUrl = () => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("productId", product.id);
    url.searchParams.set("tab", activeTab);
    return url.toString();
  };

  const handleCopyLink = () => {
    const url = getShareableUrl();
    navigator.clipboard.writeText(url);

    alert?.success("Product link copied to clipboard");
    if (isAuthenticated) {
      shareProduct({});
    }
  };

  const handleTelegramShare = () => {
    const url = getShareableUrl();
    const text = product.name || "Check out this product";
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`;

    if (isAuthenticated) {
      shareProduct({
        onSuccess: () => {
          window.open(telegramUrl, "_blank");
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full md:max-w-3xl max-h-[90vh] overflow-y-auto hide-scrollbar">
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
              <span className="flex items-center gap-1 font-medium">
                <Share2
                  size={16}
                  className={product.shares > 0 ? "text-primary" : ""}
                />
                {formatNumber(product.shares)} shares
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={16} />
                {formatNumber(product.comments)} comments
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
                    product.userReaction === "upvote" && "fill-current"
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
                    product.userReaction === "downvote" && "fill-current"
                  )}
                  size={16}
                />
                {formatNumber(product.downvotes)}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-center"
                onClick={() => handleBookmark()}
                disabled={isLoading || isBookmarkLoading}
              >
                <Bookmark
                  size={14}
                  className={cn(product.isBookmarked && "fill-current")}
                />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 ml-auto"
                    disabled={!isAuthenticated || isSharing}
                  >
                    <Share2 size={16} />
                    Share{" "}
                    {product.shares > 0 && `(${formatNumber(product.shares)})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Copy size={16} className="mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleTelegramShare}>
                    <ExternalLink size={16} className="mr-2" />
                    Share on Telegram
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
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
