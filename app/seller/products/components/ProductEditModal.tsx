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
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  price: z
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(999999999, "Price is too high"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(100, "Location must be less than 100 characters"),
  phone: z.string().min(1, "At least one phone number is required"),
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
      phone: product.phone.join(", "),
      isAvailable: product.isAvailable,
    },
  });

  const formatArrayInput = (value: string): string[] => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const validatePhoneNumbers = (phones: string[]): boolean => {
    return phones.every((phone) => {
      // Only validate that it contains numbers, spaces, and basic formatting characters
      return /^[\d\s\-\+\(\)]+$/.test(phone) && /\d/.test(phone);
    });
  };

  const handleSubmit = (data: ProductEditFormValues) => {
    const phoneNumbers = formatArrayInput(data.phone);

    // Additional validation
    if (phoneNumbers.length === 0) {
      form.setError("phone", {
        message: "At least one phone number is required",
      });
      return;
    }

    if (!validatePhoneNumbers(phoneNumbers)) {
      form.setError("phone", {
        message:
          "Please enter valid phone numbers (numbers only, with optional formatting)",
      });
      return;
    }

    const updateData: ProductUpdate = {
      title: data.title,
      description: data.description,
      price: data.price,
      location: data.location,
      phone: phoneNumbers,
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
          <DialogDescription>
            Update your product information. All fields are required.
          </DialogDescription>
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
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdating}
                      placeholder="Enter product title"
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
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isUpdating}
                      placeholder="Enter detailed product description"
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
                    <FormLabel>Price (ETB) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        disabled={isUpdating}
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
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
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isUpdating}
                        placeholder="Enter location (e.g., Addis Ababa)"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Numbers (comma-separated) *</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdating}
                      placeholder="0911234567, 0922345678"
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
