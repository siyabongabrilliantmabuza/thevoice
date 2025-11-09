# Netlify Environment Variables Setup Guide

## Problem
Your site is stuck loading because the environment variables are missing on Netlify. The app needs these variables to connect to the database and authenticate users.

## Required Environment Variables

Add these to your Netlify site settings:

### 1. Database Connection
```
DATABASE_URL=postgresql://user:password@localhost:5432/peculiar
```

### 2. Authentication
```
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
```

### 3. Next.js
```
NEXT_PUBLIC_API_URL=https://your-netlify-site.netlify.app
```

## How to Add Environment Variables to Netlify

### Step 1: Go to Netlify Dashboard
1. Visit https://app.netlify.com
2. Log in with your account
3. Click on your "thevoice" site

### Step 2: Navigate to Environment Variables
1. Click "Site settings" (top menu)
2. Click "Build & deploy" in left sidebar
3. Click "Environment" section
4. Click "Edit variables"

### Step 3: Add Each Variable
For each variable above:
1. Click "New variable"
2. Enter the Key (e.g., DATABASE_URL)
3. Enter the Value
4. Click "Save"

### Step 4: Redeploy
1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Deploy site"

## Important Notes

⚠️ **DATABASE_URL**: 
- This must be a publicly accessible PostgreSQL database
- Local databases won't work on Netlify
- Consider using a cloud database like:
  - Supabase (https://supabase.com)
  - Railway (https://railway.app)
  - Render (https://render.com)

⚠️ **JWT_SECRET**:
- Must be at least 32 characters long
- Use a strong random string
- Example: `your-super-secret-jwt-key-here-min-32-chars-long-string`

## Quick Test
After adding variables and redeploying, your site should:
1. Load without the "Peculiar" loading screen
2. Show the home page
3. Allow you to log in/register

If still stuck loading, check:
1. Netlify build logs for errors
2. Browser console (F12) for JavaScript errors
3. Network tab to see failed API calls
