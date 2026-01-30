import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const [cvData, setCvData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const totalSlides = 4;

  // Auto-play slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CV
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'cv')
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setCvData(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleViewCV = () => {
    navigate('/resume');
  };

  return (
    <section id="about" className="section-padding bg-white relative">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header - Responsive */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="heading-lg text-brown-900 mb-3 sm:mb-4">
              About the Artist
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-brown-600 mx-auto mb-4 sm:mb-6"></div>
          </div>

          {/* About Content - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            {/* Left: Slideshow - Responsive */}
            <div className="relative order-1 md:order-none">
              <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                {/* First slide - John Price portrait */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    currentSlide === 0 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/img/price0.png`}
                    alt="John Price - Artist"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Gallery images */}
                {[1, 3, 4].map((num, index) => (
                  <div
                    key={num}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index + 1 === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/img/price${num}.jpg`}
                      alt={`Gallery artwork ${num}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                {/* Navigation Arrows */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brown-900 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Previous slide"
                >
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brown-900 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Next slide"
                >
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dot Indicators - Positioned at bottom */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {[0, 1, 2, 3].map((index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all duration-300 rounded-full ${
                        index === currentSlide
                          ? 'w-8 h-2 bg-white'
                          : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Text Content - Responsive */}
            <div className="space-y-4 sm:space-y-6 order-2 md:order-none">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-brown-900">
                John Price
              </h3>
              
              <p className="text-sm sm:text-base md:text-lg text-brown-700 leading-relaxed">
                John Price is a multi-disciplinary artist whose practice spans painting, illustration, architecture, narrative and spatial design.
                His work investigates the layered relationship between memory, material and emotional resonance.   
                This exhibition celebrates his 'Farewell to Arabia' after almost 17 years in the Gulf Region; a reflective collection of work spanning the last 6 years, through a blend of abstraction, symbolism, and structural sensitivity.

              </p>

              <p className="text-sm sm:text-base md:text-lg text-brown-700 leading-relaxed">
                The next chapter of this artistic journey will see John return to Saudi Arabia, periodically,
                to further engage with the emerging arts and culture scene exploring more complex and dramatic landscapes set against emerging life experiences.
              </p>

              {/* CV Button - Only show if CV exists - Responsive */}
              {cvData && (cvData.image_url || cvData.imageUrl) && (
                <div className="pt-2 sm:pt-4">
                  <button
                    onClick={handleViewCV}
                    className="inline-flex items-center gap-2 bg-brown-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-brown-700 active:bg-brown-800 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View My CV/Resume
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
