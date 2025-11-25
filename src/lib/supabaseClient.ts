import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if we're in build time (static generation)
// During build, Next.js may not have access to env vars, so we create a dummy client
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                    (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !supabaseUrl);

let supabase: SupabaseClient;

// Validate environment variables (but allow build to proceed)
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  const errorMessage = `Missing Supabase environment variables: ${missingVars.join(', ')}\n\n` +
    `Please add these to your .env.local file or Vercel environment variables:\n` +
    `NEXT_PUBLIC_SUPABASE_URL=https://czwrkvmddpczymlkjqmw.supabase.co\n` +
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here\n\n` +
    `After adding, restart your Next.js dev server or redeploy.`;
  
  // During build time, create a dummy client to allow build to succeed
  // The actual client will be created at runtime when env vars are available
  if (isBuildTime) {
    console.warn('⚠️  Supabase env vars missing during build. Using dummy client. Make sure to set them in Vercel.');
    // Create a dummy client with placeholder values to prevent build failure
    // This client won't work, but allows the build to complete
    supabase = createClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  } else {
    // In both development and production runtime, create dummy client
    // This prevents app crash - user will see errors when trying to use Supabase features
    console.error('❌', errorMessage);
    console.error('⚠️  Creating dummy Supabase client. App will work but authentication features will fail.');
    console.error('📝 To fix: Add environment variables in Vercel project settings → Environment Variables');
    
    // Create a dummy client to prevent app crash
    // The app will still load, but Supabase features won't work
    supabase = createClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  }
} else {
  // Create Supabase client with actual credentials
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export { supabase };
