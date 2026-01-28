import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const scrollToSection = (sectionId) => {
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-warm-50/95 backdrop-blur-md shadow-lg">
      <nav className="container-custom py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Responsive sizing */}
          <button 
            onClick={() => scrollToSection('home')}
            className="flex items-center space-x-2 sm:space-x-3 group"
          >
            <span className="text-lg sm:text-xl md:text-2xl font-display font-bold text-brown-900 hidden xs:block">
              TEST WEBSITE 
            </span>
          </button>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => scrollToSection('home')}
              className="text-brown-700 hover:text-brown-900 transition-colors font-medium text-lg lg:text-xl relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brown-900 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-brown-700 hover:text-brown-900 transition-colors font-medium text-lg lg:text-xl relative group"
            >
              Gallery
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brown-900 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-brown-700 hover:text-brown-900 transition-colors font-medium text-lg lg:text-xl relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brown-900 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* Contact Button - Right side */}
          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection('contact')}
              className="btn-primary"
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Button - Touch-friendly */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden touch-target p-2 text-brown-700 hover:text-brown-900 active:bg-warm-200 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Improved animation and touch targets */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-96 opacity-100 mt-4' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-warm-300 space-y-1">
            <button
              onClick={() => scrollToSection('home')}
              className="w-full text-left px-4 py-3 text-brown-700 hover:text-brown-900 hover:bg-warm-200 active:bg-warm-300 transition-colors font-medium rounded-lg touch-target"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="w-full text-left px-4 py-3 text-brown-700 hover:text-brown-900 hover:bg-warm-200 active:bg-warm-300 transition-colors font-medium rounded-lg touch-target"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="w-full text-left px-4 py-3 text-brown-700 hover:text-brown-900 hover:bg-warm-200 active:bg-warm-300 transition-colors font-medium rounded-lg touch-target"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full btn-primary mt-2"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
