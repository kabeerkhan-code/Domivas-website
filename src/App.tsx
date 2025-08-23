import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import PrivacyPage from './pages/PrivacyPage';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';

function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'privacy'>('main');

  if (currentPage === 'privacy') {
    return <PrivacyPage onBack={() => setCurrentPage('main')} />;
  }

  return (
    <div className="min-h-screen">
      <Navigation onPrivacyClick={() => setCurrentPage('privacy')} />
      <Hero />
      <Services />
      <About />
      <Contact />
      <Footer onPrivacyClick={() => setCurrentPage('privacy')} />
      <CookieConsent />
    </div>
  );
}

export default App;
