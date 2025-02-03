"use client"

import { useEffect, useState } from "react"
import { Eye, MessageSquare, Share2 } from "lucide-react"
import { format } from "date-fns"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://central-marketplace-backend.onrender.com/products/${params.id}`)
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    
    return <div>Product not found</div>
  }

  return (
    <main className="container py-6">
      <div className="max-w-4xl mx-auto">
        <div className="aspect-video bg-muted rounded-lg mb-6">
          {/* Placeholder for product image */}
          <div className="h-full flex items-center justify-center text-muted-foreground">No Image Available</div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name || "Untitled Product"}</h1>

          <div className="flex gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {product.views} views
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              {product.forwards} forwards
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {product.reactions?.length || 0} reactions
            </span>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p>{product.description || "No description available"}</p>
          </div>

          <div className="text-sm text-muted-foreground">Posted on: {format(new Date(product.posted_at), "PPP")}</div>
        </div>
      </div>
    </main>
  )
}

