-- Add new fields to profiles table
-- Run this in Supabase SQL Editor

-- Add company_name, gst_number, and address fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS gst_number TEXT,
ADD COLUMN IF NOT EXISTS address_line1 TEXT,
ADD COLUMN IF NOT EXISTS address_line2 TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_gst_number ON profiles(gst_number) WHERE gst_number IS NOT NULL;

