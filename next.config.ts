import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    console.log("Using API from ", API_URL);

    if (process.env.NODE_ENV === "test") {
      console.log("Running in test mode");
      return [];
    } else {
      return [
        {
          source: "/api/:path*",
          destination: `${API_URL}/api/:path*`,
        },
      ];
    }
  },
  output: "standalone",
};

export default nextConfig;
