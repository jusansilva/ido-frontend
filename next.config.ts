import type { NextConfig } from "next";

const API_PROXY_TARGET = process.env.API_PROXY_TARGET || "http://localhost:4000";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Gera export estático para S3 + CloudFront
  output: "export",

  // Desativa o otimizador de imagens do Next.js (/_next/image)
  images: {
    unoptimized: true,
  },

  // Rewrites são ignorados no export estático (só ajudam no dev local)
  async rewrites() {
    if (isProd || process.env.NEXT_PUBLIC_API_BASE_URL) {
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: `${API_PROXY_TARGET}/:path*`,
      },
    ];
  },
};

export default nextConfig;
