# 🔑 How to Find Your Supabase Keys

## Quick Access Links (Your Project)

**Direct Link to API Settings:**
👉 https://supabase.com/dashboard/project/czwrkvmddpczymlkjqmw/settings/api

---

## 📍 Step-by-Step Instructions

### Step 1: Go to Supabase Dashboard

1. Visit: https://supabase.com/dashboard
2. Sign in to your account
3. You'll see your projects list

### Step 2: Select Your Project

- Click on your project (Project ID: `czwrkvmddpczymlkjqmw`)
- Or use direct link: https://supabase.com/dashboard/project/czwrkvmddpczymlkjqmw

### Step 3: Navigate to API Settings

**Option A: Via Sidebar**
1. Look at the left sidebar
2. Click the **⚙️ Settings** icon (gear icon at the bottom)
3. Click **API** in the settings menu

**Option B: Direct Link**
👉 https://supabase.com/dashboard/project/czwrkvmddpczymlkjqmw/settings/api

### Step 4: Find Your Keys

On the API settings page, you'll see a section called **"Project API keys"** with:

---

## 🔑 Key 1: Supabase URL (Project URL)

**Location:**
- At the top of the API settings page
- Under **"Project URL"** or **"Config"** section

**What it looks like:**
```
https://czwrkvmddpczymlkjqmw.supabase.co
```

**For your project, it's:**
```
NEXT_PUBLIC_SUPABASE_URL=https://czwrkvmddpczymlkjqmw.supabase.co
```

**✅ Already configured in your .env.local**

---

## 🔑 Key 2: Supabase Anon Key (Public Key)

**Location:**
- In the **"Project API keys"** section
- Look for the key labeled **"anon"** and **"public"**

**What it looks like:**
- Long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Usually displayed in a code box with a copy button

**How to copy:**
1. Find the row with **"anon"** and **"public"** labels
2. Click the **📋 Copy** button (eye icon or copy icon)
3. The key is now in your clipboard

**For your .env.local:**
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-the-copied-key-here
```

**⚠️ Important:**
- This is the **anon public** key (safe for client-side use)
- It's protected by Row Level Security (RLS)
- ✅ Safe to use in browser/client code

---

## 🔑 Key 3: Supabase Service Role Key

**Location:**
- In the same **"Project API keys"** section
- Look for the key labeled **"service_role"** and **"secret"**

**What it looks like:**
- Long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Similar format to anon key but different value

**How to copy:**
1. Find the row with **"service_role"** and **"secret"** labels
2. Click the **📋 Copy** button
3. The key is now in your clipboard

**For your .env.local:**
```env
SUPABASE_SERVICE_ROLE_KEY=paste-the-copied-key-here
```

**⚠️ Important:**
- This is the **service_role** key (secret, server-side only)
- **NEVER** expose this in client-side code
- **NEVER** commit this to git (already in .gitignore)
- Only use for server-side operations (API routes, payments, etc.)

---

## 📸 Visual Guide

```
┌─────────────────────────────────────────┐
│  Supabase Dashboard                     │
│                                         │
│  Settings → API                         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Project URL                       │ │
│  │ https://xxxxx.supabase.co         │ │ ← Copy this
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Project API keys                  │ │
│  │                                   │ │
│  │ [anon] [public]  eyJ...          │ │ ← Copy this (anon key)
│  │                  [📋 Copy]        │ │
│  │                                   │ │
│  │ [service_role] [secret]  eyJ...  │ │ ← Copy this (service key)
│  │                     [📋 Copy]     │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## ✅ Complete .env.local Example

After getting all keys, your `.env.local` should look like:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://czwrkvmddpczymlkjqmw.supabase.co

# Supabase Anonymous Key (Public Key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3Jrdm1kZHBjenltbGtqcW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODA1MDAsImV4cCI6MjA3OTU1NjUwMH0.your-actual-key-here

# Supabase Service Role Key (Server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3Jrdm1kZHBjenltbGtqcW13Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk4MDUwMCwiZXhwIjoyMDc5NTU2NTAwfQ.your-actual-key-here
```

---

## 🔒 Security Notes

| Key | Location | Security | Usage |
|-----|----------|----------|-------|
| **URL** | Top of API page | ✅ Public | Client & Server |
| **anon public** | API keys section | ✅ Safe for client | Client-side code |
| **service_role** | API keys section | ⚠️ Secret | Server-side only |

**Remember:**
- ✅ Anon key = Safe to use in browser
- ⚠️ Service role key = NEVER expose in browser
- ✅ All keys are in `.gitignore` (won't be committed)

---

## 🚀 After Adding Keys

1. **Save** `.env.local` file
2. **Restart** your dev server:
   ```bash
   # Stop server (Ctrl+C)
   pnpm dev
   ```
3. **Test** by trying to log in

---

## 🆘 Can't Find the Keys?

**If you don't see the API keys:**
1. Make sure you're logged in to Supabase
2. Make sure you selected the correct project
3. Check that you're in **Settings → API** (not other settings)
4. If still not visible, you might need project owner/admin access

**If the copy button doesn't work:**
1. Click on the key text to select it
2. Press Ctrl+C (Windows) or Cmd+C (Mac) to copy
3. Paste into your `.env.local` file

---

## 📞 Direct Links for Your Project

- **Dashboard**: https://supabase.com/dashboard/project/czwrkvmddpczymlkjqmw
- **API Settings**: https://supabase.com/dashboard/project/czwrkvmddpczymlkjqmw/settings/api

---

**Need more help?** Check the Supabase docs: https://supabase.com/docs/guides/api

