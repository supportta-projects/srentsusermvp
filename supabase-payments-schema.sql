-- PhonePe Payment Gateway Schema for Rentorent
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phonepe_txn_id TEXT UNIQUE NOT NULL, -- merchantTransactionId used with PhonePe
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'success', 'failed', 'cancelled')),
  amount_paise BIGINT NOT NULL, -- amount in paise (e.g. 10000 = ₹100)
  currency TEXT NOT NULL DEFAULT 'INR',
  description TEXT,
  metadata JSONB DEFAULT '{}', -- store rental details: product ids, duration, shop id, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment events table (audit trail)
CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- phonepe_redirect, phonepe_webhook, status_check, etc.
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_phonepe_txn_id ON orders(phonepe_txn_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_events_order_id ON payment_events(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_created_at ON payment_events(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own orders (limited fields)
CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can view payment events for their orders
CREATE POLICY "Users can view payment events for their orders"
  ON payment_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payment_events.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Service role can do everything (for backend operations)
CREATE POLICY "Service role can manage orders"
  ON orders FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage payment events"
  ON payment_events FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Comments for documentation
COMMENT ON TABLE orders IS 'Stores payment orders for PhonePe transactions';
COMMENT ON TABLE payment_events IS 'Audit trail of all payment-related events from PhonePe';
COMMENT ON COLUMN orders.phonepe_txn_id IS 'Unique merchant transaction ID used with PhonePe API';
COMMENT ON COLUMN orders.amount_paise IS 'Amount in paise (multiply by 100 to get rupees)';
COMMENT ON COLUMN orders.metadata IS 'JSON object storing rental details: product_ids, duration, shop_id, etc.';

