import React from 'react';

const Hero = () => {
  const scrollToGallery = () => {
    const element = document.getElementById('gallery');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-warm-100 via-warm-50 to-primary-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b7355' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container-custom relative z-10 text-center px-4 py-16 sm:py-20 md:py-24">
        <div className="max-w-5xl mx-auto animate-fade-in">
          {/* Badge - Responsive */}
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-200 text-brown-800 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Art Collection
          </div>

          {/* Main Heading - Fully Responsive */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-brown-900 mb-8 sm:mb-10 md:mb-12 leading-tight px-2" style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.15em' }}>
            <span className="block">Malvern Design</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brown-700 to-brown-900 mt-2">
              Studio
            </span>
          </h1>

          {/* CTA Buttons - Responsive sizing */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <button
              onClick={scrollToGallery}
              className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Explore Gallery
            </button>
          </div>

          {/* Stats - Responsive grid */}
          <div className="grid grid-cols-2 sm:flex sm:justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 mt-12 sm:mt-16 md:mt-20 px-4">
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brown-700 mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-200">
                50+
              </div>
              <div className="text-brown-600 text-xs sm:text-sm md:text-base">Artworks</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brown-700 mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-200">
                10+
              </div>
              <div className="text-brown-600 text-xs sm:text-sm md:text-base">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <div className="hidden sm:block absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-brown-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
