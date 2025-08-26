/*
  # Create contacts table for general inquiries

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `name` (text, contact name)
      - `email` (text, contact email)
      - `message` (text, contact message)
      - `status` (text, inquiry status: new, responded, closed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_agent` (text, browser info for security)
      - `ip_address` (inet, for security tracking)

  2. Security
    - Enable RLS on `contacts` table
    - Add policy for service providers to manage all contacts
    - Add policy for users to view their own submissions only

  3. Indexes
    - Index on email for contact lookup
    - Index on status for filtering
    - Index on created_at for chronological sorting
*/

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_agent text,
  ip_address inet,
  
  -- Add constraints for data validation
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  CONSTRAINT valid_message_length CHECK (char_length(message) >= 10 AND char_length(message) <= 2000)
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy for service providers (you) to manage all contacts
CREATE POLICY "Service providers can manage all contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for users to view their own submissions only (if they're authenticated)
CREATE POLICY "Users can view own contacts"
  ON contacts
  FOR SELECT
  TO anon
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts (email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts (status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_updated_at ON contacts (updated_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contacts_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_updated_at_column();