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
import { useState, useEffect, useRef } from "react";
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
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
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
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [fullScreenIndex, setFullScreenIndex] = useState<number>(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const searchParams = useSearchParams();
  const { shareProduct, isSharing } = useShareAction(product.id);
  const alert = useAlert();
  const swiperRef = useRef<SwiperType | null>(null);
  const fullScreenSwiperRef = useRef<SwiperType | null>(null);

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

  const openFullScreenImage = (image: string, index: number) => {
    // close the modal first
    onClose();
    setFullScreenImage(image);
    setFullScreenIndex(index);
  };

  const closeFullScreenImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFullScreenImage(null);
  };

  const telegramLink =
    product.channel?.username && product.messageId
      ? `https://t.me/${product.channel.username}/${product.messageId}`
      : null;

  return (
    <>
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
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  modules={[Navigation, Pagination]}
                  navigation={{
                    prevEl: ".swiper-button-prev-modal",
                    nextEl: ".swiper-button-next-modal",
                  }}
                  pagination={{ clickable: true }}
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  className="h-full"
                >
                  {product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="h-full relative">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={product.name || `Product image ${index + 1}`}
                          fill
                          className="object-cover cursor-pointer"
                          onClick={() => openFullScreenImage(image, index)}
                        />
                      </div>
                    </SwiperSlide>
                  ))}

                  {product.images.length > 1 && (
                    <>
                      <div className="swiper-button-prev-modal absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md">
                        <ChevronLeft className="h-4 w-4" />
                      </div>
                      <div className="swiper-button-next-modal absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </>
                  )}
                </Swiper>
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
                        <ExternalLink size={14} />
                        <span>View on Telegram</span>
                      </a>
                    </Button>
                  )}
                </div>
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

              <div className="mb-4">
                <div
                  className={`relative ${
                    isDescriptionExpanded
                      ? "max-h-40 overflow-y-auto pr-2"
                      : "line-clamp-6"
                  }`}
                >
                  <p className="text-muted-foreground">
                    {product.description || "No description available"}
                  </p>
                </div>
                {product.description && product.description.length > 280 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-xs mt-1 h-6 px-2"
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                  >
                    {isDescriptionExpanded ? (
                      <>
                        <ChevronUp size={14} />
                        <span>Show less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} />
                        <span>Show more</span>
                      </>
                    )}
                  </Button>
                )}
              </div>

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
                <p>{product.summary || "No summary available."}</p>
              </div>
            </TabsContent>
            <TabsContent value="comments" className="mt-4">
              <CommentSection productId={product.id} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {fullScreenImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full max-w-screen-xl max-h-screen p-4 md:p-8">
            <Button
              className="absolute right-4 top-4 z-[101] rounded-full bg-black/50 hover:bg-black/70 text-white cursor-pointer"
              size="icon"
              variant="ghost"
              onClick={closeFullScreenImage}
            >
              <X size={24} />
              <span className="sr-only">Close</span>
            </Button>

            <div className="w-full h-full flex items-center justify-center">
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                modules={[Navigation, Pagination]}
                navigation={{
                  prevEl: ".swiper-button-prev-fullscreen",
                  nextEl: ".swiper-button-next-fullscreen",
                }}
                pagination={{ clickable: true }}
                initialSlide={fullScreenIndex}
                onSwiper={(swiper) => (fullScreenSwiperRef.current = swiper)}
                className="w-full h-full flex items-center justify-center"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    className="!flex items-center justify-center h-full"
                  >
                    <div className="flex items-center justify-center h-full">
                      <Image
                        src={image}
                        alt={product.name || `Product image ${index + 1}`}
                        width={1200}
                        height={800}
                        className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}

                {product.images.length > 1 && (
                  <>
                    <div className="swiper-button-prev-fullscreen z-60 absolute left-4 top-1/2 z-[101] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white cursor-pointer">
                      <ChevronLeft className="h-6 w-6" />
                    </div>
                    <div className="swiper-button-next-fullscreen z-60 absolute right-4 top-1/2 z-[101] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white cursor-pointer">
                      <ChevronRight className="h-6 w-6" />
                    </div>
                  </>
                )}
              </Swiper>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
