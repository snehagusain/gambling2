# Static Export Guide for Betting Platform

This guide explains how to create a static export of the betting platform for deployment on static hosting services.

## What is a Static Export?

A static export is a version of your Next.js application that doesn't require a Node.js server to run. It generates HTML, CSS, and JavaScript files that can be deployed to any static hosting service like:

- Vercel (static deployment)
- Netlify
- GitHub Pages
- Amazon S3
- Google Cloud Storage
- Azure Static Web Apps

## Important Limitations

When using a static export, the following features will NOT be available:

1. **Server-side API routes** (/api/*)
2. **Server Components** (App Router)
3. **Server Actions**
4. **Dynamic routes** that use getServerSideProps
5. **Authentication** that requires server-side validation

The static export is best suited for:
- Marketing sites
- Documentation
- Simple landing pages
- Preview environments

## Building a Static Export

### Method 1: Using the Build Script

We've created a convenience script that handles all the necessary configuration changes to build a static export:

```bash
# Make sure the script is executable
chmod +x scripts/build-static.sh

# Run the script
./scripts/build-static.sh
```

This script will:
1. Back up your current Next.js configuration
2. Create a temporary configuration for static export
3. Temporarily disable the App Router (which isn't compatible with static exports)
4. Build the static export to the `out` directory
5. Restore your original configuration

### Method 2: Manual Process

If you prefer to do it manually:

1. Update your `next.config.ts` file:
   ```typescript
   const nextConfig: NextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     // Remove any server-related config like headers, rewrites, etc.
   };
   ```

2. If you're using App Router, temporarily move it:
   ```bash
   mkdir -p src/app-backup
   mv src/app/* src/app-backup/
   ```

3. Build the project:
   ```bash
   npm run build -- --no-lint
   ```

4. Restore your configuration:
   ```bash
   # Restore next.config.ts
   # Move App Router files back
   ```

## Testing the Static Export

To test the static export locally:

```bash
npx serve -p 8080 out
```

Then open your browser to `http://localhost:8080` to view the static site.

## Deployment

### Vercel

For Vercel, you can configure your project to use static exports:

1. In your Vercel project settings, go to "Build & Development Settings"
2. Set the Output Directory to "out"

### Other Platforms

For other platforms, simply upload the contents of the `out` directory to your hosting service.

## Recommended Approach

For the betting platform, we recommend:

1. Use static export for preview environments and marketing pages
2. Use the full Next.js server deployment for the main application to maintain all functionality
3. Consider a hybrid approach where specific pages that don't require server functionality are exported statically

## Troubleshooting

If you encounter issues:

1. **Missing CSS**: Make sure global styles are copied from App Router to src/styles
2. **API routes not working**: Remember, API routes are not available in static exports
3. **Authentication not working**: Add client-side fallbacks for authentication features 