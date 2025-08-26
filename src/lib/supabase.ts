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
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  user_timezone?: string;
  notes?: string;
}

// Function to check if a time slot is available
export async function checkTimeSlotAvailability(date: string, time: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_date', date)
      .eq('booking_time', time)
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
      .select('booking_time')
      .eq('booking_date', date)
      .in('status', ['pending', 'confirmed']);

    if (error) {
      console.error('Error fetching booked times:', error);
      return [];
    }

    return data?.map(booking => booking.booking_time) || [];
  } catch (error) {
    console.error('Error fetching booked times:', error);
    return [];
  }
}

// Function to create a new booking
export async function createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  try {
    // First check if the slot is still available
    const isAvailable = await checkTimeSlotAvailability(bookingData.booking_date, bookingData.booking_time);
    
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
      .order('booking_time', { ascending: true });

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