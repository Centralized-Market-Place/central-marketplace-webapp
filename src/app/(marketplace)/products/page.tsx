// File: /src/app/(marketplace)/page.tsx

import ProductCard from "@/components/shared/ProductCard";

export default function MarketplacePage() {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6 p-4">
      <ProductCard
        title="Samsung Galaxy S21"
        channelImgUrl="/sample.JPG"
        imageUrls={["/sample.JPG", "/sample.JPG", "/sample.JPG"]}
        description="Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. "
        channelName="Tech Deals Ethiopia"
        postedAt="2021-09-01T12:00:00Z"
        tags={['electronics', 'smartphone', 'new']}
        likes={34}
        dislikes={2}
      />

      <ProductCard
        title="MacBook Pro 2021"
        channelImgUrl="/sample.JPG"
        imageUrls={["/sample.JPG", "/sample.JPG", "/sample.JPG"]}
        description="Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. "
        channelName="Apple Deals Ethiopia"
        postedAt="2024-11-01T12:00:00Z"
        tags={['laptop', 'apple', 'pro']}
        likes={58}
        dislikes={4}
      />
      <ProductCard
        title="MacBook Pro 2021"
        channelImgUrl="/sample.JPG"
        imageUrls={["/sample.JPG", "/sample.JPG", "/sample.JPG"]}
        description="Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. "
        channelName="Apple Deals Ethiopia"
        postedAt="2025-01-01T12:00:00Z"
        tags={['laptop', 'apple', 'pro']}
        likes={58}
        dislikes={4}
      />
      <ProductCard
        title="MacBook Pro 2021"
        channelImgUrl="/sample.JPG"
        imageUrls={["/pc.jpg", "/sample.JPG", "/pc.jpg"]}
        description="Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. "
        channelName="Apple Deals Ethiopia"
        postedAt="2025-02-01T12:00:00Z"
        tags={['laptop', 'apple', 'pro']}
        likes={58}
        dislikes={4}
      />
      <ProductCard
        title="MacBook Pro 2021"
        channelImgUrl="/sample.JPG"
        imageUrls={["/pc.JPG", "/sample.JPG", "/sample.JPG"]}
        description="Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. Hello Oltad. "
        channelName="Apple Deals Ethiopia"
        postedAt="2025-01-27T12:00:00Z"
        tags={['laptop', 'apple', 'pro']}
        likes={58}
        dislikes={4}
      />
      </div>
    </div>
  );
}
