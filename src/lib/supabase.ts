let query = supabase
  .from('bookings')
  .select('*')
  .order('appointment_date_uk', { ascending: true })
  .order('appointment_time_uk', { ascending: true });

if (startDate) {
  query = query.gte('appointment_date_uk', startDate);
}

if (endDate) {
  query = query.lte('appointment_date_uk', endDate);
}