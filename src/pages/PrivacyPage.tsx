import React from 'react';
import { Shield, Mail, Phone, MapPin, Clock, Download, FileText, ArrowLeft } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Back Button */}
      <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors font-semibold mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Main Site
          </button>
          <div className="flex items-center">
            <Shield className="text-red-600 mr-4" size={32} />
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">
              Privacy <span className="text-red-600">Policy</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-12">
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 2025
          </p>
          
          {/* PDF Download Section */}
          <div className="mt-12 bg-gray-50 rounded-3xl p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              Download Legal Documents
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Download official PDF versions of our legal documents for your records
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <a 
                href="/Domivas_UK_Privacy_Policy.pdf"
                download="Domivas_UK_Privacy_Policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-white border-2 border-gray-200 hover:border-red-600 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="text-center">
                  <FileText className="text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform" size={32} />
                  <h3 className="font-black text-gray-900 mb-2">UK Privacy Policy</h3>
                  <p className="text-sm text-gray-600 mb-3">For UK and EU users</p>
                  <div className="flex items-center justify-center text-red-600 font-semibold">
                    <Download size={16} className="mr-2" />
                    Download PDF
                  </div>
                </div>
              </a>
              
              <a 
                href="/Domivas_USA_Privacy_Policy.pdf"
                download="Domivas_USA_Privacy_Policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-white border-2 border-gray-200 hover:border-red-600 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="text-center">
                  <FileText className="text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform" size={32} />
                  <h3 className="font-black text-gray-900 mb-2">USA Privacy Policy</h3>
                  <p className="text-sm text-gray-600 mb-3">For US users</p>
                  <div className="flex items-center justify-center text-red-600 font-semibold">
                    <Download size={16} className="mr-2" />
                    Download PDF
                  </div>
                </div>
              </a>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              Both documents are also available in web format below for easy reading
            </p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          {/* Information We Collect */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  When you book a consultation or contact us, we collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Full name and professional title</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Business/clinic name</li>
                  <li>Preferred consultation date and time</li>
                  <li>Any additional information you provide in messages</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Automatically Collected Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referral source</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              How We Use Your Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="text-red-600 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-gray-900">Consultation Services</h4>
                  <p className="text-gray-700">To schedule and conduct your free consultation call</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="text-red-600 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-gray-900">Communication</h4>
                  <p className="text-gray-700">To respond to your inquiries and provide customer support</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Shield className="text-red-600 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-gray-900">Service Improvement</h4>
                  <p className="text-gray-700">To analyze website usage and improve our services</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="text-red-600 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-gray-900">Legal Compliance</h4>
                  <p className="text-gray-700">To comply with applicable laws and regulations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              Cookies and Tracking
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Essential Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  Required for basic website functionality, form submissions, and security. These cannot be disabled.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  Help us understand how visitors use our website to improve user experience. You can opt out of these.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Marketing Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  Used to show relevant advertisements and track campaign effectiveness. You can opt out of these.
                </p>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              Data Sharing and Third Parties
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in these limited circumstances:
            </p>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Service Providers:</strong> Google Forms for form submissions, email providers for communication</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfer:</strong> In the event of a merger or acquisition</li>
            </ul>
          </div>

          {/* Data Security */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">5</span>
              </div>
              Data Security
            </h2>
            
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. This includes SSL encryption, secure servers, and regular security updates.
            </p>
          </div>

          {/* Your Rights */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">6</span>
              </div>
              Your Rights
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Under GDPR and other privacy laws, you have the right to:
            </p>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data</li>
              <li>Restrict processing</li>
              <li>Data portability</li>
              <li>Object to processing</li>
              <li>Withdraw consent</li>
            </ul>
          </div>

          {/* Data Retention */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">7</span>
              </div>
              Data Retention
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Clock className="text-red-600 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-gray-900">Consultation Requests</h4>
                  <p className="text-gray-700">Retained for 2 years or until you request deletion</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="text-red-600 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-gray-900">Website Analytics</h4>
                  <p className="text-gray-700">Anonymized data retained for 26 months</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="text-red-600 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-gray-900">Email Communications</h4>
                  <p className="text-gray-700">Retained until you unsubscribe or request deletion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-red-600 text-white rounded-3xl p-8">
            <h2 className="text-3xl font-black mb-6 flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold text-sm">8</span>
              </div>
              Contact Us About Privacy
            </h2>
            
            <p className="text-red-100 leading-relaxed mb-6">
              If you have questions about this privacy policy or want to exercise your rights, contact us:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="mr-3 flex-shrink-0" size={20} />
                <a href="mailto:support@domivas.com" className="text-white hover:text-red-200 transition-colors font-semibold">
                  support@domivas.com
                </a>
              </div>
              
              <div className="flex items-center">
                <Mail className="mr-3 flex-shrink-0" size={20} />
                <span className="text-red-100">Data Protection Officer: support@domivas.com</span>
              </div>
            </div>
            
            <p className="text-red-100 text-sm mt-6">
              We will respond to your privacy requests within 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;