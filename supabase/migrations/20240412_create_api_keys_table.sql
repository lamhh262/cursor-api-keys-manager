-- Create the api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  type TEXT DEFAULT 'development',
  monthly_limit INTEGER,
  usage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the key column for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_api_keys_updated_at
BEFORE UPDATE ON api_keys
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON api_keys;

-- Create a policy that allows all operations for all users (including anonymous)
CREATE POLICY "Allow all operations for all users" ON api_keys
  FOR ALL
  USING (true)
  WITH CHECK (true);
