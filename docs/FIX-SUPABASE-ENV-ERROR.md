# 🔧 Fix: Missing Supabase Environment Variables Error

## ❌ Error Message

```
Uncaught Error: Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 🎯 What This Means

Your app is trying to use Supabase (for authentication and profiles), but the required environment variables are not set in Vercel.

## ✅ Quick Fix (5 minutes)

### Step 1: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Open your project dashboard
3. Click **Settings** → **API**
4. Copy these values:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2: Add to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. Add these two variables:

**Variable 1:**
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://czwrkvmddpczymlkjqmw.supabase.co` (or your project URL)
- **Environment**: Select **Production**, **Preview**, and **Development**

**Variable 2:**
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Your anon key from Supabase (starts with `eyJ...`)
- **Environment**: Select **Production**, **Preview**, and **Development**

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 4: Verify

1. Visit your website
2. The error should be gone
3. Try logging in/registering to verify it works

## 🔍 How to Verify Variables Are Set

1. In Vercel, go to **Settings** → **Environment Variables**
2. You should see:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🐛 Still Not Working?

### Check 1: Variable Names
- Must be **exactly**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Case-sensitive!
- No extra spaces

### Check 2: Environment Selection
- Make sure variables are set for **Production** (and Preview if needed)
- Variables set only for Development won't work on live site

### Check 3: Redeploy
- After adding variables, you **must redeploy**
- New deployments automatically use the variables
- Old deployments won't have them

### Check 4: Values
- `NEXT_PUBLIC_SUPABASE_URL` should start with `https://`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` should be a long string starting with `eyJ`

## 📝 Example Values

**NEXT_PUBLIC_SUPABASE_URL:**
```
https://czwrkvmddpczymlkjqmw.supabase.co
```

**NEXT_PUBLIC_SUPABASE_ANON_KEY:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3Jrdm1kZHBjenltbGtqcW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.example
```
*(This is just an example - use your actual key from Supabase)*

## 🎓 Why This Happens

- Environment variables are **not** included in your code
- They must be set separately in Vercel
- This is for **security** - secrets shouldn't be in code
- `NEXT_PUBLIC_` prefix makes them available in the browser

## ✅ After Fixing

Once you've added the variables and redeployed:
- ✅ Error will disappear
- ✅ Authentication will work
- ✅ Profile features will work
- ✅ App will function normally

## 🆘 Need Help?

1. Check Vercel deployment logs for errors
2. Verify Supabase project is active
3. Make sure you copied the correct values
4. Try redeploying again

---

**Quick Checklist:**
- [ ] Got Supabase URL and key
- [ ] Added both variables to Vercel
- [ ] Set for Production environment
- [ ] Redeployed the project
- [ ] Verified error is gone

---

**Document Version**: 1.0  
**Last Updated**: 2024

