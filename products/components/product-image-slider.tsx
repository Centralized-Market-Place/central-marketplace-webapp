"use client";

import { useRef, useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProductImageSliderProps {
  images: string[];
  altPrefix?: string;
  isModal?: boolean;
  onImageClick?: (image: string, index: number) => void;
  aspectRatio?: "square" | "card" | "modal";
  initialSlide?: number;
}

export function ProductImageSlider({
  images,
  altPrefix = "Product Image",
  isModal = false,
  onImageClick,
  aspectRatio = "square",
  initialSlide = 0,
}: ProductImageSliderProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const sliderType = isModal ? "modal" : "card";

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

  return (
    <div
      className={`${containerHeightClass} relative overflow-hidden bg-muted rounded-md`}
    >
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        modules={[Navigation, Pagination]}
        navigation={{
          prevEl: `.swiper-button-prev-${sliderType}`,
          nextEl: `.swiper-button-next-${sliderType}`,
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
                  className="object-cover cursor-pointer"
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
              className={`swiper-button-prev-${sliderType} absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md cursor-pointer`}
            >
              <ChevronLeft className="h-4 w-4" />
            </div>
            <div
              className={`swiper-button-next-${sliderType} absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md cursor-pointer`}
            >
              <ChevronRight className="h-4 w-4" />
            </div>
          </>
        )}
      </Swiper>
    </div>
  );
}
