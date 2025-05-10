import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'export',
  images: {
    domains: ['www.thesportsdb.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    unoptimized: true, // Required for static export
  },
  env: {
    APP_ENV: process.env.NODE_ENV || 'production',
  },
};

export default nextConfig;
