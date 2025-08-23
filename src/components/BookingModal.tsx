import React, { useState } from 'react';
import { X, Calendar, User, Mail, Phone, Building2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

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

  // Security: Input validation and sanitization
  const validateInput = (value: string, type: 'name' | 'email' | 'phone' | 'business' | 'date' | 'time') => {
    // Remove potentially dangerous characters
    const sanitized = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                           .replace(/javascript:/gi, '')
                           .replace(/on\w+\s*=/gi, '')
                           .trim();
    
    switch (type) {
      case 'name':
      case 'business':
        return sanitized.replace(/[<>\"']/g, '').substring(0, 100);
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(sanitized) ? sanitized.substring(0, 254) : '';
      case 'phone':
        return sanitized.replace(/[^\d\s\+\-\(\)]/g, '').substring(0, 20);
      case 'date':
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(sanitized) ? sanitized : '';
      case 'time':
        const timeRegex = /^\d{2}:\d{2}$/;
        return timeRegex.test(sanitized) ? sanitized : '';
      default:
        return sanitized;
    }
  };

  // Security: Rate limiting
  const checkRateLimit = () => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    
    // Prevent more than 3 submissions in 5 minutes
    if (submitAttempts >= 3 && timeSinceLastSubmit < 300000) {
      return false;
    }
    
    // Reset attempts after 5 minutes
    if (timeSinceLastSubmit > 300000) {
      setSubmitAttempts(0);
    }
    
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security checks
    if (isSubmitting) return;
    
    if (!checkRateLimit()) {
      alert('Too many submission attempts. Please wait a few minutes before trying again.');
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
      // Submit to Netlify with validated data
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
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const validatedValue = validateInput(value, name as any);
    
    setFormData({
      ...formData,
      [name]: validatedValue
    });
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
  const generateTimeOptions = () => {
    const times = [];
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // UK business hours: 9am to 6pm (every 30 minutes)
    const ukTimes = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];
    
    ukTimes.forEach(ukTime => {
      // Create a date object for today with UK time
      const ukDate = new Date();
      const [hours, minutes] = ukTime.split(':');
      ukDate.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Convert to user's timezone
      const userTime = ukDate.toLocaleTimeString('en-US', {
        timeZone: userTimezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      // Get the user's timezone abbreviation
      const timezoneName = ukDate.toLocaleTimeString('en-US', {
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
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="consultation-booking" />
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
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  required
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
                  max={new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]} // 30 days from now
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 text-lg text-gray-900"
                />
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
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 text-lg text-gray-900"
                >
                  <option value="">Select your preferred time</option>
                  {generateTimeOptions().map((time, index) => (
                    <option key={index} value={time.value}>
                      {time.display}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  Times shown in your local timezone.
                </p>
              </div>
              {/* Additional Info */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-black text-gray-900 mb-3">What happens next?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>We'll call you at your preferred date and time for a quick 10-minute consultation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>We discuss your current website and what's not working for your clinic</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>We show you a real mockup designed specifically for your clinic</span>
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
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-12 py-6 rounded-2xl transition-all duration-500 font-black text-xl ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 hover:shadow-lg hover:scale-105'
                } text-white`}
              >
                {isSubmitting ? 'Submitting...' : 'Schedule My Free Consultation'}
              </button>
            </form>
          ) : (
            <div className="text-center py-16">
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
                Thank you for your interest! We'll send you the call link within 24 hours for your free 10-minute consultation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;