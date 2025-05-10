/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Remove output: 'export' to enable SSR/ISR
  // Set the base path if needed
  // basePath: '',
  images: {
    unoptimized: false, // Enable image optimization
  },
  distDir: '.next',
  // exportPathMap has been removed
}

module.exports = nextConfig 