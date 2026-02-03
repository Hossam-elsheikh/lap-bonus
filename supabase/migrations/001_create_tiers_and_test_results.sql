-- Create tiers table
CREATE TABLE IF NOT EXISTS tier (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tiers
INSERT INTO tier (id, name, description) VALUES
  (1, 'Bronze', 'Entry level tier'),
  (2, 'Silver', 'Intermediate tier'),
  (3, 'Gold', 'Advanced tier'),
  (4, 'Platinum', 'Expert tier'),
  (5, 'Diamond', 'Master tier')
ON CONFLICT (id) DO NOTHING;

-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_name VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('passed', 'failed', 'pending')),
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at DESC);

-- Enable Row Level Security
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own test results
CREATE POLICY "Users can view their own test results"
  ON test_results
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow service role to insert test results
CREATE POLICY "Service role can insert test results"
  ON test_results
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow service role to update test results
CREATE POLICY "Service role can update test results"
  ON test_results
  FOR UPDATE
  USING (true);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to test_results
CREATE TRIGGER update_test_results_updated_at
  BEFORE UPDATE ON test_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to tier
CREATE TRIGGER update_tier_updated_at
  BEFORE UPDATE ON tier
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
