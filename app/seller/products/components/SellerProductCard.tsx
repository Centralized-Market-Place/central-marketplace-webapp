"use client";

import { useState } from "react";
import { Product } from "@/products/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreVertical,
  Edit,
  Trash2,
  MapPin,
  Phone,
  ExternalLink,
  Eye,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { useProductAction } from "@/products/hooks/useProductAction";
import { ProductEditModal } from "./ProductEditModal";
import { ProductImageSlider } from "@/products/components/product-image-slider";
import { FullScreenImageViewer } from "@/products/components/full-screen-image-viewer";
import { formatNumber } from "@/lib/utils";

interface SellerProductCardProps {
  product: Product;
}

export default function SellerProductCard({ product }: SellerProductCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [fullScreenIndex, setFullScreenIndex] = useState<number>(0);
  const { deleteProduct, isDeleting } = useProductAction();

  const handleDeleteProduct = () => {
    deleteProduct({
      productId: product.id,
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const openFullScreenImage = (image: string, index: number) => {
    setFullScreenImage(image);
    setFullScreenIndex(index);
  };

  const closeFullScreenImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFullScreenImage(null);
  };

  return (
    <>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-80 h-64 lg:h-56 flex-shrink-0 relative">
              {product.images.length > 0 ? (
                <div className="w-full h-full">
                  <ProductImageSlider
                    images={product.images}
                    aspectRatio="card"
                    altPrefix={product.title || "Product"}
                    onImageClick={openFullScreenImage}
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">No Images</p>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 sm:p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <h3 className="text-lg sm:text-xl font-semibold line-clamp-2 mb-2">
                      {product.title || "Unnamed Product"}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {product.price !== null &&
                        product.price !== undefined && (
                          <span className="text-lg sm:text-xl font-bold text-primary">
                            {product.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "ETB",
                            })}
                          </span>
                        )}
                      <Badge
                        variant={product.isAvailable ? "default" : "secondary"}
                        className={
                          product.isAvailable
                            ? "bg-green-100 text-green-800 border-green-200"
                            : ""
                        }
                      >
                        {product.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm sm:text-base line-clamp-2 mb-4">
                    {product.description || "No description available"}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      <span className="hidden xs:inline">
                        {formatNumber(product.views)} views
                      </span>
                      <span className="xs:hidden">
                        {formatNumber(product.views)}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={14} />
                      <span className="hidden xs:inline">
                        {formatNumber(product.upvotes)} likes
                      </span>
                      <span className="xs:hidden">
                        {formatNumber(product.upvotes)}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      <span className="hidden xs:inline">
                        {formatNumber(product.comments)} comments
                      </span>
                      <span className="xs:hidden">
                        {formatNumber(product.comments)}
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm mb-4">
                    {product.location && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin size={14} />
                        <span className="truncate max-w-[100px] sm:max-w-none">
                          {product.location}
                        </span>
                      </span>
                    )}
                    {product.phone.length > 0 && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Phone size={14} />
                        <span className="hidden sm:inline">
                          {product.phone.length} contact
                          {product.phone.length > 1 ? "s" : ""}
                        </span>
                        <span className="sm:hidden">
                          {product.phone.length}
                        </span>
                      </span>
                    )}
                    {product.link.length > 0 && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <ExternalLink size={14} />
                        <span className="hidden sm:inline">
                          {product.link.length} link
                          {product.link.length > 1 ? "s" : ""}
                        </span>
                        <span className="sm:hidden">{product.link.length}</span>
                      </span>
                    )}
                  </div>

                  {product.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {product.categories.slice(0, 3).map((category, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {category}
                        </Badge>
                      ))}
                      {product.categories.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.categories.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setIsEditModalOpen(true)}
                      >
                        <Edit size={16} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="text-destructive"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProductEditModal
        product={product}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{product.title}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {product.images.length > 0 && (
        <FullScreenImageViewer
          images={product.images}
          isOpen={fullScreenImage !== null}
          initialIndex={fullScreenIndex}
          productName={product.title || "Product"}
          onClose={closeFullScreenImage}
        />
      )}
    </>
  );
}
