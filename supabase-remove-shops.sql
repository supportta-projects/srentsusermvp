-- Remove shops table and all related objects from Supabase
-- Run this in Supabase SQL Editor

-- 1. Drop RLS policies for shops table
DROP POLICY IF EXISTS "Users can view own shops" ON shops;
DROP POLICY IF EXISTS "Users can insert own shops" ON shops;
DROP POLICY IF EXISTS "Users can update own shops" ON shops;
DROP POLICY IF EXISTS "Users can delete own shops" ON shops;

-- 2. Drop trigger for updated_at on shops
DROP TRIGGER IF EXISTS update_shops_updated_at ON shops;

-- 3. Drop indexes for shops table
DROP INDEX IF EXISTS idx_shops_user_id;
DROP INDEX IF EXISTS idx_shops_location_city;

-- 4. Drop the shops table
DROP TABLE IF EXISTS shops;

-- Note: This will permanently delete all shop data
-- Make sure you have a backup if needed before running this

