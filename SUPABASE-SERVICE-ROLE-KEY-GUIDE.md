# How to Get Supabase Service Role Key

## 📍 Where to Find It

### Step-by-Step Instructions

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Login with your account

2. **Select Your Project**
   - Click on your project (e.g., "Rentorent" or your project name)

3. **Navigate to Settings**
   - Click on the **Settings** icon (gear icon) in the left sidebar
   - Or go to: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings`

4. **Go to API Settings**
   - Click on **API** in the settings menu
   - Or directly go to: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api`

5. **Find Service Role Key**
   - Scroll down to the **Project API keys** section
   - You'll see two keys:
     - **anon** `public` key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
     - **service_role** `secret` key (this is your `SUPABASE_SERVICE_ROLE_KEY`)

6. **Copy the Service Role Key**
   - Click the **eye icon** or **reveal** button next to `service_role` key
   - Click **Copy** to copy the key
   - ⚠️ **WARNING**: This key has admin privileges - never expose it to the frontend!

## 🔐 Visual Guide

```
Supabase Dashboard
├── Your Project
│   ├── Settings (⚙️)
│   │   ├── API
│   │   │   └── Project API keys
│   │   │       ├── anon public (NEXT_PUBLIC_SUPABASE_ANON_KEY)
│   │   │       └── service_role secret (SUPABASE_SERVICE_ROLE_KEY) ← YOU NEED THIS
```

## 📝 Add to Environment Variables

### Local Development (.env.local)

Add this line to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here  # ← Add this
```

### Vercel Production

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Paste your service role key
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your application for changes to take effect

## ⚠️ Security Warnings

1. **Never expose to frontend**: The service role key bypasses Row Level Security (RLS)
2. **Never commit to Git**: Always use environment variables
3. **Only use server-side**: This key should only be used in:
   - Next.js API routes (`/api/*`)
   - Server components
   - Server-side functions
4. **Keep it secret**: Treat it like a password

## 🔍 How to Verify It's Working

After adding the key, check your server logs:

**Before (Error):**
```
⚠️ Supabase service role key not configured. Payment operations will fail at runtime.
Error: SUPABASE_SERVICE_ROLE_KEY is not configured. Cannot create order.
```

**After (Success):**
```
✅ Order created successfully
✅ Payment event logged
```

## 📋 Quick Checklist

- [ ] Logged into Supabase Dashboard
- [ ] Selected correct project
- [ ] Navigated to Settings → API
- [ ] Found `service_role` key
- [ ] Copied the key
- [ ] Added to `.env.local` (local)
- [ ] Added to Vercel environment variables (production)
- [ ] Redeployed application (if on Vercel)
- [ ] Verified no more errors in logs

## 🔗 Direct Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **API Settings**: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api`
- **Vercel Environment Variables**: `https://vercel.com/YOUR_PROJECT/settings/environment-variables`

## 💡 Alternative: Using Supabase CLI

If you prefer command line:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Get service role key (if available via CLI)
# Note: Service role key is usually only available in dashboard
```

## 🆘 Still Can't Find It?

1. **Check Project Access**: Make sure you're the project owner or have admin access
2. **Check Project Selection**: Ensure you selected the correct project
3. **Contact Support**: If you're a collaborator, ask the project owner for the key
4. **Create New Key**: If needed, you can create a new service role key (though this is rare)

## 📚 Related Documentation

- Supabase API Keys: https://supabase.com/docs/guides/api/api-keys
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security
- Environment Variables: https://supabase.com/docs/guides/getting-started/local-development#environment-variables

