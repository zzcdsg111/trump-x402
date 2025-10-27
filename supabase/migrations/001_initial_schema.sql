-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash TEXT UNIQUE NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  token TEXT NOT NULL DEFAULT 'TRUMP',
  chain TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'failed')),
  resource_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TRUMP',
  access_count INTEGER NOT NULL DEFAULT 0,
  content_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create payment_records table
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT NOT NULL,
  resource_id UUID NOT NULL REFERENCES resources(id),
  transaction_id UUID REFERENCES transactions(id),
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_transactions_from ON transactions(from_address);
CREATE INDEX idx_transactions_to ON transactions(to_address);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX idx_payment_records_user ON payment_records(user_address);
CREATE INDEX idx_payment_records_resource ON payment_records(resource_id);

-- Insert sample resources
INSERT INTO resources (name, description, price, currency) VALUES
  ('Premium API Access', 'Unlimited API calls for 30 days', 100.00, 'TRUMP'),
  ('Exclusive Content Bundle', 'Access to premium Trump token insights', 50.00, 'TRUMP'),
  ('VIP Membership', 'Lifetime access to all resources', 500.00, 'TRUMP'),
  ('Trading Signals', 'Real-time trading signals and alerts', 75.00, 'TRUMP'),
  ('Market Analysis Report', 'Weekly market analysis and predictions', 25.00, 'TRUMP');

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for transactions" ON transactions
  FOR SELECT USING (true);

CREATE POLICY "Public read access for resources" ON resources
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own payment records" ON payment_records
  FOR SELECT USING (true);

-- Create policies for insert (authenticated users only)
CREATE POLICY "Authenticated users can insert transactions" ON transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can insert payment records" ON payment_records
  FOR INSERT WITH CHECK (true);
