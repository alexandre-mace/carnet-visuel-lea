import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  serverActions: {
    // Limit uploads to 2 MB for Server Actions
    bodySizeLimit: "2mb",
  },
};

export default nextConfig;
