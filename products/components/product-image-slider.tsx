"use client";

import { useRef, useState, useEffect } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProductImageSliderProps {
  images: string[];
  altPrefix?: string;

  onImageClick?: (image: string, index: number) => void;
  aspectRatio?: "square" | "card" | "modal";
  initialSlide?: number;
}

export function ProductImageSlider({
  images,
  altPrefix = "Product Image",
  onImageClick,
  aspectRatio = "square",
  initialSlide = 0,
}: ProductImageSliderProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const navigationId = `swiper-nav-${Math.random().toString(36).substring(7)}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const allImagesFailed =
    images.length > 0 &&
    Object.keys(failedImages).length === images.length &&
    images.every((_, index) => failedImages[index]);

  const containerHeightClass =
    aspectRatio === "modal"
      ? "h-64 md:h-80"
      : aspectRatio === "card"
      ? "h-full"
      : "h-64";

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  if (!images || images.length === 0 || allImagesFailed) {
    return (
      <div
        className={`${containerHeightClass} w-full bg-muted flex items-center justify-center rounded-md`}
      >
        <p className="text-muted-foreground">No Images Available</p>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div
        className={`${containerHeightClass} w-full bg-muted rounded-md animate-pulse`}
      />
    );
  }

  return (
    <div
      className={`${containerHeightClass} relative overflow-hidden bg-muted rounded-md group`}
    >
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        modules={[Navigation, Pagination]}
        navigation={{
          prevEl: `.swiper-button-prev-${navigationId}`,
          nextEl: `.swiper-button-next-${navigationId}`,
        }}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        initialSlide={initialSlide}
        className="h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="h-full relative">
              {!failedImages[index] ? (
                <Image
                  src={image}
                  alt={`${altPrefix} ${index + 1}`}
                  fill
                  className={cn(
                    "object-cover",
                    onImageClick && "cursor-pointer"
                  )}
                  onClick={() => onImageClick && onImageClick(image, index)}
                  onError={() => handleImageError(index)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Image Not Available</p>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}

        {images.length > 1 && (
          <>
            <div
              className={`swiper-button-prev-${navigationId} absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <ChevronLeft className="h-4 w-4" />
            </div>
            <div
              className={`swiper-button-next-${navigationId} absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <ChevronRight className="h-4 w-4" />
            </div>
          </>
        )}
      </Swiper>
    </div>
  );
}
