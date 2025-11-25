# Quick Fix Guide - Auth Issues

## Issues Fixed

### 1. Sign In/Sign Up Buttons Not Showing
**Problem:** Buttons weren't visible when logged out
**Fix:** Header now properly checks `authLoading` state and shows buttons when not loading and user is null

### 2. Profile Page Not Loading
**Problem:** Profile page crashed if profiles table doesn't exist or profile record missing
**Fix:** Profile page now handles missing profiles gracefully and shows empty form

### 3. Login After Registration
**Problem:** Users couldn't login immediately after registration
**Possible Causes:**
- Email confirmation required in Supabase settings
- Profile table doesn't exist yet

## Setup Steps

### Step 1: Run Database Schema
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase-schema.sql`
3. Run the SQL script
4. This creates:
   - `profiles` table
   - `shops` table
   - RLS policies
   - Auto-profile creation trigger

### Step 2: Check Supabase Email Settings
1. Go to Supabase Dashboard → Authentication → Settings
2. Under "Email Auth":
   - **Option A (Recommended for testing):** Disable "Confirm email" - users can login immediately
   - **Option B (Production):** Enable "Confirm email" - users must verify email first

### Step 3: Test the Flow

1. **Register:**
   - Go to `/register`
   - Fill form and submit
   - If email confirmation is disabled → you'll be logged in automatically
   - If email confirmation is enabled → check email and verify

2. **Login:**
   - Go to `/login`
   - Enter credentials
   - Should redirect to home page

3. **Profile:**
   - Click avatar in header → "Profile"
   - Should load profile page
   - Edit and save name/phone

4. **Shops:**
   - Click avatar → "My Shops"
   - Should show empty state
   - Click "Add New Shop"

## Troubleshooting

### Buttons Still Not Showing
- Check browser console for errors
- Verify `.env.local` has Supabase credentials
- Restart dev server: `pnpm dev`

### Can't Login After Registration
- Check if email confirmation is required
- Verify email in Supabase Dashboard → Authentication → Users
- Try resetting password if needed

### Profile Page Shows Error
- Verify `profiles` table exists in Supabase
- Check browser console for specific error
- Profile will work even if table doesn't exist (shows empty form)

### Database Errors
- Make sure you ran `supabase-schema.sql`
- Check Supabase Dashboard → Table Editor
- Verify RLS policies are enabled

## Current Status

✅ Header shows Sign In/Sign Up when logged out
✅ Header shows avatar + name when logged in
✅ Profile page loads even if profile doesn't exist
✅ Login works (if email confirmation disabled)
✅ All pages handle errors gracefully

---

**Next:** Run the database schema and test the complete flow!

