# 4-Digit PIN Authentication

## Important: Supabase Password Requirements

⚠️ **Supabase requires passwords to be at least 6 characters by default.**

To use 4-digit PINs, you need to configure Supabase:

### Option 1: Custom Password Policy (Recommended)

1. Go to **Supabase Dashboard** → **Authentication** → **Policies**
2. Create a custom password policy that allows 4-digit PINs
3. Or use Supabase's password policy settings to allow shorter passwords

### Option 2: Modify Supabase Auth Settings

You may need to:
1. Disable password strength requirements in Supabase
2. Or use a custom authentication flow

### Option 3: Use a Workaround

If Supabase doesn't allow 4-digit passwords, you could:
- Store a 4-digit PIN in the user's profile
- Use a longer password (6+ chars) for Supabase auth
- Authenticate with the PIN separately

## Current Implementation

The registration and login forms now:
- ✅ Accept only 4 digits (0-9)
- ✅ Show PIN by default (visible)
- ✅ Have eye icon to toggle visibility
- ✅ Center-aligned, large text for better UX
- ✅ Limited to exactly 4 characters
- ✅ Numeric keyboard on mobile (`inputMode="numeric"`)

## Testing

1. Try registering with a 4-digit PIN
2. If Supabase rejects it, you'll see an error
3. May need to adjust Supabase password policy or use workaround

---

**Note:** If Supabase doesn't accept 4-digit passwords, we may need to implement a custom authentication method or use a longer password with PIN stored separately.

