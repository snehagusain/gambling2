#!/bin/bash

# Script to build a static export of the Next.js application

# Define colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting static build process...${NC}"

# Backup current next.config.ts
echo -e "${YELLOW}Backing up Next.js config...${NC}"
cp next.config.ts next.config.ts.bak

# Update next.config.ts for static export
echo -e "${YELLOW}Updating config for static export...${NC}"
cat > next.config.ts << 'EOL'
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
EOL

# Temporarily backup and remove App Router content
if [ -d "src/app" ]; then
  echo -e "${YELLOW}Temporarily backing up App Router files...${NC}"
  mkdir -p src/app-temp-backup
  cp -R src/app/* src/app-temp-backup/
  rm -rf src/app
fi

# Make sure styles are available
if [ ! -d "src/styles" ]; then
  echo -e "${YELLOW}Creating styles directory...${NC}"
  mkdir -p src/styles
fi

# Copy global CSS if needed
if [ -f "src/app-temp-backup/globals.css" ] && [ ! -f "src/styles/globals.css" ]; then
  echo -e "${YELLOW}Copying global CSS...${NC}"
  cp src/app-temp-backup/globals.css src/styles/globals.css
fi

# Run the build
echo -e "${YELLOW}Building static export...${NC}"
npm run build -- --no-lint

# Check if build succeeded
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Static export built successfully in the 'out' directory!${NC}"
else
  echo -e "${RED}Build failed!${NC}"
fi

# Restore App Router
if [ -d "src/app-temp-backup" ]; then
  echo -e "${YELLOW}Restoring App Router files...${NC}"
  mkdir -p src/app
  cp -R src/app-temp-backup/* src/app/
  rm -rf src/app-temp-backup
fi

# Restore the original config
echo -e "${YELLOW}Restoring original Next.js config...${NC}"
mv next.config.ts.bak next.config.ts

echo -e "${GREEN}Static build process completed!${NC}"
echo -e "${GREEN}To preview the site, run: npx serve -p 8080 out${NC}" 