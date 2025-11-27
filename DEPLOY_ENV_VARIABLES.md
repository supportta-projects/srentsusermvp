# 🚀 How to Deploy Environment Variables to Vercel and GitHub

## ⚠️ CRITICAL SECURITY RULE

**NEVER commit `.env.local` to GitHub!** 

Your `.env.local` file contains sensitive keys and is already in `.gitignore`. It will NOT be committed to GitHub, which is correct and secure.

---

## 📍 Part 1: Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Sign in to your account
3. Select your project (or create a new one)

### Step 2: Navigate to Environment Variables

1. Click on your project
2. Go to **Settings** tab
3. Click **Environment Variables** in the left sidebar

### Step 3: Add Supabase Variables

Add each variable one by one:

#### Variable 1: Supabase URL

1. Click **"Add New"** button
2. **Key**: `NEXT_PUBLIC_SUPABASE_URL`
3. **Value**: `https://czwrkvmddpczymlkjqmw.supabase.co`
4. **Environment**: Select all three:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. Click **Save**

#### Variable 2: Supabase Anon Key

1. Click **"Add New"** button again
2. **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3Jrdm1kZHBjenltbGtqcW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODA1MDAsImV4cCI6MjA3OTU1NjUwMH0.foHLZQVXyf7aAVWArZKGsYDaFzvBw4FpYVXDOp8Ko04`
4. **Environment**: Select all three:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **Save**

#### Variable 3: Supabase Service Role Key (Optional)

1. Click **"Add New"** button
2. **Key**: `SUPABASE_SERVICE_ROLE_KEY`
3. **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3Jrdm1kZHBjenltbGtqcW13Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk4MDUwMCwiZXhwIjoyMDc5NTU2NTAwfQ.cyAB6EVi6-R4xylgC42h7oyqt80UHwWMzC2GZQ73S6Y`
4. **Environment**: Select all three:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **Save**

### Step 4: Redeploy Your Project

After adding all variables:

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **three dots** (⋯) menu
4. Click **Redeploy**
5. Wait for deployment to complete

**✅ Your Vercel deployment now has the environment variables!**

---

## 📍 Part 2: GitHub Repository (Template Only - NO Secrets)

### ⚠️ IMPORTANT: What to Commit

**DO commit:**
- ✅ `.env.example` (template with placeholder values)
- ✅ Documentation files

**DON'T commit:**
- ❌ `.env.local` (contains real keys - already in .gitignore)
- ❌ `.env` (already in .gitignore)
- ❌ Any file with real API keys

### Step 1: Verify .gitignore is Set

Your `.gitignore` already has:
```
.env*.local
.env
```

This means `.env.local` will **NOT** be committed to GitHub. ✅

### Step 2: Commit .env.example (Template)

The `.env.example` file is a template that other developers can copy:

```bash
# Check if .env.example exists
git status

# Add .env.example (if not already committed)
git add .env.example

# Commit
git commit -m "Add .env.example template for environment variables"

# Push to GitHub
git push origin main
```

### Step 3: Verify Nothing Sensitive is Committed

Before pushing, verify your `.env.local` won't be committed:

```bash
# Check what will be committed
git status

# Make sure .env.local is NOT in the list
```

---

## 📍 Part 3: GitHub Secrets (For CI/CD Workflows)

If you have GitHub Actions workflows (like `.github/workflows/deploy.yml`), you can add secrets there:

### Step 1: Go to GitHub Repository Settings

1. Open your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Repository Secrets

Click **"New repository secret"** and add:

#### Secret 1: Supabase URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://czwrkvmddpczymlkjqmw.supabase.co`
- Click **Add secret**

#### Secret 2: Supabase Anon Key
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3Jrdm1kZHBjenltbGtqcW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODA1MDAsImV4cCI6MjA3OTU1NjUwMH0.foHLZQVXyf7aAVWArZKGsYDaFzvBw4FpYVXDOp8Ko04`
- Click **Add secret**

#### Secret 3: Service Role Key (Optional)
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3Jrdm1kZHBjenltbGtqcW13Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk4MDUwMCwiZXhwIjoyMDc5NTU2NTAwfQ.cyAB6EVi6-R4xylgC42h7oyqt80UHwWMzC2GZQ73S6Y`
- Click **Add secret**

**Note:** GitHub Secrets are only accessible in GitHub Actions workflows, not in your code directly.

---

## 📋 Quick Checklist

### Vercel Setup:
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` to Vercel
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY` to Vercel (optional)
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Redeployed project

### GitHub Setup:
- [ ] Verified `.env.local` is NOT being committed
- [ ] Committed `.env.example` template (optional, for other developers)
- [ ] Added GitHub Secrets (if using CI/CD workflows)

---

## 🔍 How to Verify Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. You should see:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` (if added)

3. Check that all are enabled for Production, Preview, and Development

---

## 🔍 How to Verify .gitignore is Working

Run this command to check:

```bash
git status
git check-ignore .env.local
```

If `.gitignore` is working:
- `git status` should NOT show `.env.local`
- `git check-ignore .env.local` should return `.env.local`

---

## 🚀 After Setup

1. **Vercel**: Your next deployment will automatically use the environment variables
2. **GitHub**: Your code is safe (no secrets committed)
3. **Local**: Your `.env.local` works for local development

---

## 📝 Summary

| Platform | What to Do | Status |
|----------|-----------|--------|
| **Vercel** | Add environment variables via dashboard | ✅ Required |
| **GitHub** | Only commit `.env.example` template | ✅ Safe (no secrets) |
| **GitHub Secrets** | Add secrets for CI/CD workflows | ⚠️ Optional |
| **Local (.env.local)** | Keep local, never commit | ✅ Already protected |

---

## 🆘 Troubleshooting

### Issue: Variables not working in Vercel
- ✅ Check variable names are exact (case-sensitive)
- ✅ Verify environments are selected (Production, Preview, Development)
- ✅ Redeploy after adding variables

### Issue: Accidentally committed .env.local
If you accidentally committed `.env.local`:

```bash
# Remove from git history (but keep local file)
git rm --cached .env.local

# Commit the removal
git commit -m "Remove .env.local from git"

# Push
git push origin main

# IMPORTANT: Rotate your keys in Supabase (they're now in git history)
```

Then generate new keys from Supabase Dashboard → Settings → API → Reset API Keys

---

**✅ Your environment variables are now properly configured for both local development and production deployment!**

