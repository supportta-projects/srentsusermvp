# 🔑 Supabase Environment Variables - Values Only

## Required Variables for Vercel

### Variable 1:
**Name:** `NEXT_PUBLIC_SUPABASE_URL`  
**Value:** Your Supabase Project URL  
**Format:** `https://xxxxxxxxxxxxx.supabase.co`  
**Get from:** Supabase Dashboard → Settings → API → Project URL

### Variable 2:
**Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
**Value:** Your Supabase Anon Public Key  
**Format:** Long string starting with `eyJ...`  
**Get from:** Supabase Dashboard → Settings → API → anon public key

---

## 📍 Where to Find in Supabase

1. **Go to:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Select your project**
3. **Click:** Settings (⚙️ icon) → **API**
4. **Copy:**
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📝 Example (Replace with Your Values)

```env
NEXT_PUBLIC_SUPABASE_URL=https://czwrkvmddpczymlkjqmw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3Jrdm1kZHBjenltbGtqcW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODA1MDAsImV4cCI6MjA3OTU1NjUwMH0.foHLZQVXyf7aAVWArZKGsYDaFzvBw4FpYVXDOp8Ko04
```

---

## ✅ Quick Checklist

- [ ] Got Project URL from Supabase (Settings → API)
- [ ] Got anon public key from Supabase (Settings → API)
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` to Vercel
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel
- [ ] Set both for Production environment
- [ ] Redeployed project

---

**Note:** Replace the example values above with your actual values from your Supabase project.

