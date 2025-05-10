# Betting Platform Deployment Guide

This document provides detailed instructions for deploying the betting platform to Vercel (frontend) and Supabase (for future database migration).

## Prerequisites

- GitHub account (for code repository)
- Vercel account (for frontend hosting)
- Supabase account (for database)
- Firebase project (current database)

## Step 1: Environment Setup

### Create Environment Variables

Create a `.env.local` file in your project root with the following variables:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id

# Sports API configuration
NEXT_PUBLIC_SPORTS_API_KEY=your-sports-api-key
NEXT_PUBLIC_SPORTS_API_BASE_URL=https://www.thesportsdb.com/api/v1/json/

# Supabase configuration (for future migration)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Custom environment variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**IMPORTANT**: Do not commit this file to your repository.

## Step 2: GitHub Repository Setup

1. Create a new GitHub repository
2. Initialize git in your project and push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

## Step 3: Vercel Deployment

1. Log in to your [Vercel account](https://vercel.com/)
2. Click on "Add New" > "Project"
3. Import your GitHub repository
4. In the "Configure Project" screen:
   - Framework preset: Next.js
   - Root Directory: ./
   - Build Command: next build
   - Output Directory: .next

5. Add Environment Variables:
   - Click on "Environment Variables"
   - Add all variables from your `.env.local` file

6. Click "Deploy"

After deployment, you can access your site at the provided Vercel URL.

## Step 4: Custom Domain Setup (Optional)

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain and follow the verification process

## Step 5: Supabase Setup (for future migration)

### Create a Supabase Project

1. Log in to [Supabase](https://supabase.com/)
2. Click "New Project"
3. Enter project details:
   - Name: betting-platform (or your preferred name)
   - Database Password: Create a secure password
   - Region: Choose closest to your users
4. Click "Create new project"

### Get API Keys

1. In your Supabase project dashboard, go to "Settings" > "API"
2. Copy the "URL" and "anon public" key
3. Add these to your Vercel environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

### Database Migration Preparation

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project:
   ```bash
   supabase init
   ```

3. When ready to migrate from Firebase, you'll need to:
   - Export data from Firebase Firestore
   - Transform data to match Supabase schema
   - Import data into Supabase using the Supabase CLI

## Step 6: Update Firebase Rules and Indexes

Make sure your Firebase security rules and indexes are properly configured for production:

1. Log in to your Firebase console
2. Go to Firestore Database > Rules
3. Update rules to ensure proper security in production
4. Review and create any necessary indexes

## Step 7: Monitoring and Analytics

1. Set up monitoring in Vercel:
   - Go to your project > Analytics
   - Enable Web Vitals and real-time monitoring

2. Set up Firebase Analytics:
   - In Firebase console, go to Analytics
   - Configure events and conversions

## Step 8: Continuous Deployment

Vercel automatically deploys when you push to your main branch. To enable preview deployments for PR branches:

1. Go to Vercel project > Settings > Git
2. Make sure "Include source files outside of the Root Directory" is enabled

## Troubleshooting

### Common Issues

1. **Environment Variables Not Working**: Verify they're correctly set in Vercel and restart deployment if needed.

2. **Firebase Authentication Issues**: Make sure your Firebase project has the correct authentication methods enabled.

3. **CORS Issues**: If using Supabase, ensure CORS is configured properly.

### Support Resources

- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
- Firebase Documentation: https://firebase.google.com/docs

## Important Security Notes

1. Never expose your API keys in client-side code without proper restrictions
2. Set up proper Firebase security rules
3. When using Supabase, set up Row Level Security (RLS) policies
4. Implement rate limiting for all API endpoints

## Maintenance

Regular maintenance tasks:

1. Update dependencies monthly
2. Monitor Vercel and Firebase usage to avoid unexpected charges
3. Regularly back up your database
4. Review security settings quarterly 