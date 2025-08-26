/*
  # Final Appointment System with Clear Timezone Handling

  1. New Tables
    - `bookings` - For consultation scheduling with dual timezone support
      - UK side: appointment_date_uk, appointment_time_uk (when YOU call)
      - User side: appointment_date_user, appointment_time_user (their local time)
      - Timezone info: user_timezone, user_display_time
      
    - `contacts` - For general inquiries
      - Standard contact form fields with validation

  2. Security
    - Enable RLS on both tables
    - Add policies for managing data
    - Add data validation constraints

  3. Performance & Double Booking Prevention
    - Create indexes for efficient queries
    - Add unique constraints to prevent double booking
    - Real-time slot availability checking
*/

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;

-- Create bookings table for consultation scheduling
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  business_name text NOT NULL,
  
  -- UK (Your) side - when YOU make the call
  appointment_date_uk date NOT NULL, -- UK date when YOU make the call
  appointment_time_uk time NOT NULL, -- UK time when YOU make the call (9 AM - 9 PM UK time)
  
  -- User's side - their local date/time
  appointment_date_user date NOT NULL, -- Date in user's timezone
  appointment_time_user time NOT NULL, -- Time in user's timezone
  user_timezone text NOT NULL, -- User's timezone (e.g., 'America/New_York')
  user_display_time text NOT NULL, -- Formatted display (e.g., 'Tuesday, January 28, 2025 at 2:00 PM EST')
  
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  notes text DEFAULT 'Consultation booking via website',
  
  -- Prevent double booking with unique constraint
  CONSTRAINT unique_appointment_slot UNIQUE (appointment_date_uk, appointment_time_uk)
);

-- Create contacts table for general inquiries
CREATE TABLE contacts (
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
CREATE INDEX idx_bookings_appointment_date_uk ON bookings (appointment_date_uk);
CREATE INDEX idx_bookings_email ON bookings (email);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_appointment_datetime_uk ON bookings (appointment_date_uk, appointment_time_uk);
CREATE INDEX idx_bookings_user_timezone ON bookings (user_timezone);

-- Create indexes for performance on contacts
CREATE INDEX idx_contacts_email ON contacts (email);
CREATE INDEX idx_contacts_status ON contacts (status);
CREATE INDEX idx_contacts_created_at ON contacts (created_at DESC);
CREATE INDEX idx_contacts_updated_at ON contacts (updated_at DESC);

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