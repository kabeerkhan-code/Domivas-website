import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Booking {
  id?: string;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  
  // UK (Your) side - when YOU make the call
  appointment_date_uk: string;
  appointment_time_uk: string;
  
  // User's side - their local date/time
  appointment_date_user: string;
  appointment_time_user: string;
  user_timezone: string;
  user_display_time: string;
  
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at?: string;
  updated_at?: string;
  notes?: string;
}

export interface Contact {
  id?: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'responded' | 'closed';
  created_at?: string;
  updated_at?: string;
  user_agent?: string;
  ip_address?: string;
}

// Create a new booking
export const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Input validation
    if (!booking.name || !booking.email || !booking.phone || !booking.business_name || 
        !booking.appointment_date_uk || !booking.appointment_time_uk) {
      return { success: false, error: 'All fields are required' };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(booking.email)) {
      return { success: false, error: 'Invalid email format' };
    }

    // Date validation (not in the past, not too far in future)
    const appointmentDate = new Date(booking.appointment_date_uk);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 90);

    if (appointmentDate < today || appointmentDate > maxDate) {
      return { success: false, error: 'Invalid appointment date' };
    }

    // Check if slot is already booked (double booking prevention)
    const existingBooking = await supabase
      .from('bookings')
      .select('id')
      .eq('appointment_date_uk', booking.appointment_date_uk)
      .eq('appointment_time_uk', booking.appointment_time_uk)
      .single();

    if (existingBooking.data) {
      return { success: false, error: 'This time slot is already booked. Please select another time.' };
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single();

    if (error) {
      console.error('Supabase booking error:', error);
      
      // Handle specific constraint violations
      if (error.code === '23505' && error.constraint === 'unique_appointment_slot') {
        return { success: false, error: 'This time slot is already booked. Please select another time.' };
      }
      
      return { success: false, error: 'Failed to create booking. Please try again.' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Booking creation error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
};

// Get booked times for a specific date (double booking prevention)
export const getBookedTimes = async (date: string): Promise<string[]> => {
  try {
    // Input validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      console.error('Invalid date format');
      return [];
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('appointment_time_uk')
      .eq('appointment_date_uk', date)
      .in('status', ['pending', 'confirmed']); // Only active bookings

    if (error) {
      console.error('Error fetching booked times:', error);
      return [];
    }

    return data?.map(booking => booking.appointment_time_uk) || [];
  } catch (error) {
    console.error('Error in getBookedTimes:', error);
    return [];
  }
};

// Get all bookings (for admin use)
export const getBookings = async (startDate?: string, endDate?: string) => {
  try {
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

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      return { success: false, error: 'Failed to fetch bookings' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in getBookings:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

// Create a new contact
export const createContact = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Input validation
    if (!contact.name || !contact.email || !contact.message) {
      return { success: false, error: 'All fields are required' };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      return { success: false, error: 'Invalid email format' };
    }

    // Length validation
    if (contact.name.length < 2 || contact.name.length > 100) {
      return { success: false, error: 'Name must be between 2 and 100 characters' };
    }

    if (contact.message.length < 10 || contact.message.length > 2000) {
      return { success: false, error: 'Message must be between 10 and 2000 characters' };
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select()
      .single();

    if (error) {
      console.error('Supabase contact error:', error);
      return { success: false, error: 'Failed to send message. Please try again.' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Contact creation error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
};

// Get all contacts (for admin use)
export const getContacts = async () => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contacts:', error);
      return { success: false, error: 'Failed to fetch contacts' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in getContacts:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};