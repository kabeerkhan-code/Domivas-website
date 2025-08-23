import React from 'react';
import { useState } from 'react';
import BookingModal from './BookingModal';

const About = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const steps = [
    {
      number: "1",
      title: "Free 10-minute consultation",
      description: "We get to know your business and show you a real mockup"
    },
    {
      number: "2", 
      title: "50% down payment",
      description: "You're happy with what you see, we start building"
    },
    {
      number: "3",
      title: "You approve → We launch → You pay the rest",
      description: "Only once you're fully satisfied"
    }
  ];

  return (
    <section id="process" className="py-32 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 right-32 w-40 h-40 bg-gray-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-32 w-32 h-32 bg-gray-100 rotate-45"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-8xl font-black text-gray-900 mb-16 leading-none tracking-tight">
            <span className="text-red-600">How</span> It Works?
          </h2>
        </div>

        {/* Timeline Process */}
        <div className="max-w-4xl mx-auto mb-20">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-8 mb-12 last:mb-0">
              {/* Timeline Line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">{step.number}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-1 h-16 bg-red-600 mt-4"></div>
                )}
              </div>
              <div className="pt-2 flex-1">
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-8xl font-black text-gray-900 mb-12 leading-none tracking-tight">
            <span className="text-red-600">Why</span> It Works?
          </h2>
          <div className="max-w-5xl mx-auto">
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed mb-12">
              We only build websites for dental clinics. No guesswork. No "starting from scratch." Just clean, clear, conversion-ready sites built for trust.
            </p>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="bg-gray-900 text-white rounded-3xl p-16 text-center mb-16">
          <h2 className="text-5xl lg:text-7xl font-black mb-12 leading-tight tracking-tight">
            <span className="text-red-600">£1,000 / $1,345</span>. <span className="text-red-600">Five Days</span>. <span className="text-red-600">Fifteen Pages</span>. Fully Done for You.
          </h2>
          <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
            No hidden fees. No ongoing costs. Just a proper site that finally reflects the quality of your clinic.
          </p>
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

export default About;