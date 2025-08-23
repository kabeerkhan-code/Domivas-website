import React from 'react';
import { useState } from 'react';
import BookingModal from './BookingModal';

const Hero = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen relative overflow-hidden bg-white">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gray-100 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gray-50 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-100 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      {/* Geometric Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-40 left-10 w-4 h-4 bg-red-600 rotate-45 animate-float"></div>
        <div className="absolute top-60 right-32 w-6 h-6 bg-gray-900 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-40 left-32 w-3 h-3 bg-red-600 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-60 right-20 w-5 h-5 bg-gray-900 rotate-12 animate-float animation-delay-3000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-32 relative z-10">
        <div className="space-y-16">
          {/* Main Headline */}
          <div className="text-center space-y-8">
            <h1 className="text-6xl lg:text-8xl xl:text-9xl font-black text-gray-900 leading-none tracking-tight">
              Does Your <span className="text-red-600">Website</span> Reflect the <span className="text-red-600">Quality</span> of Your Clinic?
            </h1>
            
            <div className="space-y-6 text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              <p>You run a professional practice. Modern. Trustworthy. Patient-first.</p>
              <p className="font-black text-2xl lg:text-3xl text-gray-900">But does your <span className="text-red-600">website</span> show that?</p>
            </div>
          </div>

          {/* Problem Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-12 text-center">
            <h2 className="text-6xl lg:text-8xl font-black text-gray-900 mb-8 leading-none tracking-tight">
              <span className="text-red-600">Patients</span> Judge in <span className="text-red-600">Seconds</span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              If your site feels outdated or unclear, they hesitate. They leave. And you'll never know how many.
            </p>
          </div>

          {/* Solution Section */}
          <div className="text-center space-y-8">
            <h2 className="text-6xl lg:text-8xl font-black text-gray-900 leading-none tracking-tight mb-12">
              This <span className="text-red-600">Page</span> Is What We <span className="text-red-600">Build</span>
            </h2>
            
            <div className="space-y-8 text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              <p>You're reading what we deliver. Designed. Written. Built in under a week.</p>
              <p>Your version will be tailored to your clinic, your tone, your brand.</p>
              <p>This isn't a dental clinic site, but it shows the exact level of design, clarity, and trust we bring to every build.</p>
            </div>

            <div className="bg-red-600 text-white rounded-3xl p-12 inline-block transform hover:scale-105 transition-all duration-300">
              <p className="text-5xl lg:text-7xl font-black leading-tight">
                Up to <span className="text-white">15</span> custom pages. Live in <span className="text-white">5</span> working days. Flat <span className="text-white">£1,000</span> / <span className="text-white">$1,345</span>.
              </p>
            </div>

            <p className="text-xl lg:text-2xl text-gray-600 font-bold max-w-3xl mx-auto">
              We only take on a limited number of clinics each month to keep that turnaround guaranteed.
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-16 py-8 rounded-full hover:shadow-2xl transition-all duration-500 font-black text-2xl uppercase tracking-wide hover:scale-110 hover:-translate-y-2 shadow-lg border-4 border-red-700"
            >
              BOOK FREE 10-MINUTE CONSULTATION
            </button>
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

export default Hero;