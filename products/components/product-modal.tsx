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
  CheckCircle,
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
import { ReportButton } from "@/reports/components/report-button";

import { ProductImageSlider } from "./product-image-slider";
import { ProductDescription } from "./product-description";
import { Badge } from "@/components/ui/badge";

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
  const [isClosing, setIsClosing] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const searchParams = useSearchParams();
  const { shareProduct, isSharing } = useShareAction(product.id);
  const alert = useAlert();

  useEffect(() => {
    if (!isClosing) {
      const currentTab = searchParams.get("tab");
      if (currentTab === "comments" || currentTab === "details") {
        setActiveTab(currentTab);
      }
    }
  }, [searchParams, isClosing]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

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

  const telegramLink =
    product.channel?.username && product.messageId
      ? `https://t.me/${product.channel.username}/${product.messageId}`
      : null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsClosing(true);
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
              altPrefix={product.title || "Product"}
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 font-medium"
                    asChild
                  >
                    <Link href={`/channels/${product.channel.id}`}>
                      {product.channel.title || product.channel.username}
                    </Link>
                  </Button>
                  {product.channel.isSellerVerified && (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle size={12} className="mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
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
                className="flex items-center justify-center px-2"
                onClick={() => handleBookmark()}
                disabled={isLoading || isBookmarkLoading || !isAuthenticated}
              >
                <Bookmark
                  size={14}
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
                disabled={!isAuthenticated}
              />

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
              <div className="space-y-3">
                {/* Availability Status */}
                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <span className="font-medium">Availability</span>
                  <Badge
                    variant={product.isAvailable ? "default" : "secondary"}
                  >
                    {product.isAvailable ? "Available" : "Not Available"}
                  </Badge>
                </div>

                {/* Location */}
                {product.location && (
                  <div className="flex items-start justify-between">
                    <span className="font-medium text-sm">Location:</span>
                    <span className="text-sm text-muted-foreground max-w-[200px] text-right">
                      {product.location}
                    </span>
                  </div>
                )}

                {/* Contact Information */}
                {product.phone && product.phone.length > 0 && (
                  <div className="flex items-start justify-between">
                    <span className="font-medium text-sm">Contact:</span>
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      {product.phone.map((phone, index) => (
                        <a
                          key={index}
                          href={`tel:${phone}`}
                          className="text-sm text-primary hover:underline text-right"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* External Links */}
                {product.link && product.link.length > 0 && (
                  <div className="flex items-start justify-between">
                    <span className="font-medium text-sm">Links:</span>
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      {product.link.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline text-right flex items-center gap-1"
                        >
                          <span className="truncate">{link}</span>
                          <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Engagement Metrics */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Engagement</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Views:</span>
                      <span>{formatNumber(product.views)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Forwards:</span>
                      <span>{formatNumber(product.forwards)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Comments:</span>
                      <span>{formatNumber(product.comments)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shares:</span>
                      <span>{formatNumber(product.shares)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Timestamps */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Timeline</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Posted:</span>
                      <span>{format(product.date, "PPp")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Added:</span>
                      <span>{format(product.createdAt, "PPp")}</span>
                    </div>
                    {product.createdAt.getTime() !==
                      product.updatedAt.getTime() && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Updated:</span>
                        <span>{format(product.updatedAt, "PPp")}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Telegram Information */}
                {(product.messageId || product.telegramChannelId) && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Telegram Info</h4>
                      <div className="space-y-1 text-sm">
                        {product.messageId && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Message ID:
                            </span>
                            <span className="font-mono">
                              {product.messageId}
                            </span>
                          </div>
                        )}
                        {product.telegramChannelId && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Channel ID:
                            </span>
                            <span className="font-mono">
                              {product.telegramChannelId}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
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
