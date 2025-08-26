@@ .. @@
 -- Create bookings table for consultation scheduling
 CREATE TABLE IF NOT EXISTS bookings (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   name text NOT NULL,
   email text NOT NULL,
   phone text NOT NULL,
   business_name text NOT NULL,
+  
+  -- UK (Your) side - when YOU make the call
   booking_date date NOT NULL,
   booking_time_uk time NOT NULL, -- UK/GMT business hours (9 AM - 9 PM UK time)
+  
+  -- User's side - their local date/time
+  user_local_date date NOT NULL, -- Date in user's timezone
+  user_local_time time NOT NULL, -- Time in user's timezone
+  user_timezone text NOT NULL, -- User's timezone (e.g., 'America/New_York')
+  user_display_time text NOT NULL, -- Formatted display (e.g., '2:00 PM EST, Tuesday Jan 28')
+  
   status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
   created_at timestamptz DEFAULT now(),
   updated_at timestamptz DEFAULT now(),
-  user_timezone text, -- User's local timezone (e.g., 'America/New_York', 'Europe/London')
-  user_display_time text, -- Time as shown to user in their timezone (e.g., '2:00 PM EST')
   notes text DEFAULT 'Consultation booking via website',
   
   -- Prevent double booking with unique constraint
   CONSTRAINT unique_booking_slot UNIQUE (booking_date, booking_time_uk)
 );