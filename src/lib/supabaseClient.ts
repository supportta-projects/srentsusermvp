import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  const errorMessage = `Missing Supabase environment variables: ${missingVars.join(', ')}\n\n` +
    `Please add these to your .env.local file:\n` +
    `NEXT_PUBLIC_SUPABASE_URL=https://czwrkvmddpczymlkjqmw.supabase.co\n` +
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here\n\n` +
    `After adding, restart your Next.js dev server.`;
  
  // In development, log a helpful error instead of crashing
  if (process.env.NODE_ENV === 'development') {
    console.error('❌', errorMessage);
    // Create a dummy client to prevent app crash, but it won't work
    // This allows the app to load so user can see the error
  }
  
  throw new Error(errorMessage);
}

// Create Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

