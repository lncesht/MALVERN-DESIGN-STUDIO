import React from 'react';

const Hero = () => {
  const scrollToGallery = () => {
    const element = document.getElementById('gallery');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-warm-100 via-warm-50 to-primary-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b7355' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container-custom relative z-10 text-center px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {/* Centered Logo */}
          <div className="flex justify-center mb-8 sm:mb-10 md:mb-0">
            <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] flex items-center justify-center">
              <img 
                src="/img/price_logo.png"
                alt="Malvern Design Studio Logo" 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Main Heading - Single Line */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-brown-900 mb-8 sm:mb-10 md:mb-12 leading-tight px-2 whitespace-nowrap" style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.1em' }}>
            Malvern Design Studio
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 mb-12 sm:mb-16 md:mb-20">
            <button
              onClick={scrollToGallery}
              className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Explore Gallery
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:flex sm:justify-center gap-12 sm:gap-16 md:gap-20 lg:gap-24 px-4">
            <div className="text-center group">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-brown-700 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200">
                50+
              </div>
              <div className="text-brown-600 text-sm sm:text-base md:text-lg">Artworks</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-brown-700 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200">
                5+
              </div>
              <div className="text-brown-600 text-sm sm:text-base md:text-lg">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
