# Environment Variables Setup

## 🔑 Where to Find Supabase Environment Variables

### Step 1: Get Your Supabase Credentials

1. **Go to Supabase Dashboard**
   - Visit: [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sign in to your account

2. **Select Your Project**
   - Click on your project (or create a new one)

3. **Get API Credentials**
   - Click **Settings** (⚙️) in left sidebar
   - Click **API** in settings menu
   - You'll see:
     - **Project URL** → This is `NEXT_PUBLIC_SUPABASE_URL`
     - **anon public** key → This is `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2: Add to Local Development

1. **Create `.env.local` file** in project root:
   ```bash
   # Create file (or copy from .env.example if it exists)
   touch .env.local
   ```

2. **Add your Supabase credentials:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   **Example** (replace with your actual values):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://czwrkvmddpczymlkjqmw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3Jrdm1kZHBjenltbGtqcW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODA1MDAsImV4cCI6MjA3OTU1NjUwMH0.foHLZQVXyf7aAVWArZKGsYDaFzvBw4FpYVXDOp8Ko04
   ```

### Step 3: Add to Vercel (For Production)

See **[SUPABASE-ENV-VARIABLES.md](./docs/SUPABASE-ENV-VARIABLES.md)** for complete Vercel setup guide.

**Quick Steps:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_SUPABASE_URL` with your Project URL
3. Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your anon key
4. Set for Production, Preview, and Development
5. Redeploy your project

3. **Restart your Next.js dev server** after adding/updating environment variables:
   ```bash
   # Stop the server (Ctrl+C) and restart
   pnpm dev
   ```

## Important Notes

- ⚠️ **Never commit `.env.local`** to version control (it's already in `.gitignore`)
- ✅ The anon key is safe to use in client-side code (it's protected by Row Level Security)
- ✅ Use `NEXT_PUBLIC_` prefix for variables that need to be accessible in the browser
- ✅ Variables without `NEXT_PUBLIC_` are server-only

## Verification

After setting up, verify the Supabase client is working:

1. Start the dev server: `pnpm dev`
2. Navigate to `/register` or `/login`
3. You should see the auth forms without any errors
4. If you see "Supabase env vars missing", check:
   - `.env.local` exists in the project root
   - Variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - You've restarted the dev server after adding the variables

