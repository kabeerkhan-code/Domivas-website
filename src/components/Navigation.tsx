import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import BookingModal from './BookingModal';

interface NavigationProps {
  onPrivacyClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onPrivacyClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Floating Navigation */}
      <nav className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
        isScrolled ? 'scale-95' : 'scale-100'
      }`}>
        <div className="bg-white border border-e5e7eb rounded-full px-8 py-4 shadow-lg">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-xl font-black text-gray-900 hover:text-red-600 transition-all duration-300 hover:scale-110"
            >
              <span className="text-gray-900">Domi</span><span className="text-red-600">vas</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('demo')}
                className="text-gray-600 hover:text-red-600 transition-all duration-300 font-semibold hover:scale-105"
              >
                Demo
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-red-600 transition-all duration-300 font-semibold hover:scale-105"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('process')}
                className="text-gray-600 hover:text-red-600 transition-all duration-300 font-semibold hover:scale-105"
              >
                Process
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-gray-600 hover:text-red-600 transition-all duration-300 font-semibold hover:scale-105"
              >
                Price
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-600 hover:text-red-600 transition-all duration-300 font-semibold hover:scale-105"
              >
                Contact
              </button>
              <button 
                onClick={onPrivacyClick}
                className="text-gray-600 hover:text-red-600 transition-all duration-300 font-semibold hover:scale-105"
              >
                Privacy
              </button>
              <button 
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full hover:shadow-xl transition-all duration-300 font-black text-sm uppercase tracking-wide hover:scale-110 shadow-md border-2 border-red-700"
              >
                BOOK FREE CONSULTATION
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-900 hover:text-red-600 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white border border-e5e7eb rounded-3xl p-6 shadow-lg">
            <div className="space-y-4">
              <button 
                onClick={() => scrollToSection('demo')}
                className="block w-full text-left text-gray-600 hover:text-red-600 transition-colors font-semibold"
              >
                Demo
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-gray-600 hover:text-red-600 transition-colors font-semibold"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('process')}
                className="block w-full text-left text-gray-600 hover:text-red-600 transition-colors font-semibold"
              >
                Process
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left text-gray-600 hover:text-red-600 transition-colors font-semibold"
              >
                Price
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left text-gray-600 hover:text-red-600 transition-colors font-semibold"
              >
                Contact
              </button>
              <button 
                onClick={onPrivacyClick}
                className="block w-full text-left text-gray-600 hover:text-red-600 transition-colors font-semibold"
              >
                Privacy
              </button>
              <button 
                onClick={() => setIsBookingModalOpen(true)}
                className="block w-full bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full hover:shadow-xl transition-all duration-300 font-black text-lg uppercase tracking-wide hover:scale-105 shadow-md border-2 border-red-700 text-center mt-4"
              >
                BOOK FREE CONSULTATION
              </button>
            </div>
          </div>
        )}
      </nav>
      
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </>
  );
};

export default Navigation;