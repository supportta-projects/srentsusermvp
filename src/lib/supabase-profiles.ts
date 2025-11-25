import { supabase } from './supabaseClient';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  company_name: string | null;
  gst_number: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    // If table doesn't exist or profile doesn't exist, return null (not an error)
    if (error.code === 'PGRST116' || error.message.includes('No rows')) {
      return null;
    }
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Create or update user profile
 */
export async function upsertProfile(updates: {
  full_name?: string;
  phone?: string;
  company_name?: string;
  gst_number?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}): Promise<{ data: Profile | null; error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: new Error('User not authenticated') };
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error upserting profile:', error);
    return { data: null, error: new Error(error.message) };
  }

  return { data, error: null };
}

/**
 * Get user's display name (first name from full_name or email prefix)
 */
export function getUserDisplayName(profile: Profile | null, email: string | null): string {
  if (profile?.full_name) {
    const firstName = profile.full_name.split(' ')[0];
    if (firstName) return firstName;
  }
  
  if (email) {
    return email.split('@')[0];
  }
  
  return 'User';
}

