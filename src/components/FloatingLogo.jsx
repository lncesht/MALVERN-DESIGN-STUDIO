import React from 'react';
import { useLocation } from 'react-router-dom';

const FloatingLogo = () => {
  const location = useLocation();
  
  // Only show on the home page
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <div className="fixed right-8 top-24 z-40 hidden lg:block">
      <div className="bg-transparent rounded-2xl p-2">
        <img 
          src="/img/price_logo.png" 
          alt="Price Signature Logo" 
          className="w-52 h-52 object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default FloatingLogo;
