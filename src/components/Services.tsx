import React from 'react';
import { useState } from 'react';
import { Palette, Code, Search } from 'lucide-react';
import BookingModal from './BookingModal';

const Services = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="demo" className="py-32 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-red-600 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-red-600 rotate-12"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-8xl font-black text-gray-900 mb-12 leading-none tracking-tight">
            A <span className="text-red-600">Real Example</span> Built for <span className="text-red-600">Dentists</span>
          </h2>
          <div className="space-y-8 text-xl lg:text-2xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
            <p>Below is a full demo site built specifically for a dental clinic.</p>
            <p className="font-black text-2xl lg:text-3xl text-gray-900"><span className="text-red-600">Clean</span> layout. <span className="text-red-600">Clear</span> messaging. Built to build <span className="text-red-600">trust</span>.</p>
            <p>Your version will be fully tailored — Your services, your team, your voice, your practice.</p>
          </div>
        </div>

        {/* Enhanced Demo CTA Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-16 text-center relative overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rotate-45"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/2 right-20 w-12 h-12 bg-white rotate-12"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-none tracking-tight">
                See It <span className="text-red-500">Live</span>
              </h3>
              
              <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Experience exactly what we build for dental clinics. This is a real, working website designed to earn trust and drive appointments.
              </p>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-center justify-center space-x-4 text-gray-300">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold">Live, fully functional demo</span>
                </div>
                <div className="flex items-center justify-center space-x-4 text-gray-300">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse animation-delay-1000"></div>
                  <span className="text-lg font-semibold">Mobile-responsive design</span>
                </div>
                <div className="flex items-center justify-center space-x-4 text-gray-300">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse animation-delay-2000"></div>
                  <span className="text-lg font-semibold">Built for trust and conversions</span>
                </div>
              </div>
              
              <a 
                href="https://domivas-dental-moder-gz3o.bolt.host"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-20 py-8 rounded-full hover:shadow-2xl transition-all duration-500 font-black text-2xl lg:text-3xl uppercase tracking-wide hover:scale-110 hover:-translate-y-3 shadow-lg border-4 border-red-700 mb-6"
              >
                🚀 Explore Live Demo Site
              </a>
              
              <p className="text-gray-400 text-lg font-medium">
                Opens in new tab • No signup required • Fully interactive
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-8xl font-black text-gray-900 mb-16 leading-none tracking-tight">
            What <span className="text-red-600">You Get</span>?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-lg">
            <div className="space-y-4 text-lg text-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>Up to 15 fully written, professionally designed pages</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>Mobile-friendly and SEO-ready</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>Built-in trust sections: reviews, team, services, FAQs</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-lg">
            <div className="space-y-4 text-lg text-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>Click-to-call functionality and Google Maps</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>Clean navigation, fast load speeds</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>Designed to earn trust and drive appointments</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-16 py-8 rounded-full hover:shadow-2xl transition-all duration-500 font-black text-2xl uppercase tracking-wide hover:scale-110 hover:-translate-y-2 shadow-lg border-4 border-red-700"
          >
            BOOK FREE 10-MINUTE CONSULTATION
          </button>
        </div>
      </div>
      
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </section>
  );
};

export default Services;