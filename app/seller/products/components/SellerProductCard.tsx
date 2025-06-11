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
  DollarSign,
  MapPin,
  Phone,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useProductAction } from "@/products/hooks/useProductAction";
import { ProductEditModal } from "./ProductEditModal";

interface SellerProductCardProps {
  product: Product;
}

export default function SellerProductCard({ product }: SellerProductCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deleteProduct, isDeleting } = useProductAction();

  const handleDeleteProduct = () => {
    deleteProduct({
      productId: product.id,
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {product.images.length > 0 && (
              <div className="flex-shrink-0">
                <Image
                  src={product.images[0]}
                  alt={product.title || "Product"}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover w-30 h-30"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold line-clamp-1">
                    {product.title || "Unnamed Product"}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DollarSign size={14} />
                      {product.price
                        ? `${product.price.toLocaleString()} ETB`
                        : "No price"}
                    </span>
                    <Badge
                      variant={product.isAvailable ? "default" : "secondary"}
                    >
                      {product.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
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

              <p className="text-muted-foreground line-clamp-2 mb-3">
                {product.description || "No description available"}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                {product.location && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin size={14} />
                    {product.location}
                  </span>
                )}
                {product.phone.length > 0 && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Phone size={14} />
                    {product.phone.length} contact
                    {product.phone.length > 1 ? "s" : ""}
                  </span>
                )}
                {product.link.length > 0 && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <ExternalLink size={14} />
                    {product.link.length} link
                    {product.link.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {product.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {product.categories.map((category, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
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
    </>
  );
}
