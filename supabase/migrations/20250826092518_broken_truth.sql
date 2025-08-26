@@ .. @@
 -- Create bookings table for consultation scheduling
 CREATE TABLE IF NOT EXISTS bookings (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   name text NOT NULL,
   email text NOT NULL,
   phone text NOT NULL,
   business_name text NOT NULL,
   
   -- UK (Your) side - when YOU make the call
-  booking_date date NOT NULL,
-  booking_time_uk time NOT NULL, -- UK/GMT business hours (9 AM - 9 PM UK time)
+  appointment_date_uk date NOT NULL, -- UK date when YOU make the call
+  appointment_time_uk time NOT NULL, -- UK time when YOU make the call (9 AM - 9 PM UK time)
   
   -- User's side - their local date/time
-  user_local_date date NOT NULL, -- Date in user's timezone
-  user_local_time time NOT NULL, -- Time in user's timezone
+  appointment_date_user date NOT NULL, -- Date in user's timezone
+  appointment_time_user time NOT NULL, -- Time in user's timezone
   user_timezone text NOT NULL, -- User's timezone (e.g., 'America/New_York')
   user_display_time text NOT NULL, -- Formatted display (e.g., '2:00 PM EST, Tuesday Jan 28')
   
@@ .. @@
   notes text DEFAULT 'Consultation booking via website',
   
   -- Prevent double booking with unique constraint
-  CONSTRAINT unique_booking_slot UNIQUE (booking_date, booking_time_uk)
+  CONSTRAINT unique_appointment_slot UNIQUE (appointment_date_uk, appointment_time_uk)
 );