# Manual Deployment Steps - Follow These Exactly

## ⚠️ IMPORTANT: GitHub Password Issue

The GitHub password `Jayrollie2004$` is not working for authentication. 

**You need to:**
1. Go to https://github.com/settings/tokens
2. Create a Personal Access Token with "repo" scope
3. Use that token instead of your password for authentication

OR reset your GitHub password at https://github.com/password_reset

---

## STEP 1: Create Supabase Database

### 1.1 Go to Supabase
- Open: https://supabase.com
- Click "Start your project"

### 1.2 Sign Up with GitHub
- Click "Continue with GitHub"
- Use your GitHub credentials (username: siyabongabrilliantmabuza1)
- Authorize Supabase

### 1.3 Create New Project
- Click "New project"
- Fill in:
  - **Project name**: `peculiar`
  - **Database password**: Create a strong password (save it!)
  - **Region**: Choose closest to you
- Click "Create new project"
- Wait 2-3 minutes for database to be created

### 1.4 Get Connection String
1. Once created, click **Settings** (bottom left)
2. Click **Database** in sidebar
3. Scroll to **Connection string**
4. Click **Connection pooling** tab
5. Copy the entire URI (looks like):
   ```
   postgresql://postgres.[id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
6. **Save this - you'll need it next!**

---

## STEP 2: Add Environment Variables to Netlify

### 2.1 Go to Netlify
- Open: https://app.netlify.com
- Log in with: siyabongabrilliantmabuza18@gmail.com / Jayrollie2004$

### 2.2 Navigate to Environment Variables
1. Click on your **"thevoice"** site
2. Click **"Site settings"** (top menu)
3. Click **"Build & deploy"** in left sidebar
4. Click **"Environment"** section
5. Click **"Edit variables"**

### 2.3 Add Three Variables
Click "New variable" for each:

**Variable 1:**
- Key: `DATABASE_URL`
- Value: [Paste the connection string from Supabase Step 1.4]

**Variable 2:**
- Key: `JWT_SECRET`
- Value: `kLbY2QIlg9+eH3FmlbsoQxY5XWv+i1is23UCh2FDIA4=`

**Variable 3:**
- Key: `NEXT_PUBLIC_API_URL`
- Value: `https://thevoice-xxxxx.netlify.app` (replace xxxxx with your Netlify subdomain)

### 2.4 Save Variables
- Click "Save" for each variable
- All three should now be listed

---

## STEP 3: Redeploy on Netlify

### 3.1 Trigger Redeploy
1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** button
3. Click **"Deploy site"**

### 3.2 Wait for Build
- Watch the build progress
- Should complete in 2-3 minutes
- You'll see a green checkmark when done

### 3.3 Your Site is LIVE!
- Click on the deploy to see your live URL
- It will be something like: `https://thevoice-xxxxx.netlify.app`
- Visit it to see your Peculiar platform!

---

## ✅ Expected Results

After deployment, your site should:
- ✅ Load without "Peculiar" loading screen
- ✅ Show the home page with posts
- ✅ Allow you to register a new account
- ✅ Allow you to log in
- ✅ Show messages page
- ✅ Show user profiles
- ✅ Allow you to create posts

---

## 🐛 Troubleshooting

### Site still shows "Peculiar" loading
- Check all 3 environment variables are set correctly
- Make sure DATABASE_URL has no extra spaces
- Check Netlify build logs for errors

### "Incorrect username or password" on GitHub
- Your GitHub password might be wrong
- Create a Personal Access Token instead: https://github.com/settings/tokens
- Use the token for authentication

### Database connection error
- Verify Supabase project is running
- Check connection string is correct
- Make sure database password is correct

---

## 📝 Your Credentials Summary

**GitHub:**
- Username: siyabongabrilliantmabuza1
- Password: [Create Personal Access Token if password doesn't work]
- Repository: https://github.com/siyabongabrilliantmabuza/thevoice

**Netlify:**
- Email: siyabongabrilliantmabuza18@gmail.com
- Password: Jayrollie2004$

**JWT Secret:**
- kLbY2QIlg9+eH3FmlbsoQxY5XWv+i1is23UCh2FDIA4=

---

## ⏱️ Total Time: ~15 minutes

- Supabase setup: 5 minutes
- Add environment variables: 3 minutes
- Redeploy: 2 minutes
- Test: 1 minute

**You're almost there! Follow these steps and your site will be live!** 🚀
