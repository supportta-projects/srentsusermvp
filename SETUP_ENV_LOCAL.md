# 🔧 Setup Environment Variables for Local Development

## ❌ Current Error
**"Failed to fetch"** - This happens because your `.env.local` file has placeholder values.

## ✅ Quick Fix (5 minutes)

### Step 1: Get Your Supabase Credentials

1. **Go to Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sign in to your account

2. **Select Your Project**
   - Click on your project (or create a new one if you don't have one)

3. **Get Your Credentials**
   - Click **Settings** (gear icon) → **API**
   - You'll see:
     - **Project URL** - Copy this (looks like: `https://xxxxx.supabase.co`)
     - **anon public** key - Copy this (long string starting with `eyJ...`)

### Step 2: Update `.env.local` File

Open `.env.local` in your project root and replace the placeholder values:

```env
# Replace these with your actual values
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important:**
- Replace `your-actual-project-id` with your actual Supabase project ID
- Replace `your-actual-key-here` with your actual anon public key
- The service role key is optional (only needed for server-side operations like payments)

### Step 3: Restart Your Dev Server

**Stop your current dev server** (Ctrl+C) and **restart it**:

```bash
pnpm dev
```

Or if using npm:
```bash
npm run dev
```

The dev server needs to restart to load the new environment variables.

### Step 4: Test

1. Try logging in again
2. The "Failed to fetch" error should be gone
3. If you still see errors, check the browser console for more details

---

## 🔍 Verify Environment Variables Are Loaded

To check if your environment variables are loaded correctly:

1. Open your browser console (F12)
2. Look for any Supabase-related errors
3. If you see "Missing Supabase environment variables", the `.env.local` file isn't being read

### Common Issues:

**Issue 1: Variables not loading**
- Make sure the file is named exactly `.env.local` (not `.env` or `.env.local.txt`)
- Make sure it's in the project root (same folder as `package.json`)
- Restart your dev server after changing the file

**Issue 2: Still seeing placeholder URL**
- Check that you replaced ALL placeholder values
- Make sure there are no quotes around the values (they should be: `NEXT_PUBLIC_SUPABASE_URL=https://...`)
- Check for typos in variable names

**Issue 3: CORS or network errors**
- Make sure your Supabase project is active (not paused)
- Check that your Supabase URL is correct
- Verify your internet connection

---

## 📝 Example `.env.local` File

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHA6MjAwMDAwMDAwMH0.example
```

---

## ⚠️ Security Notes

- ✅ `.env.local` is already in `.gitignore` - your secrets are safe
- ✅ Never commit `.env.local` to git
- ✅ Never share your `SUPABASE_SERVICE_ROLE_KEY` publicly
- ✅ The `NEXT_PUBLIC_*` variables are safe to expose in client-side code
- ✅ The service role key should only be used server-side

---

## 🆘 Still Having Issues?

1. **Check the console** for specific error messages
2. **Verify your Supabase project** is active and accessible
3. **Double-check your credentials** match what's in Supabase dashboard
4. **Make sure you restarted the dev server** after updating `.env.local`

