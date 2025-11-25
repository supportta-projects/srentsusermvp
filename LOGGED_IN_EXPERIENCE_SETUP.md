# Logged-In Experience Setup Guide

This guide explains how to set up the complete logged-in user experience for the rental SaaS app.

## 📋 Prerequisites

1. Supabase project configured
2. Environment variables set up (see `SETUP_ENV.md`)
3. User authentication working (login/register)

## 🗄️ Database Setup

### Step 1: Run the SQL Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `supabase-schema.sql` from this project
4. Copy and paste the entire SQL script into the SQL Editor
5. Click **Run** to execute

This will create:
- `profiles` table for user profile data
- `shops` table for shop management
- Row Level Security (RLS) policies
- Automatic profile creation trigger on user signup
- Updated timestamp triggers

### Step 2: Verify Tables Created

1. Go to **Table Editor** in Supabase dashboard
2. You should see:
   - `profiles` table
   - `shops` table

### Step 3: Test RLS Policies

The RLS policies ensure:
- Users can only see/edit their own profiles
- Users can only see/edit their own shops
- All operations are scoped to the authenticated user

## 🎨 Features Implemented

### 1. Updated Navbar (Header Component)

**When Logged Out:**
- Shows "Sign In" and "Sign Up" buttons

**When Logged In:**
- Shows user's first name (or email prefix) with avatar
- Avatar displays first letter of name
- Dropdown menu with:
  - Profile
  - My Shops
  - Logout

### 2. Profile Page (`/profile`)

**Features:**
- View and edit full name
- View and edit phone number
- View email (read-only)
- Avatar display
- Save changes with validation
- Success/error feedback

**Access:**
- From navbar dropdown → "Profile"
- Direct URL: `/profile`

### 3. Shops Management (`/shops`)

**Features:**
- List all user's shops
- Empty state with helpful message
- Shop cards showing:
  - Shop name
  - Rental types (chips)
  - Location (city, state)
  - Phone number
  - GST number
- Edit and delete actions per shop

**Access:**
- From navbar dropdown → "My Shops"
- Direct URL: `/shops`

### 4. Add Shop (`/shops/new`)

**Form Fields:**
- **Basic Info:**
  - Shop name (required)
  - GST number (optional)
  
- **Rental Types:**
  - Multiple selection chips:
    - Camera rental
    - Power tools rental
    - Jewellery rental
    - Furniture rental
    - Vehicle rental
    - Event equipment rental
    - Other

- **Contact & Location:**
  - Phone number (required)
  - City (required)
  - State (required)
  - Country (default: India)
  - Address line 1 (required)
  - Address line 2 (optional)
  - Postal code (required)

**Validation:**
- Required fields validated
- Error messages shown per field
- Success redirect to shops list

### 5. Edit Shop (`/shops/[id]/edit`)

**Features:**
- Pre-fills all existing shop data
- Same form as Add Shop
- Updates existing shop record
- Success redirect to shops list

## 🔧 Implementation Details

### Profile Management

**Files:**
- `src/lib/supabase-profiles.ts` - Profile helper functions
- `src/app/profile/page.tsx` - Profile page component

**Functions:**
- `getCurrentUserProfile()` - Get current user's profile
- `upsertProfile()` - Create or update profile
- `getUserDisplayName()` - Get display name for navbar

### Shop Management

**Files:**
- `src/lib/supabase-shops.ts` - Shop helper functions
- `src/app/shops/page.tsx` - Shops list page
- `src/app/shops/new/page.tsx` - Add shop page
- `src/app/shops/[id]/edit/page.tsx` - Edit shop page

**Functions:**
- `getUserShops()` - Get all shops for current user
- `getShopById()` - Get single shop
- `createShop()` - Create new shop
- `updateShop()` - Update existing shop
- `deleteShop()` - Delete shop

### Header Updates

**File:**
- `src/components/Header.tsx`

**Changes:**
- Fetches profile on mount
- Displays user's first name
- Shows avatar with first letter
- Dropdown menu with navigation links

## 🧪 Testing Checklist

### After Login

- [ ] Navbar shows user name + avatar (not "Login")
- [ ] Dropdown menu opens on click
- [ ] All menu items are clickable
- [ ] Logout works and redirects correctly

### Profile Page

- [ ] Page loads with current user data
- [ ] Can edit name and phone
- [ ] Email is read-only
- [ ] Save button works
- [ ] Success message appears
- [ ] Navbar updates after saving name

### Shops List

- [ ] Shows empty state when no shops
- [ ] "Add New Shop" button works
- [ ] Shop cards display correctly
- [ ] Edit button navigates to edit page
- [ ] Delete button shows confirmation
- [ ] Delete works and refreshes list

### Add Shop

- [ ] Form loads correctly
- [ ] All required fields validated
- [ ] Rental type chips toggle correctly
- [ ] Save creates shop and redirects
- [ ] Cancel returns to shops list

### Edit Shop

- [ ] Form pre-fills with existing data
- [ ] Can update all fields
- [ ] Save updates shop and redirects
- [ ] Cancel returns to shops list

### Mobile

- [ ] All pages are mobile-responsive
- [ ] Forms are usable one-handed
- [ ] Dropdown works on mobile
- [ ] Buttons are appropriately sized

## 🐛 Troubleshooting

### Profile Not Created on Signup

**Issue:** New users don't have a profile record

**Solution:**
1. Check if the trigger function exists in Supabase
2. Verify `handle_new_user()` function is created
3. Check trigger `on_auth_user_created` is active
4. Manually create profile if needed:
   ```sql
   INSERT INTO profiles (id, full_name)
   VALUES ('user-id-here', 'User Name');
   ```

### Can't See Shops

**Issue:** Shops list is empty or shows error

**Solution:**
1. Check RLS policies are enabled
2. Verify user is authenticated
3. Check browser console for errors
4. Verify shops table exists and has correct structure

### Navbar Not Updating

**Issue:** Name doesn't update after profile edit

**Solution:**
1. Check `router.refresh()` is called after save
2. Verify profile is fetched in Header useEffect
3. Check if profile data is being updated in Supabase

### Form Validation Errors

**Issue:** Forms show errors but data looks correct

**Solution:**
1. Check required fields are not empty (including spaces)
2. Verify field names match database columns
3. Check browser console for detailed errors

## 📝 Next Steps

After setup is complete:

1. **Test the full flow:**
   - Register → Login → Profile → Add Shop → Edit Shop

2. **Customize rental types:**
   - Edit `RENTAL_TYPES` in `src/lib/supabase-shops.ts`

3. **Add more fields:**
   - Extend profile or shop schemas as needed
   - Update forms and validation

4. **Enhancements:**
   - Add shop images
   - Add shop descriptions
   - Add shop hours
   - Add shop ratings

## 🔒 Security Notes

- All RLS policies are in place
- Users can only access their own data
- All operations require authentication
- Input validation on client and server (via RLS)

---

**Status:** ✅ Complete and ready for testing

