"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Product, ProductUpdate } from "@/products/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useProductAction } from "@/products/hooks/useProductAction";

const ProductEditSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be non-negative").optional(),
  location: z.string().optional(),
  categories: z.string().optional(),
  phone: z.string().optional(),
  link: z.string().optional(),
  isAvailable: z.boolean().default(true),
});

type ProductEditFormValues = z.infer<typeof ProductEditSchema>;

interface ProductEditModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductEditModal({
  product,
  isOpen,
  onClose,
}: ProductEditModalProps) {
  const { updateProduct, isUpdating } = useProductAction();

  const form = useForm<ProductEditFormValues>({
    resolver: zodResolver(ProductEditSchema),
    defaultValues: {
      title: product.title || "",
      description: product.description || "",
      price: product.price || 0,
      location: product.location || "",
      categories: product.categories.join(", "),
      phone: product.phone.join(", "),
      link: product.link.join(", "),
      isAvailable: product.isAvailable,
    },
  });

  const formatArrayInput = (value: string): string[] => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const handleSubmit = (data: ProductEditFormValues) => {
    const updateData: ProductUpdate = {
      title: data.title,
      description: data.description,
      price: data.price,
      location: data.location,
      categories: data.categories
        ? formatArrayInput(data.categories)
        : undefined,
      phone: data.phone ? formatArrayInput(data.phone) : undefined,
      isAvailable: data.isAvailable,
    };

    updateProduct({
      productId: product.id,
      productUpdate: updateData,
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update your product information</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdating}
                      placeholder="Product title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isUpdating}
                      placeholder="Product description"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (ETB)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isUpdating}
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isUpdating}
                        placeholder="Product location"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdating}
                      placeholder="electronics, smartphones, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Numbers (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdating}
                      placeholder="+251911234567, +251922345678"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Product Availability
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Mark as available for purchase
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isUpdating}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
