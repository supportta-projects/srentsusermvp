import { supabase } from './supabaseClient';

export interface Shop {
  id: string;
  user_id: string;
  shop_name: string;
  gst_number: string | null;
  rental_types: string[];
  phone: string;
  location_city: string;
  location_state: string;
  location_country: string;
  address_line1: string;
  address_line2: string | null;
  postal_code: string;
  created_at: string;
  updated_at: string;
}

export const RENTAL_TYPES = [
  'Camera rental',
  'Power tools rental',
  'Jewellery rental',
  'Furniture rental',
  'Vehicle rental',
  'Event equipment rental',
  'Other',
] as const;

export type RentalType = typeof RENTAL_TYPES[number];

/**
 * Get all shops for the current user
 */
export async function getUserShops(): Promise<Shop[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching shops:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single shop by ID
 */
export async function getShopById(shopId: string): Promise<Shop | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', shopId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching shop:', error);
    return null;
  }

  return data;
}

/**
 * Create a new shop
 */
export async function createShop(shopData: Omit<Shop, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<{ data: Shop | null; error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: new Error('User not authenticated') };
  }

  const { data, error } = await supabase
    .from('shops')
    .insert({
      ...shopData,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating shop:', error);
    return { data: null, error: new Error(error.message) };
  }

  return { data, error: null };
}

/**
 * Update an existing shop
 */
export async function updateShop(shopId: string, updates: Partial<Omit<Shop, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<{ data: Shop | null; error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: new Error('User not authenticated') };
  }

  const { data, error } = await supabase
    .from('shops')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', shopId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating shop:', error);
    return { data: null, error: new Error(error.message) };
  }

  return { data, error: null };
}

/**
 * Delete a shop
 */
export async function deleteShop(shopId: string): Promise<{ error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: new Error('User not authenticated') };
  }

  const { error } = await supabase
    .from('shops')
    .delete()
    .eq('id', shopId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting shop:', error);
    return { error: new Error(error.message) };
  }

  return { error: null };
}

