/**
 * Supabase Server-side Client
 * Uses service role key for admin operations
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a dummy client if service key is missing (for build time)
let supabaseAdmin: ReturnType<typeof createClient>;

if (!supabaseUrl || !supabaseServiceKey) {
  // Create dummy client for build time
  supabaseAdmin = createClient(
    supabaseUrl || 'https://dummy.supabase.co',
    supabaseServiceKey || 'dummy-key-for-build',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  if (typeof window === 'undefined') {
    // Only log in server context
    console.warn('⚠️ Supabase service role key not configured. Payment operations will fail at runtime.');
  }
} else {
  // Server-side Supabase client with service role (bypasses RLS)
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { supabaseAdmin };

/**
 * Order type from Supabase
 */
export interface Order {
  id: string;
  user_id: string;
  phonepe_txn_id: string;
  status: 'created' | 'pending' | 'success' | 'failed' | 'cancelled';
  amount_paise: number;
  currency: string;
  description: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Create an order in Supabase
 */
export async function createOrder(data: {
  user_id: string;
  phonepe_txn_id: string;
  amount_paise: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, any>;
}): Promise<Order> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured. Cannot create order.');
  }

  const result = await (supabaseAdmin
    .from('orders') as any)
    .insert({
      user_id: data.user_id,
      phonepe_txn_id: data.phonepe_txn_id,
      status: 'created',
      amount_paise: data.amount_paise,
      currency: data.currency || 'INR',
      description: data.description || null,
      metadata: data.metadata || {},
    })
    .select()
    .single();
  
  const { data: order, error } = result as { data: Order | null; error: any };

  if (error) {
    console.error('Error creating order:', error);
    throw new Error(`Failed to create order: ${error.message}`);
  }

  if (!order) {
    throw new Error('Order was not created');
  }

  return order as Order;
}

/**
 * Get order by phonepe_txn_id
 */
export async function getOrderByTransactionId(phonepe_txn_id: string): Promise<Order | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured. Cannot fetch order.');
  }

  const result = await (supabaseAdmin
    .from('orders') as any)
    .select('*')
    .eq('phonepe_txn_id', phonepe_txn_id)
    .single();
  
  const { data: order, error } = result as { data: Order | null; error: any };

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Order not found
    }
    console.error('Error fetching order:', error);
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  return order as Order;
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'created' | 'pending' | 'success' | 'failed' | 'cancelled',
  additionalData?: Record<string, any>
): Promise<Order> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured. Cannot update order.');
  }

  const updateData: any = {
    status,
    ...additionalData,
  };

  const result = await (supabaseAdmin
    .from('orders') as any)
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();
  
  const { data: order, error } = result as { data: Order | null; error: any };

  if (error) {
    console.error('Error updating order:', error);
    throw new Error(`Failed to update order: ${error.message}`);
  }

  return order as Order;
}

/**
 * Create payment event log
 */
export async function createPaymentEvent(data: {
  order_id: string;
  event_type: string;
  payload: Record<string, any>;
}) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Don't throw - event logging failure shouldn't break payment flow
    console.warn('SUPABASE_SERVICE_ROLE_KEY not configured. Skipping payment event log.');
    return null;
  }

  const result = await (supabaseAdmin
    .from('payment_events') as any)
    .insert({
      order_id: data.order_id,
      event_type: data.event_type,
      payload: data.payload,
    })
    .select()
    .single();
  
  const { data: event, error } = result as { data: any; error: any };

  if (error) {
    console.error('Error creating payment event:', error);
    // Don't throw - event logging failure shouldn't break payment flow
    return null;
  }

  return event;
}

/**
 * Get user's orders
 */
export async function getUserOrders(userId: string, limit: number = 50): Promise<Order[]> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured. Cannot fetch orders.');
  }

  const result = await (supabaseAdmin
    .from('orders') as any)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  const { data: orders, error } = result as { data: Order[] | null; error: any };

  if (error) {
    console.error('Error fetching user orders:', error);
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  return (orders || []) as Order[];
}

