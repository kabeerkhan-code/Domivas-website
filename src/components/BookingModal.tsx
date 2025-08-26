import React, { useState } from 'react';
import { X, Calendar, User, Mail, Phone, Building2 } from 'lucide-react';
import { createBooking, getBookedTimes } from '../lib/supabase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    preferredDate: '',
    preferredTime: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');

  // Auto-dismiss success message after 1 minute
  React.useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        onClose();
      }, 60000); // 1 minute
      
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, onClose]);

  // Generate CSRF token and session ID on component mount
  React.useEffect(() => {
    const generateSecureToken = () => {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    };
    
    setCsrfToken(generateSecureToken());
    setSessionId(generateSecureToken());
  }, []);

  // Fetch booked times when date changes
  React.useEffect(() => {
    if (formData.preferredDate) {
      fetchBookedTimesFromSupabase(formData.preferredDate);
    }
  }, [formData.preferredDate]);

  // Function to fetch booked times from Supabase
  const fetchBookedTimesFromSupabase = async (date: string) => {
    // Input validation for date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      console.error('Invalid date format');
      return;
    }
    
    // Prevent fetching dates too far in the future (max 90 days)
    const selectedDate = new Date(date);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    
    if (selectedDate > maxDate) {
      console.error('Date too far in the future');
      return;
    }

    setLoadingTimes(true);
    try {
      // Fetch booked times from Supabase
      const bookedTimesData = await getBookedTimes(date);
      
      // Validate each booked time format
      const validBookedTimes = bookedTimesData.filter((time: string) => {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return typeof time === 'string' && timeRegex.test(time);
      });
      
      setBookedTimes(validBookedTimes);
    } catch (error) {
      console.error('Failed to fetch booked times:', error);
      // Secure fallback - don't expose error details to user
      setBookedTimes([]);
    } finally {
      setLoadingTimes(false);
    }
  };
  // Security: Input validation and sanitization
  const validateInput = (value: string, type: 'name' | 'email' | 'phone' | 'business' | 'date' | 'time') => {
    // Remove potentially dangerous characters and scripts
    const sanitized = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                           .replace(/javascript:/gi, '')
                           .replace(/on\w+\s*=/gi, '')
                           .replace(/data:/gi, '')
                           .replace(/vbscript:/gi, '')
                           .replace(/file:/gi, '')
                           .replace(/ftp:/gi, '')
                           .trim();
    
    switch (type) {
      case 'name':
      case 'business':
        // Allow only letters, spaces, hyphens, apostrophes, and dots
        return sanitized.replace(/[^a-zA-Z\s\-'\.]/g, '').substring(0, 100);
      case 'email':
        // Strict email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const cleanEmail = sanitized.toLowerCase().replace(/[^a-zA-Z0-9._%+-@]/g, '');
        return emailRegex.test(cleanEmail) ? cleanEmail.substring(0, 254) : '';
      case 'phone':
        // Allow only digits, spaces, +, -, (, )
        const cleanPhone = sanitized.replace(/[^\d\s\+\-\(\)]/g, '').substring(0, 20);
        // Basic phone validation (at least 7 digits)
        const digitCount = cleanPhone.replace(/[^\d]/g, '').length;
        return digitCount >= 7 ? cleanPhone : '';
      case 'date':
        // Strict date validation
        const dateRegex = /^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if (!dateRegex.test(sanitized)) return '';
        
        // Validate actual date
        const date = new Date(sanitized);
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 90);
        
        return (date >= today && date <= maxDate) ? sanitized : '';
      case 'time':
        // Strict time validation (business hours only)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(sanitized)) return '';
        
        const [hours, minutes] = sanitized.split(':').map(Number);
        // Only allow business hours (9:00-21:00) and 20-minute intervals
        if (hours < 9 || hours > 21 || (hours === 21 && minutes > 0)) return '';
        if (minutes % 20 !== 0) return '';
        
        return sanitized;
      default:
        return sanitized;
    }
  };

  // Security: Rate limiting
  const checkRateLimit = () => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    
    // Prevent more than 2 submissions in 10 minutes (stricter)
    if (submitAttempts >= 2 && timeSinceLastSubmit < 600000) {
      return false;
    }
    
    // Reset attempts after 10 minutes
    if (timeSinceLastSubmit > 600000) {
      setSubmitAttempts(0);
    }
    
    return true;
  };

  // Security: Honeypot field (hidden from users, bots will fill it)
  const [honeypot, setHoneypot] = useState('');

  // Security: Form submission timing (prevent too fast submissions)
  const [formStartTime] = useState(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security checks
    if (isSubmitting) return;
    
    if (!checkRateLimit()) {
      alert('Too many submission attempts. Please wait 10 minutes before trying again.');
      return;
    }
    
    // Security: Check honeypot (if filled, it's likely a bot)
    if (honeypot) {
      console.log('Bot detected via honeypot');
      return;
    }
    
    // Security: Prevent too fast submissions (minimum 10 seconds)
    const timeSinceFormStart = Date.now() - formStartTime;
    if (timeSinceFormStart < 60000) {
      alert('Please take your time filling out the form.');
      return;
    }
    
    // Validate all inputs
    const validatedData = {
      name: validateInput(formData.name, 'name'),
      email: validateInput(formData.email, 'email'),
      phone: validateInput(formData.phone, 'phone'),
      businessName: validateInput(formData.businessName, 'business'),
      preferredDate: validateInput(formData.preferredDate, 'date'),
      preferredTime: validateInput(formData.preferredTime, 'time')
    };
    
    // Check if validation passed
    if (!validatedData.name || !validatedData.email || !validatedData.phone || 
        !validatedData.businessName || !validatedData.preferredDate || !validatedData.preferredTime) {
      alert('Please fill in all fields with valid information.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);
    setLastSubmitTime(Date.now());
    
    try {
      // Calculate user's local date and time
      const selectedDate = new Date(validatedData.preferredDate);
      const [ukHours, ukMinutes] = validatedData.preferredTime.split(':').map(Number);
      
      // Create UK datetime
      const ukDateTime = new Date(selectedDate);
      ukDateTime.setHours(ukHours, ukMinutes, 0, 0);
      
      // Convert to user's timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const userDateTime = new Date(ukDateTime.toLocaleString('en-US', { timeZone: userTimezone }));
      
      // Format user's local date and time
      const userLocalDate = userDateTime.toISOString().split('T')[0];
      const userLocalTime = userDateTime.toTimeString().split(' ')[0].substring(0, 5);
      
      // Create formatted display string
      const userDisplayDateTime = userDateTime.toLocaleString('en-US', {
        timeZone: userTimezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
      
      // Create booking in Supabase
      const result = await createBooking({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        business_name: validatedData.businessName,
        
        // UK (Your) side
        appointment_date_uk: validatedData.preferredDate,
        appointment_time_uk: validatedData.preferredTime, // This is UK time
        
        // User's side
        appointment_date_user: userLocalDate,
        appointment_time_user: userLocalTime,
        user_timezone: userTimezone,
        user_display_time: userDisplayDateTime,
        
        status: 'pending',
        notes: `Consultation booking via website. Form submitted at: ${new Date().toISOString()}`
      });
      
      if (result.success) {
        setIsSubmitted(true);
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          businessName: '',
          preferredDate: '',
          preferredTime: ''
        });
      } else {
        // Handle specific error messages
        alert(result.error || 'Failed to book consultation. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Try fallback Netlify submission for contact purposes
      const fallbackSuccess = await submitToNetlify(validatedData);
      
      if (fallbackSuccess) {
        alert('Your consultation request was submitted, but there may have been a scheduling conflict. We\'ll contact you within 24 hours to confirm your appointment time.');
      } else {
        alert('There was an error submitting your request. Please try again or contact support directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fallback Netlify submission (if main API fails)
  const submitToNetlify = async (validatedData: any) => {
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'form-name': 'consultation-booking',
          ...validatedData
        }).toString()
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          businessName: '',
          preferredDate: '',
          preferredTime: ''
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Netlify submission failed:', error);
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Additional security: Prevent excessively long inputs
    if (value.length > 1000) {
      return;
    }
    
    const validatedValue = validateInput(value, name as any);
    
    setFormData({
      ...formData,
      [name]: validatedValue
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Security: Allow spacebar in form inputs but prevent certain key combinations
    if (e.key === ' ') {
      e.stopPropagation();
    }
    
    // Prevent common XSS key combinations
    if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
      // Allow paste but validate on change
      return;
    }
  };

  // Generate date options for the next 30 days
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        const dateString = date.toISOString().split('T')[0];
        const displayDate = date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        dates.push({ value: dateString, display: displayDate });
      }
    }
    return dates;
  };

  // Generate time options based on UK business hours (9am-6pm) but show in user's timezone
  const generateTimeOptions = (selectedDate?: string) => {
    const times = [];
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // UK business hours: 9am to 6:30pm (every 20 minutes) - converted to user's timezone
    // UK business hours: 9am to 9:00pm (every 20 minutes) - converted to user's timezone
    const ukBusinessHours = [];
    
    // Generate times in 20-minute intervals
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 20) {
        // Stop at 9:00 PM (21:00)
        if (hour === 21 && minute > 0) break;
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        ukBusinessHours.push(timeString);
      }
    }
    
    ukBusinessHours.forEach(ukTime => {
      // Skip booked times
      if (bookedTimes.includes(ukTime)) {
        return;
      }
      
      // Skip past times if date is today
      if (selectedDate) {
        const selectedDateObj = new Date(selectedDate);
        const today = new Date();
        
        if (selectedDateObj.toDateString() === today.toDateString()) {
          const [hours, minutes] = ukTime.split(':');
          // Create UK time for today
          const ukTimeToday = new Date();
          ukTimeToday.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          // Convert to user's timezone and check if it's in the past
          const userTimeToday = new Date(ukTimeToday.toLocaleString('en-US', { timeZone: userTimezone }));
          
          if (userTimeToday <= new Date()) {
            return; // Skip past times
          }
        }
      }
      
      // Create a date object with UK business time
      const [hours, minutes] = ukTime.split(':');
      
      // Create UK time (assuming GMT/BST)
      const ukDateTime = new Date();
      ukDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Convert to user's timezone
      const userTime = ukDateTime.toLocaleTimeString('en-US', {
        timeZone: userTimezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      // Get the user's timezone abbreviation
      const timezoneName = ukDateTime.toLocaleTimeString('en-US', {
        timeZone: userTimezone,
        timeZoneName: 'short'
      }).split(' ').pop();
      
      times.push({
        value: ukTime,
        display: `${userTime} (${timezoneName})`,
        userTime: userTime
      });
    });
    
    return times;
  };
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                Book Your <span className="text-red-600">Free</span> Consultation
              </h2>
              <p className="text-gray-600 text-lg">
                Schedule a 10-minute call to discuss your website needs
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={32} />
            </button>
          </div>

          {!isSubmitted ? (
            <form 
              name="consultation-booking" 
              method="POST" 
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="consultation-booking" />
              <input type="hidden" name="csrf-token" value={csrfToken} />
              <input type="hidden" name="session-id" value={sessionId} />
              
              {/* Honeypot field - hidden from users */}
              <div style={{ display: 'none' }}>
                <label htmlFor="bot-field">Don't fill this out if you're human:</label>
                <input
                  type="text"
                  name="bot-field"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wide flex items-center">
                  <User size={16} className="mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="name"
                  maxLength={100}
                  pattern="[a-zA-Z\s\-'\.]*"
                  title="Please enter a valid name (letters, spaces, hyphens, apostrophes, and dots only)"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 text-lg text-gray-900 placeholder-gray-500"
                  placeholder="Dr. John Smith"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wide flex items-center">
                  <Mail size={16} className="mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="email"
                  maxLength={254}
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                  title="Please enter a valid email address"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 text-lg text-gray-900 placeholder-gray-500"
                  placeholder="john@dentalclinic.com"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wide flex items-center">
                  <Phone size={16} className="mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="tel"
                  maxLength={20}
                  pattern="[\d\s\+\-\(\)]*"
                  title="Please enter a valid phone number"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 text-lg text-gray-900 placeholder-gray-500"
                  placeholder="+44 20 1234 5678"
                />
              </div>

              {/* Business Name Field */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wide flex items-center">
                  <Building2 size={16} className="mr-2" />
                  Clinic Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="organization"
                  maxLength={100}
                  pattern="[a-zA-Z\s\-'\.]*"
                  title="Please enter a valid clinic name"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 text-lg text-gray-900 placeholder-gray-500"
                  placeholder="Your Clinic Name"
                />
              </div>

              {/* Date Selection */}
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wide flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Preferred Call Date *
                </label>
                <select
                  id="preferredDate"
                  name="preferredDate"
                  required
                  value={formData.preferredDate}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 text-lg text-gray-900"
                >
                  <option value="">Select your preferred date</option>
                  {generateDateOptions().map((date, index) => (
                    <option key={index} value={date.value}>
                      {date.display}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Selection */}
              <div>
                <label htmlFor="preferredTime" className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wide flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Preferred Call Time *
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  required
                  value={formData.preferredTime}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  disabled={loadingTimes}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 text-lg text-gray-900"
                >
                  <option value="">
                    {loadingTimes ? 'Loading available times...' : 'Select your preferred time'}
                  </option>
                  {generateTimeOptions(formData.preferredDate).map((time, index) => (
                    <option key={index} value={time.value}>
                      {time.display}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  Times shown in your local timezone. All appointments are conducted during UK business hours (9 AM - 9 PM GMT).
                </p>
              </div>
              {/* Additional Info */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-black text-gray-900 mb-3">What happens next?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>You'll receive a call at your preferred date and time for a quick 10-minute consultation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Together we'll discuss your current website and what's not working for your clinic</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>You'll see a real mockup designed specifically for your clinic</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>You see exactly what your new website will look like before committing</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>If you love it, we start building. If not, no pressure whatsoever</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                  <p className="text-sm text-gray-600">
                    By submitting this form, you agree to our{' '}
                    <span className="text-red-600 font-semibold">Privacy Policy</span>
                    {' '}and consent to us contacting you about your consultation request.
                    {' '}Your data is encrypted and stored securely.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-8 sm:px-12 py-6 rounded-2xl transition-all duration-500 font-black text-lg sm:text-xl max-w-2xl mx-auto ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 hover:shadow-lg hover:scale-105'
                } text-white`}
              >
                {isSubmitting ? 'Submitting...' : 'Schedule My Free Consultation'}
              </button>
            </form>
          ) : (
            <div 
              className="text-center py-16 cursor-pointer" 
              onClick={onClose}
              title="Click anywhere to close"
            >
              {/* Close button for success message */}
              <button
                onClick={onClose}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={32} />
              </button>
              
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-white text-3xl">✓</div>
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">
                Request Sent!
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                Thank you! We'll send you the call link by email within 24 hours for your free 10-minute consultation.
              </p>
              <p className="text-gray-400 text-sm mt-6">
                Click anywhere to close • Auto-closes in 1 minute
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;