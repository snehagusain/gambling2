-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (profile data, not auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  email TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(12, 2) DEFAULT 0.00 CHECK (balance >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id INTEGER NOT NULL,
  sport TEXT NOT NULL,
  match TEXT NOT NULL,
  team_a TEXT NOT NULL,
  team_b TEXT NOT NULL,
  time TEXT NOT NULL,
  league TEXT NOT NULL,
  odds JSONB NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdraw', 'bet')),
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  bet_details JSONB,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own profiles
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = auth_id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = auth_id);

-- Wallets RLS
CREATE POLICY "Users can view their own wallet"
  ON wallets FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text));

-- Transactions RLS
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text));

-- Matches are readable by everyone
CREATE POLICY "Matches are visible to all users"
  ON matches FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only admins can update matches
CREATE POLICY "Only admins can update matches"
  ON matches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      JOIN users ON admins.user_id = users.id 
      WHERE users.auth_id = auth.uid()::text
    )
  );

-- Create functions for wallet operations
CREATE OR REPLACE FUNCTION deposit_funds(
  p_user_id UUID,
  p_amount DECIMAL
) RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
BEGIN
  -- Update wallet balance
  UPDATE wallets
  SET balance = balance + p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Create transaction record
  INSERT INTO transactions (
    user_id, 
    type, 
    amount, 
    description, 
    status
  ) VALUES (
    p_user_id,
    'deposit',
    p_amount,
    'Deposit to wallet',
    'completed'
  ) RETURNING id INTO v_transaction_id;
  
  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql; 