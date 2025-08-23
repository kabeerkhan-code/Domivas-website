import React, { useState } from 'react';
import { Send, CheckCircle, X } from 'lucide-react';
import BookingModal from './BookingModal';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Security: Input validation and sanitization
  const validateInput = (value: string, type: 'name' | 'email' | 'message') => {
    // Remove potentially dangerous characters and scripts
    const sanitized = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                           .replace(/javascript:/gi, '')
                           .replace(/on\w+\s*=/gi, '')
                           .trim();
    
    switch (type) {
      case 'name':
        return sanitized.replace(/[<>\"']/g, '').substring(0, 100);
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(sanitized) ? sanitized.substring(0, 254) : '';
      case 'message':
        return sanitized.replace(/[<>]/g, '').substring(0, 2000);
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
  const handleSubmit = (e: React.FormEvent) => {
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
      message: validateInput(formData.message, 'message')
    };
    
    // Check if validation passed
    if (!validatedData.name || !validatedData.email || !validatedData.message) {
      alert('Please fill in all fields with valid information.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);
    setLastSubmitTime(Date.now());
    
    // Create FormData object for Netlify
    const formDataToSubmit = new URLSearchParams({
      'form-name': 'contact-form',
      ...validatedData
    });
    
    // Submit to Netlify
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formDataToSubmit.toString()
    })
    .then(() => {
      setIsSubmitted(true);
      // Reset form after successful submission
      setFormData({ name: '', email: '', message: '' });
    })
    .catch((error) => {
      console.error('Form submission failed:', error);
      alert('There was an error submitting your message. Please try again.');
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const validatedValue = validateInput(value, name as any);
    
    setFormData({
      ...formData,
      [name]: validatedValue
    });
  };

  return (
    <section id="contact" className="py-32 bg-gray-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gray-100 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gray-100 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Main CTA Section */}
        <div className="text-center mb-20">
          {/* Consultation Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-16 shadow-lg relative overflow-hidden">
              
              <div className="relative z-10 max-w-2xl mx-auto">
                {/* Headline */}
                <h2 className="text-6xl lg:text-8xl font-black text-gray-900 mb-12 text-center leading-none tracking-tight">
                  Book Your <span className="text-red-600">Free</span> 10-Minute <span className="text-red-600">Consultation</span>
                </h2>
                
                {/* Supporting Text */}
                <div className="text-left mb-12">
                  <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed text-center">
                    It's a <span className="font-bold text-gray-900">quick call</span> to understand your clinic, what's <span className="font-bold text-red-600">not working</span> with your current site, and whether we're the <span className="font-bold text-gray-900">right team</span> to help.
                  </p>
                  
                  {/* What We'll Do List */}
                  <div className="space-y-6 mb-16 max-w-3xl mx-auto">
                    <div className="flex items-start group">
                      <div className="w-4 h-4 bg-red-600 rounded-full mt-2 mr-6 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="text-xl text-gray-700 leading-relaxed">We get to know your <span className="font-bold text-gray-900">clinic</span> and show you a <span className="font-bold text-red-600">real mockup</span></span>
                    </div>
                    <div className="flex items-start group">
                      <div className="w-4 h-4 bg-red-600 rounded-full mt-2 mr-6 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="text-xl text-gray-700 leading-relaxed">See exactly what your <span className="font-bold text-red-600">new website</span> will look like</span>
                    </div>
                    <div className="flex items-start group">
                      <div className="w-4 h-4 bg-red-600 rounded-full mt-2 mr-6 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="text-xl text-gray-700 leading-relaxed">Decide if we're the <span className="font-bold text-gray-900">right team</span> to help</span>
                    </div>
                  </div>
                  
                  {/* Process */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-10 mb-12 shadow-sm max-w-3xl mx-auto">
                    <div className="space-y-8 text-xl text-gray-700 leading-relaxed">
                      <div className="pb-2">
                        <p>If you're <span className="font-bold text-red-600">happy</span>, you make a <span className="font-bold text-gray-900">50% down payment</span>.</p>
                      </div>
                      <div className="pb-2">
                        <p>We build the <span className="font-bold text-gray-900">full site</span>, you approve it, and pay the rest once it's <span className="font-bold text-red-600">live</span>.</p>
                      </div>
                      <div className="pb-2">
                        <p>If not, <span className="font-bold text-red-600">no pressure</span>. You're free to keep your current setup.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* No Pressure */}
                  <p className="text-xl text-gray-600 mb-16 text-center bg-white rounded-2xl p-6 border border-gray-200 max-w-2xl mx-auto">
                    Ready to get started? Click below to schedule your free consultation.
                  </p>
                </div>
                
                {/* CTA Button */}
                <div className="text-center mb-12">
                  <button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-16 py-8 rounded-full hover:shadow-2xl transition-all duration-500 font-black text-2xl uppercase tracking-wide hover:scale-110 hover:-translate-y-2 shadow-lg border-4 border-red-700 w-full"
                  >
                    BOOK FREE 10-MINUTE CONSULTATION
                  </button>
                </div>
                
                {/* Optional Additions */}
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                  <p className="text-lg text-gray-600">Only takes 10 minutes</p>
                  <p className="text-lg text-gray-600 font-medium">We only take on a few clinics per month to keep turnaround fast</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center mb-16 mt-20">
          <h2 className="text-6xl lg:text-8xl font-black text-gray-900 mb-12 leading-none tracking-tight">
            Get in <span className="text-red-600">Touch</span>
          </h2>
          <h3 className="text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-tight">
            Need <span className="text-red-600">Support</span>?
          </h3>
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              Technical issues with your website? Need help with updates or changes? Questions about your existing project?
            </p>
            <p className="text-lg text-gray-600">
              Email us directly and we'll get back to you within 24 hours.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <a 
              href="mailto:support@domivas.com"
              className="flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl hover:shadow-lg transition-all duration-500 font-black text-lg hover:scale-105 hover:-translate-y-1 w-full"
            >
              <Send size={20} className="mr-3" />
              support@domivas.com
            </a>
            <p className="text-center text-gray-500 text-sm mt-3">
              For technical support and existing project help
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Have a <span className="text-red-600">Question</span>?
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ask us anything about our services, pricing, timeline, or how we can help your business grow. We'll respond within 24 hours.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-3xl p-12 md:p-16 shadow-lg">
          {!isSubmitted ? (
            <form 
              name="contact-form" 
              method="POST" 
              data-netlify="true"
              onSubmit={handleSubmit} 
              className="space-y-8"
            >
              <input type="hidden" name="form-name" value="contact-form" />
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="name" className="block text-sm font-black text-gray-900 mb-4 uppercase tracking-wide">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 text-lg text-gray-900 placeholder-gray-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-black text-gray-900 mb-4 uppercase tracking-wide">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 text-lg text-gray-900 placeholder-gray-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-black text-gray-900 mb-4 uppercase tracking-wide">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 resize-none text-lg text-gray-900 placeholder-gray-500"
                  placeholder="Tell us about your project, ask a question, or describe how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-12 py-6 rounded-2xl transition-all duration-500 font-black text-xl flex items-center justify-center space-x-4 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 hover:shadow-lg hover:scale-105 hover:-translate-y-1'
                } text-white`}
              >
                <Send size={24} />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-16">
              <button
                onClick={() => setIsSubmitted(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              <CheckCircle className="mx-auto text-red-600 mb-8 animate-bounce" size={80} />
              <h3 className="text-4xl font-black text-gray-900 mb-6">
                Message Sent Successfully!
              </h3>
              <p className="text-gray-600 text-xl">
                Thank you for reaching out! We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-8 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
              >
                Send Another Message
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
      
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </section>
  );
};

export default Contact;