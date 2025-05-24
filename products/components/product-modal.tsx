"use client";

import type { Product } from "@/products/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  Forward,
  Badge,
} from "lucide-react";
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
import Link from "next/link";

// Import shared components
import { ProductImageSlider } from "./product-image-slider";
import { FullScreenImageViewer } from "./full-screen-image-viewer";
import { ProductDescription } from "./product-description";

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
  isOpen: isModalOpenProp,
  onClose,
}: ProductModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [fullScreenIndex, setFullScreenIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(isModalOpenProp);
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

  useEffect(() => {
    setIsModalOpen(isModalOpenProp);
  }, [isModalOpenProp]);

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
    const text = product.title || "Check out this product";
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

  const openFullScreenImage = (image: string, index: number) => {
    setFullScreenImage(image);
    setFullScreenIndex(index);
    setIsModalOpen(false);
  };

  const closeFullScreenImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFullScreenImage(null);
    setIsModalOpen(true);
  };

  const telegramLink =
    product.channel?.username && product.messageId
      ? `https://t.me/${product.channel.username}/${product.messageId}`
      : null;

  return (
    <>
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open && fullScreenImage === null) {
            onClose();
          }
        }}
      >
        <DialogContent className="w-full md:max-w-3xl max-h-[90vh] overflow-y-auto hide-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {product.title || "Unnamed Product"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Product details and information
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="w-full rounded-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <ProductImageSlider
                images={product.images}
                aspectRatio="modal"
                isModal={true}
                altPrefix={product.title || "Product"}
                onImageClick={openFullScreenImage}
              />
            </div>

            <div className="flex flex-col">
              {product.price !== null && product.price !== undefined && (
                <p className="text-2xl font-bold mb-2">
                  {product.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "ETB",
                  })}
                </p>
              )}

              {product.channel && (
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-sm">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 font-medium"
                      asChild
                    >
                      <Link
                        href={`/channels/${product.channel.id}`}
                        className="flex items-center gap-1"
                      >
                        {product.channel.title || product.channel.username}
                      </Link>
                    </Button>
                  </p>
                  {telegramLink && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      asChild
                    >
                      <a
                        href={telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <span>View on Telegram</span>
                        <ExternalLink size={14} />
                      </a>
                    </Button>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                {product.categories.map((category) => (
                  <Badge key={category}>{category}</Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye size={16} />
                  {formatNumber(product.views)} views
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Forward
                    size={16}
                    className={product.forwards > 0 ? "text-primary" : ""}
                  />
                  {formatNumber(product.forwards)} forwards
                </span>
              </div>

              <ProductDescription
                description={product.description}
                className="mb-4"
              />

              {product.date && (
                <p className="text-sm text-muted-foreground mb-4">
                  Posted on: {format(product.date, "PPP")}
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
                  disabled={isLoading || isBookmarkLoading || !isAuthenticated}
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
                      {product.shares > 0 &&
                        `(${formatNumber(product.shares)})`}
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
              </div>
            </TabsContent>
            <TabsContent value="comments" className="mt-4">
              <CommentSection productId={product.id} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <FullScreenImageViewer
        images={product.images}
        isOpen={fullScreenImage !== null}
        initialIndex={fullScreenIndex}
        productName={product.title || "Product"}
        onClose={closeFullScreenImage}
      />
    </>
  );
}
