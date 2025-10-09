import type { NextConfig } from "next";

const API_PROXY_TARGET = process.env.API_PROXY_TARGET || "http://localhost:4000";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Removido "output: export" para permitir rotas dinâmicas
  // Se precisar voltar ao export estático, adicione generateStaticParams nas rotas dinâmicas

  // Configuração de imagens
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'idoe-images.s3.us-east-2.amazonaws.com',
      },
    ],
  },

  // Rewrites para proxy da API em dev
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
