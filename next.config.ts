import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Note: output: 'standalone' is removed - not compatible with Cloudflare Workers
  // OpenNext handles the output format automatically
  turbopack: {
    root: __dirname,
  },

  images: {
    // Disable image optimization - Cloudflare Workers doesn't have IMAGES binding
    // Images are proxied via /api/douban/image instead
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.doubanio.com' },
      { protocol: 'https', hostname: '**.com' },
      { protocol: 'http', hostname: '**.com' },
      { protocol: 'https', hostname: '**.cn' },
      { protocol: 'http', hostname: '**.cn' },
      { protocol: 'https', hostname: '**.net' },
      { protocol: 'https', hostname: '**.tv' },
      { protocol: 'https', hostname: '**.io' },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
