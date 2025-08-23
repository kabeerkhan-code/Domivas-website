import React from 'react';
import { Linkedin, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  onPrivacyClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onPrivacyClick }) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-32 h-32 bg-gray-700 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-24 h-24 bg-gray-700 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <h3 className="text-white font-black mb-8 text-xl uppercase tracking-wide">Domivas</h3>
            <p className="text-gray-400 max-w-md text-xl leading-relaxed font-medium">
              We design websites that look sharp, load fast, and bring in results.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-black mb-8 text-xl uppercase tracking-wide">Quick Links</h3>
            <div className="space-y-4">
              <button 
                onClick={() => scrollToSection('demo')}
                className="block text-left text-gray-400 hover:text-red-500 transition-all duration-300 text-lg font-semibold hover:translate-x-2"
              >
                Demo
              </button>
              <button 
                onClick={() => scrollToSection('process')}
                className="block text-left text-gray-400 hover:text-red-500 transition-all duration-300 text-lg font-semibold hover:translate-x-2"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('process')}
                className="block text-left text-gray-400 hover:text-red-500 transition-all duration-300 text-lg font-semibold hover:translate-x-2"
              >
                Why It Works
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="block text-left text-gray-400 hover:text-red-500 transition-all duration-300 text-lg font-semibold hover:translate-x-2"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block text-left text-gray-400 hover:text-red-500 transition-all duration-300 text-lg font-semibold hover:translate-x-2"
              >
                Contact
              </button>
              <button 
                onClick={onPrivacyClick}
                className="block text-left text-gray-400 hover:text-red-500 transition-all duration-300 text-lg font-semibold hover:translate-x-2"
              >
                Privacy Policy
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-black mb-8 text-xl uppercase tracking-wide">Contact</h3>
            <div className="space-y-4">
              <a 
                href="mailto:support@domivas.com"
                className="block text-gray-400 hover:text-red-500 transition-all duration-300 text-lg font-semibold hover:translate-x-2"
              >
                support@domivas.com
              </a>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-16">
          <h3 className="text-white font-black mb-8 text-xl uppercase tracking-wide">Follow Us</h3>
          <div className="flex space-x-6">
            <a 
              href="#" 
              className="text-gray-400 hover:text-red-500 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              aria-label="LinkedIn"
            >
              <Linkedin size={28} />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-red-500 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              aria-label="Instagram"
            >
              <Instagram size={28} />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-red-500 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              aria-label="Twitter"
            >
              <Twitter size={28} />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-12 text-center">
          <p className="text-gray-500 text-lg font-medium">
            © 2025 Domivas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;