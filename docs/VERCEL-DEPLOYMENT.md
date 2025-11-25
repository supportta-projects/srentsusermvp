# 🚀 Vercel Deployment Guide

This guide explains how to deploy the RentOrent MVP to Vercel and configure environment variables.

## 📋 Prerequisites

1. GitHub repository with your code
2. Vercel account (free tier works)
3. Supabase project created
4. Razorpay account (for payments)

## 🚀 Deployment Steps

### Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository: `srentsusermvp`
5. Click "Deploy"

### Step 2: Configure Environment Variables

**IMPORTANT**: You must set environment variables in Vercel before the first deployment, or the build will use placeholder values.

1. In Vercel project settings, go to **Settings** → **Environment Variables**
2. Add the following variables:

#### Supabase Configuration

```
NEXT_PUBLIC_SUPABASE_URL=https://czwrkvmddpczymlkjqmw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

**How to get these values**:
1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Firebase Configuration (if using Firestore)

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

#### Razorpay Configuration

```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**For Production**:
- Use `rzp_live_` instead of `rzp_test_`
- Get live keys from Razorpay dashboard

#### Email Configuration

```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@rentorent.net
SMTP_PASS=your_password
NOTIFICATION_EMAIL=info@abijithcb.com
```

### Step 3: Set Environment for Each Variable

For each variable, select which environments it applies to:
- **Production**: Live site
- **Preview**: Preview deployments
- **Development**: Local development (usually not needed)

**Recommendation**: Set all variables for **Production** and **Preview**.

### Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

## ✅ Verification

After deployment:

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Test login/register functionality
3. Check browser console for errors
4. Verify Supabase connection works

## 🔧 Troubleshooting

### Build Fails with "Missing Supabase environment variables"

**Solution**: 
1. Go to Vercel project settings
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy

### Build Succeeds but App Doesn't Work

**Possible causes**:
1. Environment variables not set correctly
2. Wrong values (typos)
3. Variables set for wrong environment (Production vs Preview)

**Solution**:
1. Check Vercel deployment logs
2. Verify environment variables in Vercel dashboard
3. Check browser console for errors
4. Ensure variables are set for the correct environment

### Payment Not Working

**Check**:
1. Razorpay keys are correct
2. Keys match the environment (test vs live)
3. Webhook URL is configured in Razorpay dashboard:
   - `https://your-domain.com/api/razorpay/webhook`

### Email Not Sending

**Check**:
1. SMTP credentials are correct
2. SMTP server allows connections from Vercel
3. Check Vercel function logs for errors

## 📝 Environment Variables Checklist

Before deploying, ensure you have:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `RAZORPAY_KEY_ID`
- [ ] `RAZORPAY_KEY_SECRET`
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- [ ] `RAZORPAY_WEBHOOK_SECRET`
- [ ] `SMTP_HOST`
- [ ] `SMTP_PORT`
- [ ] `SMTP_USER`
- [ ] `SMTP_PASS`
- [ ] `NOTIFICATION_EMAIL`

(Optional, if using Firestore):
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`

## 🔒 Security Best Practices

1. **Never commit** `.env.local` to Git
2. **Use Vercel's** environment variables (not hardcoded)
3. **Rotate keys** regularly
4. **Use different keys** for test and production
5. **Limit access** to Vercel project settings

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Getting Started](https://supabase.com/docs/guides/getting-started)
- [Razorpay Integration Guide](https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration/)

---

**Document Version**: 1.0  
**Last Updated**: 2024

