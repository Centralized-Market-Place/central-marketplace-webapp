"use client";

import { useRef, useState, useEffect } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface FullScreenImageViewerProps {
  images: string[];
  isOpen: boolean;
  initialIndex: number;
  productName?: string;
  onClose: (e: React.MouseEvent) => void;
}

export function FullScreenImageViewer({
  images,
  isOpen,
  initialIndex,
  productName = "Product",
  onClose,
}: FullScreenImageViewerProps) {
  const fullScreenSwiperRef = useRef<SwiperType | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose(e as unknown as React.MouseEvent);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && fullScreenSwiperRef.current) {
      fullScreenSwiperRef.current.update();
    }
  }, [isOpen]);

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose(e);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the overlay background
    if (e.target === e.currentTarget) {
      onClose(e);
    }
  };

  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full h-full max-w-screen-xl max-h-screen p-4 md:p-8">
        <Button
          className="absolute right-4 top-4 z-[101] rounded-full bg-black/50 hover:bg-black/70 text-white cursor-pointer"
          size="icon"
          variant="ghost"
          onClick={handleCloseClick}
          type="button"
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
            initialSlide={initialIndex}
            onSwiper={(swiper) => (fullScreenSwiperRef.current = swiper)}
            observer={true}
            observeParents={true}
            className="w-full h-full flex items-center justify-center"
          >
            {images.map((image, index) => (
              <SwiperSlide
                key={index}
                className="!flex items-center justify-center h-full"
              >
                <div className="flex items-center justify-center h-full">
                  {!failedImages[index] ? (
                    <Image
                      src={image}
                      alt={`${productName} image ${index + 1}`}
                      width={1200}
                      height={800}
                      className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain"
                      onError={() => handleImageError(index)}
                    />
                  ) : (
                    <div className="bg-black/50 rounded-md p-8">
                      <p className="text-white/70">Image Not Available</p>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}

            {images.length > 1 && (
              <>
                <div
                  className="swiper-button-prev-fullscreen absolute left-4 top-1/2 z-[101] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ChevronLeft className="h-6 w-6" />
                </div>
                <div
                  className="swiper-button-next-fullscreen absolute right-4 top-1/2 z-[101] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ChevronRight className="h-6 w-6" />
                </div>
              </>
            )}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
