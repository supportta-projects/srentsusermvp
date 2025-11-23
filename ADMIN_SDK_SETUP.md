# Firebase Admin SDK Setup Guide

This guide will help you set up Firebase Admin SDK for server-side operations like seeding, migrations, and admin tasks.

## Why Admin SDK?

- ✅ Bypasses Firestore security rules (for admin operations)
- ✅ More secure (server-side only, credentials never exposed)
- ✅ Industry standard for seeding and migrations
- ✅ Perfect for long-term maintenance

## Step 1: Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **rentorent-fb156**
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate new private key**
6. Click **Generate key** in the dialog
7. A JSON file will download (e.g., `rentorent-fb156-firebase-adminsdk-xxxxx.json`)

## Step 2: Save Service Account Key

1. Rename the downloaded file to: `serviceAccountKey.json`
2. Move it to your project root directory:
   ```
   E:\Web Development\Web with ai\rorusermvp\serviceAccountKey.json
   ```

**⚠️ IMPORTANT SECURITY:**
- **NEVER commit this file to git** (it's already in `.gitignore`)
- **NEVER share this file publicly**
- This key has full admin access to your Firebase project

## Step 3: Verify Setup

Run the seed script:

```bash
pnpm run seed-plans-admin
```

You should see:
```
✅ Connected to Firebase project: rentorent-fb156
✅ Created plan: Monthly Plan (monthly)
✅ Created plan: Quarterly Plan (quarterly)
✅ Created plan: Yearly Plan (yearly)
```

## Alternative: Environment Variable (for CI/CD)

If you're using CI/CD or don't want to store the file locally:

1. Set environment variable:
   ```bash
   export FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
   ```

2. Or add to `.env.local`:
   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
   ```

**Note:** The script will automatically use this if `serviceAccountKey.json` is not found.

## Troubleshooting

### Error: "Failed to initialize Firebase Admin SDK"

**Solution:** Make sure `serviceAccountKey.json` exists in project root.

### Error: "Permission denied"

**Solution:** The service account key might not have proper permissions. Generate a new one from Firebase Console.

### Error: "ENOENT: no such file or directory"

**Solution:** Check that the file is named exactly `serviceAccountKey.json` and is in the project root.

## What's Next?

After setting up Admin SDK, you can:

1. ✅ Seed subscription plans: `pnpm run seed-plans-admin`
2. ✅ Create migration scripts
3. ✅ Bulk update data
4. ✅ Scheduled admin tasks

## Security Best Practices

1. ✅ Keep `serviceAccountKey.json` in `.gitignore` (already done)
2. ✅ Never commit service account keys
3. ✅ Rotate keys periodically
4. ✅ Use environment variables in production
5. ✅ Limit service account permissions if possible

## File Structure

```
rorusermvp/
├── serviceAccountKey.json  ← Add this file (not in git)
├── scripts/
│   └── seed-subscription-plans-admin.ts  ← Admin seed script
└── .gitignore  ← Already ignores serviceAccountKey.json
```

## Quick Reference

- **Get service account key:** Firebase Console → Project Settings → Service Accounts
- **Seed plans:** `pnpm run seed-plans-admin`
- **Check if key exists:** Look for `serviceAccountKey.json` in project root

