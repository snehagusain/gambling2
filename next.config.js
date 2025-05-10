/** @type {import('next').NextConfig} */
const nextConfig = {
  // Config for dynamic rendering (SSR/ISR)
  
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 