import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        // BACKEND_URL is a server-only env var pointing to the NestJS instance.
        // NEVER use NEXT_PUBLIC_API_URL here — it's now a relative path (/api/v1)
        // which would create a circular rewrite.
        destination: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;