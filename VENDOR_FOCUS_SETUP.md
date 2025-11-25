# Vendor-Focused Application Setup

## Overview

This application is now focused on **vendor registration, login, and subscription management** for the rentorent software platform.

## Main Features

### 1. Vendor Registration (`/register`)
- **No email verification required** - Users can login immediately after registration
- Fields: Name, Email, Password, Confirm Password
- Auto-login after successful registration
- Redirects to `/vendor` page after registration

### 2. Vendor Login (`/login`)
- Email + Password authentication
- No email verification required
- Redirects to `/vendor` after login

### 3. Vendor Landing Page (`/vendor`)
- Main landing page for vendors
- Shows features, pricing, how it works
- Uses `VendorNavbar` component
- Sign In / Sign Up buttons in navbar

### 4. Profile Page (`/profile`)
- View and edit user profile (name, phone)
- **Subscribe button** - Links to subscription page
- Shows user email (read-only)

### 5. Subscription Page (`/vendor/subscription`)
- View available subscription plans
- Subscribe to rentorent software
- View current subscription status

## Authentication Flow

1. **Registration:**
   - User fills registration form
   - Account is created immediately
   - User is automatically logged in
   - Redirected to `/vendor` page
   - **No email verification needed**

2. **Login:**
   - User enters email and password
   - Logged in immediately
   - Redirected to `/vendor` page

3. **Profile:**
   - Accessible from navbar dropdown when logged in
   - Can edit name and phone
   - Can navigate to subscription page

## Supabase Configuration

### Required Settings

1. **Disable Email Confirmation:**
   - Go to Supabase Dashboard → Authentication → Settings
   - Under "Email Auth", **disable** "Confirm email"
   - This allows immediate login after registration

2. **Database Tables:**
   - Run `supabase-schema.sql` to create:
     - `profiles` table
     - `shops` table (for future use)
     - RLS policies

## File Structure

### Active Files
- `src/app/vendor/` - Vendor landing page
- `src/app/register/` - Registration page
- `src/app/login/` - Login page
- `src/app/profile/` - Profile page
- `src/app/vendor/subscription/` - Subscription page
- `src/components/vendor/` - Vendor-specific components
- `src/components/auth/` - Auth layout components

### Moved to `oldrentlist/`
- Product listing pages
- Shop listing pages
- Product/Shop card components
- Filter components
- Contact modal

## Navigation Flow

```
Home (/) → Redirects to /vendor
/vendor → Landing page (Sign In/Sign Up in navbar)
/register → Registration → Auto-login → /vendor
/login → Login → /vendor
/profile → Profile management + Subscribe button
/vendor/subscription → Subscription plans
```

## Testing Checklist

- [ ] Registration creates account and auto-logs in
- [ ] Login works immediately (no email verification)
- [ ] Profile page shows Subscribe button
- [ ] Subscription page loads correctly
- [ ] Navbar shows Sign In/Sign Up when logged out
- [ ] Navbar shows avatar + dropdown when logged in
- [ ] All redirects work correctly

## Important Notes

1. **Email Verification Disabled:** Users can login immediately after registration
2. **Auto-Login:** Registration automatically logs the user in
3. **Vendor Focus:** All product listing code has been moved to `oldrentlist/`
4. **Subscription Access:** Available from profile page

---

**Status:** ✅ Ready for vendor registration and subscription flow

