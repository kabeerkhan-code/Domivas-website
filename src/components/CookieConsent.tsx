import React, { useState, useEffect } from 'react';
import { X, Shield, Cookie } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    // Validate localStorage is available
    try {
      localStorage.setItem('cookieConsent', 'all');
      setIsVisible(false);
    } catch (error) {
      console.error('Unable to save cookie preferences');
    }
  };

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem('cookieConsent', 'essential');
      setIsVisible(false);
    } catch (error) {
      console.error('Unable to save cookie preferences');
    }
  };

  const handleReject = () => {
    try {
      localStorage.setItem('cookieConsent', 'rejected');
      setIsVisible(false);
    } catch (error) {
      console.error('Unable to save cookie preferences');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center mb-3">
              <Cookie className="text-red-600 mr-2" size={24} />
              <h3 className="text-xl font-black text-gray-900">Cookie Preferences</h3>
            </div>
            
            <p className="text-gray-600 mb-4 leading-relaxed">
              We use cookies to enhance your browsing experience, analyze site traffic, and provide personalized content. 
              By clicking "Accept All", you consent to our use of cookies.
            </p>

            {showDetails && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-4 space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Essential Cookies</h4>
                  <p className="text-sm text-gray-600">Required for basic site functionality, form submissions, and security. Cannot be disabled.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600">Help us understand how visitors interact with our website to improve user experience.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600">Used to track visitors across websites to display relevant advertisements.</p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAcceptAll}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
              >
                Accept All
              </button>
              <button
                onClick={handleAcceptEssential}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
              >
                Essential Only
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-gray-600 hover:text-gray-900 px-4 py-3 font-semibold transition-colors underline"
              >
                {showDetails ? 'Hide Details' : 'Cookie Details'}
              </button>
            </div>
          </div>
          
          <button
            onClick={handleReject}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title="Reject all non-essential cookies"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;