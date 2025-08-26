import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our booking system
export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  
  // UK (Your) side - when YOU make the call
  booking_date: string;
  booking_time_uk: string; // UK/GMT time
  
  // User's side - their local date/time
  user_local_date: string; // Date in user's timezone
  user_local_time: string; // Time in user's timezone
  user_timezone: string; // User's timezone
  user_display_time: string; // Formatted display
  
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  notes?: string;
}

// Types for our contact system
export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'responded' | 'closed';
  created_at: string;
  updated_at: string;
  user_agent?: string;
  ip_address?: string;
}

// Function to check if a time slot is available
export async function checkTimeSlotAvailability(date: string, time: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_date', date)
      .eq('booking_time_uk', time)
      .eq('status', 'confirmed')
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" which means slot is available
      console.error('Error checking availability:', error);
      return false; // Err on the side of caution
    }

    return !data; // If no data found, slot is available
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    return false;
  }
}

// Function to get all booked times for a specific date
export async function getBookedTimes(date: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('booking_time_uk')
      .eq('booking_date', date)
      .in('status', ['pending', 'confirmed']);

    if (error) {
      console.error('Error fetching booked times:', error);
      return [];
    }

    return data?.map(booking => booking.booking_time_uk) || [];
  } catch (error) {
    console.error('Error fetching booked times:', error);
    return [];
  }
}

// Function to create a new booking
export async function createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  try {
    // First check if the slot is still available
    const isAvailable = await checkTimeSlotAvailability(bookingData.booking_date, bookingData.booking_time_uk);
    
    if (!isAvailable) {
      return {
        success: false,
        error: 'This time slot has already been booked. Please select another time.'
      };
    }

    // Create the booking
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      // Check if it's a unique constraint violation (double booking)
      if (error.code === '23505') {
        return {
          success: false,
          error: 'This time slot was just booked by someone else. Please select another time.'
        };
      }
      
      console.error('Error creating booking:', error);
      return {
        success: false,
        error: 'Failed to create booking. Please try again.'
      };
    }

    return {
      success: true,
      booking: data
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    };
  }
}

// Function to update booking status
export async function updateBookingStatus(bookingId: string, status: Booking['status']): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);

    if (error) {
      console.error('Error updating booking status:', error);
      return {
        success: false,
        error: 'Failed to update booking status.'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return {
      success: false,
      error: 'An unexpected error occurred.'
    };
  }
}

// Function to get bookings for a date range (for admin view)
export async function getBookings(startDate?: string, endDate?: string): Promise<Booking[]> {
  try {
    let query = supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: true })
      .order('booking_time_uk', { ascending: true });

    if (startDate) {
      query = query.gte('booking_date', startDate);
    }
    
    if (endDate) {
      query = query.lte('booking_date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

// Function to create a new contact inquiry
export async function createContact(contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; contact?: Contact; error?: string }> {
  try {
    // Validate input data
    if (!contactData.name || contactData.name.length < 2 || contactData.name.length > 100) {
      return {
        success: false,
        error: 'Name must be between 2 and 100 characters.'
      };
    }

    if (!contactData.email || !contactData.email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
      return {
        success: false,
        error: 'Please provide a valid email address.'
      };
    }

    if (!contactData.message || contactData.message.length < 10 || contactData.message.length > 2000) {
      return {
        success: false,
        error: 'Message must be between 10 and 2000 characters.'
      };
    }

    // Create the contact inquiry
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      return {
        success: false,
        error: 'Failed to submit your message. Please try again.'
      };
    }

    return {
      success: true,
      contact: data
    };
  } catch (error) {
    console.error('Error creating contact:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    };
  }
}

// Function to update contact status
export async function updateContactStatus(contactId: string, status: Contact['status']): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', contactId);

    if (error) {
      console.error('Error updating contact status:', error);
      return {
        success: false,
        error: 'Failed to update contact status.'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating contact status:', error);
    return {
      success: false,
      error: 'An unexpected error occurred.'
    };
  }
}

// Function to get contacts for admin view
export async function getContacts(status?: Contact['status'], limit?: number): Promise<Contact[]> {
  try {
    let query = supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
}

// Function to get contact by email (for user to view their own submissions)
export async function getContactsByEmail(email: string): Promise<Contact[]> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contacts by email:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching contacts by email:', error);
    return [];
  }
}