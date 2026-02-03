import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const FloatingLogo = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (location.pathname !== '/') {
      return;
    }

    const handleScroll = () => {
      // Show logo when scrolled down more than 80% of viewport height
      const scrollThreshold = window.innerHeight * 0.8;
      
      if (window.scrollY > scrollThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  if (location.pathname !== '/') {
    return null;
  }

  return (
    <div 
      className={`fixed right-4 bottom-4 md:right-8 md:bottom-8 z-40 transition-opacity duration-500 ease-in-out hover:opacity-100 ${
        isVisible ? 'opacity-50' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-transparent rounded-2xl p-2">
        <img 
          src={`${process.env.PUBLIC_URL}/img/price_logo.png`}
          alt="Price Signature Logo" 
          className="w-32 h-32 md:w-52 md:h-52 object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default FloatingLogo;
