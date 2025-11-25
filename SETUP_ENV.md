# Environment Variables Setup

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` and add your Supabase credentials:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://czwrkvmddpczymlkjqmw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3Jrdm1kZHBjenltbGtqcW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODA1MDAsImV4cCI6MjA3OTU1NjUwMH0.foHLZQVXyf7aAVWArZKGsYDaFzvBw4FpYVXDOp8Ko04
   ```

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

