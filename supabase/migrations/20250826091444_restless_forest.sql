/*
  # Setup tables for new Supabase account

  1. New Tables
    - `bookings` - For consultation scheduling
      - `id` (uuid, primary key)
      - `name` (text, client name)
      - `email` (text, client email)
      - `phone` (text, client phone)
      - `business_name` (text, clinic name)
      - `booking_date` (date, consultation date)
      - `booking_time` (time, consultation time)
      - `status` (text, booking status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_timezone` (text, client timezone)
      - `notes` (text, optional notes)

    - `contacts` - For general inquiries
      - `id` (uuid, primary key)
      - `name` (text, contact name)
      - `email` (text, contact email)
      - `message` (text, contact message)
      - `status` (text, inquiry status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_agent` (text, browser info)
      - `ip_address` (inet, for security)

  2. Security
    - Enable RLS on both tables
    - Add policies for managing data
    - Add data validation constraints

  3. Performance
    - Create indexes for efficient queries
    - Add unique constraints where needed
*/

-- Create bookings table for consultation scheduling
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  business_name text NOT NULL,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_timezone text,
  notes text,
  
  -- Prevent double booking with unique constraint
  CONSTRAINT unique_booking_slot UNIQUE (booking_date, booking_time)
);

-- Create contacts table for general inquiries
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
  
  -- Data validation constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  CONSTRAINT valid_message_length CHECK (char_length(message) >= 10 AND char_length(message) <= 2000)
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Allow all operations on bookings"
  ON bookings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for contacts
CREATE POLICY "Allow all operations on contacts"
  ON contacts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance on bookings
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings (email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings (booking_date, booking_time);

-- Create indexes for performance on contacts
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts (email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts (status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_updated_at ON contacts (updated_at DESC);

-- Function to update updated_at timestamp for bookings
CREATE OR REPLACE FUNCTION update_bookings_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update updated_at timestamp for contacts
CREATE OR REPLACE FUNCTION update_contacts_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_updated_at_column();