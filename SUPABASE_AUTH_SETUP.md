# Supabase Authentication Setup Guide

This guide explains how to set up Supabase authentication for the rental SaaS application.

## Prerequisites

1. A Supabase project (create one at https://supabase.com)
2. Your Supabase project URL and anon key

## Environment Variables

Add the following to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://czwrkvmddpczymlkjqmw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** 
- Never commit `.env.local` to version control
- Only use the **anon key** in client-side code (never the service role key)
- The anon key is safe to expose in the browser as it's protected by Row Level Security (RLS)

## Getting Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Project Configuration

### 1. Email Authentication Settings

1. Go to **Authentication** → **Providers** → **Email**
2. Enable **Email** provider
3. Configure email templates (optional, defaults work fine)

### 2. Email Confirmation (Optional but Recommended)

1. Go to **Authentication** → **Settings**
2. Under **Email Auth**, you can:
   - **Enable email confirmations**: Requires users to verify email before signing in
   - **Disable email confirmations**: Users can sign in immediately after registration

For production, we recommend enabling email confirmations for security.

### 3. Password Reset Settings

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your production domain (e.g., `https://yourdomain.com`)
3. Add redirect URLs:
   - `https://yourdomain.com/reset-password`
   - `http://localhost:3000/reset-password` (for development)

### 4. Email Templates (Optional)

Customize email templates in **Authentication** → **Email Templates**:
- **Confirm signup**: Email sent when user registers
- **Reset password**: Email sent for password reset
- **Magic link**: If you enable magic link login

## Authentication Flow

### Registration Flow

1. User fills registration form (`/register`)
2. System calls `supabase.auth.signUp()`
3. If email confirmation is enabled:
   - User receives confirmation email
   - User clicks link to verify email
   - User can then sign in
4. If email confirmation is disabled:
   - User is automatically signed in
   - Redirected to home page

### Login Flow

1. User fills login form (`/login`)
2. System calls `supabase.auth.signInWithPassword()`
3. On success:
   - Session is stored automatically (handled by Supabase)
   - User is redirected to intended page or home
4. On error:
   - User-friendly error message is displayed

### Password Reset Flow

1. User clicks "Forgot password?" on login page
2. User enters email on `/forgot-password`
3. System calls `supabase.auth.resetPasswordForEmail()`
4. User receives email with reset link
5. User clicks link → redirected to `/reset-password`
6. User enters new password
7. System calls `supabase.auth.updateUser()`
8. User is redirected to login page

### Logout Flow

1. User clicks "Sign Out" in header menu
2. System calls `supabase.auth.signOut()`
3. Session is cleared
4. User is redirected to home page

## Routes

- `/login` - Sign in page
- `/register` - Sign up page
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password (accessed via email link)

## User Data Structure

Supabase stores user data in the `auth.users` table. Additional user metadata can be stored in:

1. **User metadata** (in `user_metadata` field):
   - Set during signup: `{ name, phone }`
   - Accessible via `user.user_metadata.name`

2. **Custom user table** (recommended for production):
   - Create a `customers` or `users` table in Supabase
   - Link to `auth.users.id`
   - Store additional profile data there

## Security Best Practices

1. ✅ **Use anon key in client code** (already implemented)
2. ✅ **Never expose service role key** in frontend
3. ✅ **Enable Row Level Security (RLS)** on Supabase tables
4. ✅ **Validate email format** on client and server
5. ✅ **Use strong password requirements** (minimum 6 characters, can be enhanced)
6. ✅ **Handle errors gracefully** (don't expose internal errors to users)

## Testing

### Test Registration

1. Go to `/register`
2. Fill in form with new email
3. Check email for confirmation (if enabled)
4. Verify user appears in Supabase dashboard → Authentication → Users

### Test Login

1. Go to `/login`
2. Enter credentials
3. Verify redirect to home page
4. Check header shows user menu

### Test Password Reset

1. Go to `/forgot-password`
2. Enter registered email
3. Check email for reset link
4. Click link → should redirect to `/reset-password`
5. Enter new password
6. Verify login works with new password

## Troubleshooting

### "Supabase env vars missing" Error

- Check `.env.local` exists and has correct variable names
- Restart Next.js dev server after adding env vars
- Verify no typos in variable names

### Password Reset Link Not Working

- Check Supabase URL Configuration has correct redirect URLs
- Verify Site URL is set correctly
- Check email spam folder

### Email Not Received

- Check Supabase email settings
- Verify email provider is configured
- Check Supabase logs for email delivery errors
- For development, check Supabase dashboard → Authentication → Users → Email logs

### Session Not Persisting

- Verify `persistSession: true` in `supabaseClient.ts` (already set)
- Check browser allows cookies/localStorage
- Clear browser cache and try again

## Next Steps

After authentication is working:

1. **Set up user profiles table** in Supabase (if needed)
2. **Implement Row Level Security (RLS)** policies
3. **Add phone number verification** (optional)
4. **Integrate with PhonePe payments** (user ID will be available from `user.id`)

## Support

For Supabase-specific issues:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)

