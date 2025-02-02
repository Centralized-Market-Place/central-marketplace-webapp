"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send as Telegram, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import formatTimestamp from "@/lib/utils/formatTimeStamp";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageUrls: string[];
  channelName: string;
  description: string;
  postedAt: string;
  tags: string[];
}

export default function ProductModal({
  isOpen,
  onClose,
  title,
  imageUrls,
  channelName,
  description,
  postedAt,
  tags,
}: ProductModalProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % imageUrls.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="fixed top-1/2 left-1/2 max-w-lg w-full -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </DialogTitle>
        </DialogHeader>
        {imageUrls.length > 0 && (
          <div className="relative w-full h-48 mt-4 rounded-md overflow-hidden">
            <div
              className="flex w-full h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              {imageUrls.map((url, index) => (
                <div key={index} className="relative w-full flex-shrink-0 h-full">
                  <Image
                    src={url}
                    alt={`Product Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            {currentImage > 0 && (
              <Button
                onClick={prevImage}
                variant="ghost"
                className="absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-transparent to-black/30 flex items-center justify-center hover:bg-transparent hover:shadow-none"
              >
                <ChevronLeft size={16} />
              </Button>
            )}
            {currentImage < imageUrls.length - 1 && (
              <Button
                onClick={nextImage}
                variant="ghost"
                className="absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-transparent to-black/30 flex items-center justify-center hover:bg-transparent hover:shadow-none"
              >
                <ChevronRight size={16} />
              </Button>
            )}
          </div>
        )}
        <DialogDescription className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          {description}
        </DialogDescription>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          From: {channelName} • {formatTimestamp(postedAt)}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <a
            href="#"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-md"
          >
            <Telegram size={16} />
            <span>Go to the channel</span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
