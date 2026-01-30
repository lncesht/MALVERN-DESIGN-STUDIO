import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== '/') {
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
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="flex items-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h1 className="text-xl lg:text-2xl font-normal tracking-wide text-brown-900" style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.15em' }}>
              <span style={{ fontSize: '1.15em' }}>M</span>
              <span style={{ fontSize: '0.75em' }}>alvern</span>
              <span> </span>
              <span style={{ fontSize: '1.15em' }}>D</span>
              <span style={{ fontSize: '0.75em' }}>esign</span>
              <span> </span>
              <span style={{ fontSize: '1.15em' }}>S</span>
              <span style={{ fontSize: '0.75em' }}>tudio</span>
            </h1>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => scrollToSection('hero')}
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
            <button
              onClick={() => handleNavigation('/exhibits')}
              className="text-brown-700 hover:text-brown-900 transition-colors font-medium text-lg lg:text-xl relative group"
            >
              9th of Jan 2026
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brown-900 group-hover:w-full transition-all duration-300"></span>
            </button>
          </nav>

          {/* Contact Button */}
          <button
            onClick={() => scrollToSection('contact')}
            className="hidden lg:block px-6 py-2.5 bg-brown-700 text-white rounded-lg font-medium hover:bg-brown-800 transition-colors"
          >
            Contact
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-brown-700 hover:text-brown-900 hover:bg-brown-50 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-brown-100 bg-white/95 backdrop-blur-sm">
            <nav className="py-4 space-y-2">
              <button
                onClick={() => scrollToSection('hero')}
                className="block w-full text-left px-4 py-2 text-brown-700 hover:text-brown-900 hover:bg-brown-50 transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="block w-full text-left px-4 py-2 text-brown-700 hover:text-brown-900 hover:bg-brown-50 transition-colors font-medium"
              >
                Gallery
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-4 py-2 text-brown-700 hover:text-brown-900 hover:bg-brown-50 transition-colors font-medium"
              >
                About
              </button>
              <button
                onClick={() => handleNavigation('/exhibits')}
                className="block w-full text-left px-4 py-2 text-brown-700 hover:text-brown-900 hover:bg-brown-50 transition-colors font-medium"
              >
                9th of Jan 2026
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-4 py-2 text-brown-700 hover:text-brown-900 hover:bg-brown-50 transition-colors font-medium"
              >
                Contact
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
