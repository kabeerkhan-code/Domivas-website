@@ .. @@
 -- Create indexes for performance on bookings
 CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (booking_date);
 CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings (email);
 CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
-CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings (booking_date, booking_time);
+CREATE INDEX IF NOT EXISTS idx_bookings_date_time_uk ON bookings (booking_date, booking_time_uk);
+CREATE INDEX IF NOT EXISTS idx_bookings_user_timezone ON bookings (user_timezone);