# Supabase Setup Guide - Manual Steps

## Overview
Your Peculiar app needs a cloud database to work on Netlify. Supabase provides a free PostgreSQL database that's perfect for this.

## Step-by-Step Setup

### Step 1: Create Supabase Account
1. Go to **https://supabase.com**
2. Click **"Start your project"** button
3. Click **"Continue with GitHub"**
4. Sign in with your GitHub account:
   - Username: `siyabongabrilliantmabuza1`
   - Password: `Jayrollie2004$`
5. Authorize Supabase to access your GitHub account

### Step 2: Create a New Project
1. After signing in, click **"New project"**
2. Fill in the form:
   - **Project name**: `peculiar`
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., `eu-west-1` for Europe)
3. Click **"Create new project"**
4. Wait 2-3 minutes for the database to be created

### Step 3: Get Your Database Connection String
1. Once the project is created, go to **Settings** (bottom left)
2. Click **"Database"** in the left sidebar
3. Scroll down to **"Connection string"**
4. Click the **"Connection pooling"** tab
5. Copy the entire connection string (it looks like):
   ```
   postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

### Step 4: Update Your Environment Variables

You now have:
- **DATABASE_URL**: The connection string from Step 3
- **JWT_SECRET**: `kLbY2QIlg9+eH3FmlbsoQxY5XWv+i1is23UCh2FDIA4=`
- **NEXT_PUBLIC_API_URL**: Your Netlify site URL (e.g., `https://thevoice-xxxxx.netlify.app`)

### Step 5: Add Variables to Netlify
1. Go to **https://app.netlify.com**
2. Log in with your email: `siyabongabrilliantmabuza18@gmail.com`
3. Click on your **"thevoice"** site
4. Click **"Site settings"** (top menu)
5. Click **"Build & deploy"** → **"Environment"**
6. Click **"Edit variables"**
7. Add these three variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste the connection string from Step 3 |
| `JWT_SECRET` | `kLbY2QIlg9+eH3FmlbsoQxY5XWv+i1is23UCh2FDIA4=` |
| `NEXT_PUBLIC_API_URL` | Your Netlify URL (check Deploys tab) |

### Step 6: Redeploy on Netlify
1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for the build to complete
4. Your site should now load! 🎉

## Troubleshooting

### Site still shows "Peculiar" loading
- Check that all three environment variables are set correctly
- Make sure DATABASE_URL doesn't have any extra spaces
- Check Netlify build logs for errors

### Database connection errors
- Verify the connection string is correct
- Make sure Supabase project is still running
- Check that the password in the connection string is correct

### Need help?
- Supabase docs: https://supabase.com/docs
- Netlify docs: https://docs.netlify.com

## Your Generated Credentials

**JWT_SECRET** (already generated for you):
```
kLbY2QIlg9+eH3FmlbsoQxY5XWv+i1is23UCh2FDIA4=
```

This is a cryptographically secure random string. Keep it safe!
