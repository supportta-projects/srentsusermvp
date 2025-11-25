# ⚡ Quick Reference: Environment Variables

## 🔑 Supabase Variables (Required)

### Variable Names:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Where to Get:
1. Go to: [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Example Values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://czwrkvmddpczymlkjqmw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 💳 Razorpay Variables (For Payments)

```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**Get from**: [razorpay.com/dashboard](https://razorpay.com/dashboard) → Settings → API Keys

---

## 📧 Email Variables (For Notifications)

```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@rentorent.net
SMTP_PASS=your_password
NOTIFICATION_EMAIL=info@abijithcb.com
```

---

## 📝 Complete .env.local Template

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Razorpay (For payments)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email (For notifications)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@rentorent.net
SMTP_PASS=your_password
NOTIFICATION_EMAIL=info@abijithcb.com

# Site URL (For SEO)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## 🚀 Adding to Vercel

1. **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click **Add New**
3. Enter **Key** and **Value**
4. Select **Environments**: Production, Preview, Development
5. Click **Save**
6. **Redeploy** your project

---

## ✅ Verification Checklist

- [ ] Supabase URL starts with `https://` and ends with `.supabase.co`
- [ ] Supabase anon key starts with `eyJ` (JWT token)
- [ ] Variables added to Vercel for Production environment
- [ ] Project redeployed after adding variables
- [ ] No errors in browser console

---

**See [SUPABASE-ENV-VARIABLES.md](./SUPABASE-ENV-VARIABLES.md) for detailed guide.**

