import type { NextConfig } from "next";

const API_PROXY_TARGET = process.env.API_PROXY_TARGET || 'http://localhost:4000';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Produce a static export suitable for S3 + CloudFront
  output: 'export',
  // Rewrites are useful for local dev; they are ignored in static export
  async rewrites() {
    // Prefer direct calls via NEXT_PUBLIC_API_BASE_URL in production
    if (isProd || process.env.NEXT_PUBLIC_API_BASE_URL) {
      return [];
    }
    return [
      {
        source: '/api/:path*',
        destination: `${API_PROXY_TARGET}/:path*`,
      },
    ];
  },
};

export default nextConfig;
