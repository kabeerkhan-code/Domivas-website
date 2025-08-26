/*
  # Create bookings table for consultation scheduling

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `name` (text, client name)
      - `email` (text, client email)
      - `phone` (text, client phone)
      - `business_name` (text, clinic name)
      - `booking_date` (date, consultation date)
      - `booking_time` (time, consultation time in UK timezone)
      - `status` (text, booking status: pending, confirmed, cancelled, completed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_timezone` (text, client's timezone for reference)
      - `notes` (text, optional notes)

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for service providers to manage all bookings
    - Add policy for clients to view their own bookings only

  3. Indexes
    - Unique index on date + time combination to prevent double booking
    - Index on email for client lookup
    - Index on booking_date for efficient date queries
*/

-- Create bookings table
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

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy for service providers (you) to manage all bookings
CREATE POLICY "Service providers can manage all bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for clients to view their own bookings only
CREATE POLICY "Clients can view own bookings"
  ON bookings
  FOR SELECT
  TO anon
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings (email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings (booking_date, booking_time);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();