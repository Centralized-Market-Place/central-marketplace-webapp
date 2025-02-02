"use client";
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import formatTimestamp from '@/lib/utils/formatTimeStamp';
import ProductModal from './ProductModal';

interface ProductCardProps {
  title: string;
  channelImgUrl: string;
  imageUrls: string[];
  channelName: string;
  description: string;
  tags: string[];
  postedAt: string;
  likes: number;
  dislikes: number;
}

export default function ProductCard({
  title,
  channelImgUrl,
  imageUrls,
  description,
  channelName,
  postedAt,
  tags,
  likes,
  dislikes,
}: ProductCardProps) {
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      setLikeCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disliked) {
      setDislikeCount((prev) => prev + 1);
      setDisliked(true);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % imageUrls.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const displayedTags = showAllTags ? tags : tags.slice(0, 2);

  const handleCardClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <Card onClick={handleCardClick} className="cursor-pointer w-full max-w-xs rounded-xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow border-[0.1px] hover:border-gray-300 dark:hover:border-gray-700">
        <CardHeader className="flex flex-col space-y-1">
          <div className="flex gap-2 items-center">
            <Image
              src={channelImgUrl}
              alt="Channel Logo"
              width={30}
              height={30}
              className="rounded-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">From: {channelName}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold truncate">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-md">
              {formatTimestamp(postedAt)}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="relative w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
            {imageUrls.length > 0 ? (
              <>
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
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">No Image</p>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
            {description.length > 60 ? (
              <>
                {description.substring(0, 60)}
                <span onClick={(e) => { e.stopPropagation(); setModalOpen(true); }} className="text-blue-500">...</span>
              </>
            ) : (
              description
            )}
          </p>

          <div className="flex flex-wrap gap-1 mt-1">
            {displayedTags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-[10px] px-1 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 2 && !showAllTags && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowAllTags(true); }}
                className="text-gray-500 dark:text-gray-400 text-[10px] px-1 py-0.5 rounded-md"
              >
                +{tags.length - 2}
              </button>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-1 border border-gray-200 dark:border-gray-700 rounded-md p-0.5 gap-4 px-2">
            <Button
              variant="ghost"
              onClick={(e) => handleLike(e)}
              className={`flex items-center text-[10px] ${liked ? 'text-green-500' : 'text-gray-500'} hover:text-green-500 p-0 h-7`}
            >
              <ThumbsUp size={10} />
              <span>{likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              onClick={(e) => handleDislike(e)}
              className={`flex items-center space-x-1 text-[10px] ${disliked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 p-0 h-7`}
            >
              <ThumbsDown size={10} />
              <span>{dislikeCount}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {modalOpen && (
        <ProductModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={title}
          imageUrls={imageUrls}
          channelName={channelName}
          description={description}
          postedAt={postedAt}
          tags={tags}
        />
      )}
    </>
  );
}
