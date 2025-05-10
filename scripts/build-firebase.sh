#!/bin/bash

# Script to build a static export of the Next.js application for Firebase hosting

# Define colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Firebase-optimized static build process...${NC}"

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

# Create a temporary index.tsx with simplified layout
mkdir -p src/pages-backup
cp src/pages/index.tsx src/pages-backup/
echo -e "${YELLOW}Creating a simplified index page for static export...${NC}"

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

# Create a simplified index page
cat > src/pages/index.tsx << 'EOL'
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f121a] text-white">
      <Head>
        <title>BetMaster - Sports Betting Platform</title>
        <meta name="description" content="A modern sports betting platform" />
      </Head>
      
      <div className="container mx-auto px-4 py-12 test-bg">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 test-text">BetMaster</h1>
          <p className="text-xl text-gray-400">Your Ultimate Sports Betting Platform</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-blue-900 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Sports Betting</h2>
            <p className="mb-6">Bet on your favorite sports with competitive odds and real-time updates.</p>
            <div className="flex justify-center">
              <Link href="/api-example" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-semibold transition-colors">
                View Sports
              </Link>
            </div>
          </div>
          
          <div className="bg-blue-900 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
            <p className="mb-6">Manage users, matches, and bets through our comprehensive admin interface.</p>
            <div className="flex justify-center">
              <Link href="/admin" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-semibold transition-colors">
                Admin Access
              </Link>
            </div>
          </div>
        </div>
        
        <footer className="mt-16 text-center text-gray-500">
          <p>© 2025 BetMaster. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
EOL

# Run the build
echo -e "${YELLOW}Building static export...${NC}"
npm run build -- --no-lint

# Check if build succeeded
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Static export built successfully in the 'out' directory!${NC}"
else
  echo -e "${RED}Build failed!${NC}"
  # Restore files and exit
  mv src/pages-backup/index.tsx src/pages/
  rm -rf src/pages-backup
  if [ -d "src/app-temp-backup" ]; then
    mkdir -p src/app
    cp -R src/app-temp-backup/* src/app/
    rm -rf src/app-temp-backup
  fi
  mv next.config.ts.bak next.config.ts
  exit 1
fi

# Create a custom 404 page that redirects to home
echo -e "${YELLOW}Creating Firebase-specific files...${NC}"

# Create a custom firebase.json with better settings
cat > firebase.json << 'EOL'
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "trailingSlash": false,
    "cleanUrls": true,
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "/admin",
        "destination": "/admin.html"
      },
      {
        "source": "/api-example",
        "destination": "/api-example.html"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
EOL

# Restore original files
echo -e "${YELLOW}Restoring original files...${NC}"
mv src/pages-backup/index.tsx src/pages/
rm -rf src/pages-backup

# Restore App Router
if [ -d "src/app-temp-backup" ]; then
  echo -e "${YELLOW}Restoring App Router files...${NC}"
  mkdir -p src/app
  cp -R src/app-temp-backup/* src/app/
  rm -rf src/app-temp-backup
fi

# Keep the modified config for Firebase deployment
echo -e "${YELLOW}Original Next.js config saved as next.config.ts.bak${NC}"

echo -e "${GREEN}Firebase-optimized static build process completed!${NC}"
echo -e "${GREEN}To deploy, run: firebase deploy --only hosting${NC}" 