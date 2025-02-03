"use client"

import { use, useEffect, useState } from "react"
import { Eye, MessageSquare, Share2 } from "lucide-react"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = use(params)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [product, setProduct] = useState<any>()
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://central-marketplace-backend.onrender.com/products/${id}`)
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  // Normalize the posted date string (limit fractional seconds to 3 digits)
  const normalizeDateString = (dateString?: string): string =>
    dateString ? dateString.replace(/(\.\d{3})\d+/, "$1") : ""
  const normalizedDateString = normalizeDateString(product.posted_at)
  const postedDate = new Date(normalizedDateString)
  const formattedDate = !isNaN(postedDate.getTime())
    ? postedDate.toLocaleDateString()
    : "Unknown Date"

  const images: string[] = product.images || []
  const hasImages = images.length > 0

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  return (
    <main className="container py-6">
      <div className="max-w-4xl mx-auto">
        {/* Image Slider */}
        <div className="relative  sm:w-4/5 sm:h-4/5 bg-muted rounded-lg mb-6 overflow-hidden mx-auto">
          {hasImages ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={`Product Image ${currentImageIndex + 1}`}
                className="object-cover w-full h-full cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 px-3 py-1 rounded-full"
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 px-3 py-1 rounded-full"
                  >
                    Next
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No Image Available
            </div>
          )}
        </div>

        {/* Modal Popup */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded"
              >
                Close
              </button>
              <img
                src={images[currentImageIndex]}
                alt={`Product Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-screen rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">
            {product.name || "Untitled Product"}
          </h1>

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

          <div className="text-sm text-muted-foreground">
            Posted on: {formattedDate}
          </div>
        </div>
      </div>
    </main>
  )
}
