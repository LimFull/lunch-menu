import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['hcafe.hgreenfood.com', 'upload.wikimedia.org'],
  },
  serverExternalPackages: [],
  // Vercel 배포를 위한 설정
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
