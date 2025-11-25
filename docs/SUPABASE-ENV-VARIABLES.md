# 🔑 Supabase Environment Variables Guide

This guide shows you exactly where to find your Supabase credentials and how to add them to Vercel.

## 📋 Required Environment Variables

You need **2 environment variables** for Supabase:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🔍 Step 1: Get Your Supabase Credentials

### Option A: If You Already Have a Supabase Project

1. **Go to Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sign in to your account

2. **Select Your Project**
   - Click on your project (or create a new one if needed)

3. **Navigate to API Settings**
   - Click **Settings** (gear icon) in the left sidebar
   - Click **API** in the settings menu

4. **Copy Your Credentials**
   
   You'll see a section called **Project API keys** with:
   
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
     - Format: `https://xxxxxxxxxxxxx.supabase.co`
     - Example: `https://czwrkvmddpczymlkjqmw.supabase.co`
   
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Format: Long string starting with `eyJ...`
     - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3Jrdm1kZHBjenltbGtqcW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.example`
   
   ⚠️ **Important**: Use the **anon public** key (not the service_role key)

### Option B: If You Need to Create a Supabase Project

1. **Create Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign up or log in

2. **Create New Project**
   - Click "New Project"
   - Fill in:
     - **Name**: Your project name (e.g., "RentOrent")
     - **Database Password**: Create a strong password (save it!)
     - **Region**: Choose closest to your users
   - Click "Create new project"
   - Wait 2-3 minutes for setup

3. **Get Credentials** (same as Option A, Step 3-4)

---

## 🚀 Step 2: Add to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in to your account

2. **Select Your Project**
   - Click on your project name

3. **Open Settings**
   - Click **Settings** tab (top navigation)
   - Click **Environment Variables** (left sidebar)

4. **Add First Variable**
   - Click **Add New** button
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase Project URL (from Step 1)
     - Example: `https://czwrkvmddpczymlkjqmw.supabase.co`
   - **Environment**: Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **Save**

5. **Add Second Variable**
   - Click **Add New** button again
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon key (from Step 1)
     - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (full long string)
   - **Environment**: Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **Save**

6. **Verify Variables**
   - You should see both variables listed:
     - ✅ `NEXT_PUBLIC_SUPABASE_URL`
     - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste your URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste your anon key when prompted
```

---

## 📝 Example .env.local File (For Local Development)

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://czwrkvmddpczymlkjqmw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3Jrdm1kZHBjenltbGtqcW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.example

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@rentorent.net
SMTP_PASS=your_password
NOTIFICATION_EMAIL=info@abijithcb.com
```

⚠️ **Note**: Replace the example values with your actual credentials!

---

## ✅ Step 3: Redeploy

After adding environment variables:

1. **Go to Deployments**
   - In Vercel, click **Deployments** tab

2. **Redeploy**
   - Click the **three dots** (⋯) on the latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete (2-3 minutes)

3. **Verify**
   - Visit your website
   - Check browser console (should not show Supabase errors)
   - Try logging in/registering

---

## 🔍 How to Verify Variables Are Set

### In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. You should see:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://...supabase.co`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJ...` (long string)

### In Your Website:
1. Open browser console (F12)
2. Should **NOT** see: "Missing Supabase environment variables"
3. Should see: No errors related to Supabase

---

## 🎯 Quick Reference

### Variable Names (Copy These Exactly)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Where to Find Values

**Supabase Dashboard** → **Settings** → **API**:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Where to Add in Vercel

**Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

---

## 🐛 Troubleshooting

### Problem: "Missing Supabase environment variables" error

**Solution**:
1. ✅ Check variable names are **exactly** correct (case-sensitive)
2. ✅ Check values are correct (no extra spaces)
3. ✅ Make sure variables are set for **Production** environment
4. ✅ Redeploy after adding variables

### Problem: Variables set but still not working

**Solution**:
1. ✅ Make sure you **redeployed** after adding variables
2. ✅ Check variable values are correct (copy from Supabase)
3. ✅ Verify in Vercel dashboard that variables are saved
4. ✅ Clear browser cache and try again

### Problem: Can't find Supabase project

**Solution**:
1. ✅ Make sure you're logged into the correct Supabase account
2. ✅ Check if project was deleted or paused
3. ✅ Create a new project if needed

---

## 📸 Visual Guide

### Supabase Dashboard Location

```
Supabase Dashboard
├── Your Project
    └── Settings (⚙️)
        └── API
            ├── Project URL ← Copy this
            └── anon public key ← Copy this
```

### Vercel Dashboard Location

```
Vercel Dashboard
├── Your Project
    └── Settings
        └── Environment Variables
            └── Add New
                ├── Key: NEXT_PUBLIC_SUPABASE_URL
                ├── Value: https://...supabase.co
                └── Environment: Production, Preview, Development
```

---

## 🔒 Security Notes

1. **Never commit** `.env.local` to Git (it's in `.gitignore`)
2. **Use anon key** (not service_role key) for client-side
3. **Keep keys secret** - don't share in screenshots or public places
4. **Rotate keys** if compromised (in Supabase Settings → API)

---

## 📚 Related Documentation

- [Vercel Deployment Guide](./VERCEL-DEPLOYMENT.md) - Complete deployment guide
- [Fix Supabase Error](./FIX-SUPABASE-ENV-ERROR.md) - Troubleshooting guide
- [Database Schema](./02-DATABASE-SCHEMA.md) - Supabase database setup

---

## ✅ Checklist

Before deploying, make sure:

- [ ] Created Supabase project
- [ ] Got Project URL from Supabase
- [ ] Got anon public key from Supabase
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` to Vercel
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel
- [ ] Set both variables for Production environment
- [ ] Redeployed project in Vercel
- [ ] Verified no errors in browser console
- [ ] Tested login/register functionality

---

**Document Version**: 1.0  
**Last Updated**: 2024

