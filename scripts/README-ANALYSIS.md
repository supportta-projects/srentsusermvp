# Firestore Structure Analysis Script

## Overview

This script safely analyzes your Firestore database structure without exposing sensitive data.

## What It Does

✅ **SAFE & READ-ONLY**
- Only reads collection and document structure
- Shows field names and types (NOT values)
- No data exposure
- Safe to run on production database

## What It Analyzes

The script checks these collections:
- `rental_shops` - Vendor shops
- `rental_products` - Vendor products
- `rental_orders` - Rental orders
- `rental_customers` - Vendor customers
- `rental_staff` - Staff members
- `rental_brands` - Product brands
- `rental_categories` - Product categories
- `global_customers` - Global customer data
- `company_settings` - Company settings
- `vendors` - Vendor accounts (if exists)
- `shops` - Marketplace shops
- `products` - Marketplace products
- `customers` - Marketplace customers
- `contacts` - Contact requests

## How to Run

1. **Make sure you have environment variables set:**
   ```bash
   # Check if .env.local exists with Firebase config
   ```

2. **Run the analysis script:**
   ```bash
   pnpm run analyze-firestore
   ```

3. **View the output:**
   - Console will show summary
   - Full report saved to: `firestore-structure-analysis.json`

## Output

The script generates:
1. **Console Output**: Summary of collections and fields
2. **JSON File**: Detailed structure in `firestore-structure-analysis.json`

## Example Output

```
🔍 Firestore Structure Analysis
================================

⚠️  This script is READ-ONLY and SAFE
   - Only reads structure (field names and types)
   - Does NOT expose sensitive data values

Analyzing 14 collections...

  Analyzing rental_shops... ✅ 5 documents, 12 fields
  Analyzing rental_products... ✅ 50+ documents, 15 fields
  ...

📊 Analysis Summary
==================
Total Collections Analyzed: 14
Collections with Data: 8
Total Documents Found: 150+

✅ Full report saved to: firestore-structure-analysis.json
```

## What to Share

After running, share:
- The `firestore-structure-analysis.json` file
- OR copy-paste the console output

This will help design the subscription system without breaking existing functionality.

## Troubleshooting

**Error: Firebase not initialized**
- Make sure `.env.local` has Firebase config
- Check `NEXT_PUBLIC_FIREBASE_*` variables are set

**Error: Permission denied**
- Check Firestore security rules allow read access
- Make sure you're authenticated (if required)

**No data found**
- Collections might be empty (this is OK)
- Script will show "Empty collection" for those

## Safety Notes

- ✅ Read-only operations
- ✅ No data values exposed
- ✅ Only structure information
- ✅ Safe for production use
- ✅ No modifications to database

