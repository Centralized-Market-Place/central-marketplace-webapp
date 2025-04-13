import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
