#!/bin/bash

# Betting Platform Deployment Script
# This script helps with deploying to Vercel

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local file not found!"
    echo "Please create .env.local with your environment variables."
    exit 1
fi

# Run linting and build checks
echo "Running checks before deployment..."
npm run lint || { echo "Linting failed!"; exit 1; }
npm run build || { echo "Build failed!"; exit 1; }

# Update robots.txt with the correct domain
read -p "Enter your production domain (e.g. betting-platform.vercel.app): " DOMAIN
if [ -n "$DOMAIN" ]; then
    sed -i '' "s|https://your-domain.com|https://$DOMAIN|g" public/robots.txt
    echo "Updated robots.txt with domain: $DOMAIN"
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete! Your app should be live soon."
echo "Don't forget to set up your environment variables in the Vercel dashboard." 