import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, MessageSquare, Share2 } from "lucide-react"
import Link from "next/link"

interface ProductCardProps {
  product: {
    id: string
    name: string | null
    description: string | null
    views: number
    forwards: number
    reactions: [string, number][]
    posted_at: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="aspect-square relative bg-muted rounded-lg">
          {/* Placeholder image */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">No Image</div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <h3 className="font-semibold truncate mb-2">{product.name || "Untitled Product"}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.description || "No description available"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {product.views}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            {product.forwards}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {product.reactions?.length || 0}
          </span>
        </div>
        <Link href={`/product/${product.id}`}>
          <Button variant="secondary" size="sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

