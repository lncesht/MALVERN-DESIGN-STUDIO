import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import { getExhibitionDate, getTimelineEvents } from '../services/timelineService';

const About = () => {
  const [cvData, setCvData] = useState(null);
  const [exhibitionDate, setExhibitionDate] = useState('9 January 2026');
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const totalSlides = 5;

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

        // Fetch timeline data
        const [date, events] = await Promise.all([
          getExhibitionDate(),
          getTimelineEvents()
        ]);
        
        setExhibitionDate(date);
        setTimelineEvents(events);
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

          {/* Floating Timeline - Top Right */}
          <div className="hidden lg:block fixed right-8 top-24 z-10 w-80">
            {/* Toggle Button */}
            {!isTimelineVisible && (
              <button
                onClick={() => setIsTimelineVisible(true)}
                className="w-full bg-transparent hover:bg-brown-600/10 text-brown-700 hover:text-brown-900 px-4 py-3 rounded-2xl border-2 border-brown-600 font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Show Timeline
              </button>
            )}

            {/* Timeline Content */}
            {isTimelineVisible && (
              <div className="bg-white/40 hover:bg-warm-50/95 rounded-2xl p-6 shadow-xl border border-brown-200/30 hover:border-brown-300/50 transition-all duration-500 hover:shadow-2xl">
                {/* Hide Button */}
                <button
                  onClick={() => setIsTimelineVisible(false)}
                  className="absolute top-4 right-4 text-brown-600 hover:text-brown-900 hover:bg-brown-100 p-1.5 rounded-lg transition-all duration-200"
                  title="Hide Timeline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              {/* Timeline Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-display font-bold text-brown-900 mb-3">
                  Exhibition Timeline
                </h3>
                <div className="inline-flex items-center gap-2 bg-brown-700/90 hover:bg-brown-700 text-warm-50 px-3 py-1.5 rounded-full text-xs font-medium shadow-md transition-all duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {exhibitionDate}
                </div>
              </div>

              {/* Timeline Events - Compact */}
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <React.Fragment key={event.id}>
                    <div className="flex gap-3 items-start group">
                      <div className="flex-shrink-0 w-14 text-right">
                        <span className="text-base font-bold text-brown-800 group-hover:text-brown-900 transition-colors">
                          {event.time}
                        </span>
                      </div>
                      <div className="flex-shrink-0 pt-1">
                        <div className="w-2.5 h-2.5 bg-brown-600 rounded-full group-hover:scale-125 group-hover:bg-brown-700 transition-all duration-300 shadow-sm"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-brown-900">
                          {event.title}
                        </h4>
                        <p className="text-xs text-brown-700">
                          {event.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Connecting Line - Don't show after last event */}
                    {index < timelineEvents.length - 1 && (
                      <div className="flex gap-3">
                        <div className="w-14"></div>
                        <div className="flex-shrink-0 w-2.5 flex justify-center">
                          <div className="w-0.5 h-6 bg-brown-400/50"></div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              </div>
            )}
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
                
                {/* Gallery images - reordered so price1.jpg is last */}
                {[2, 3, 4, 1].map((num, index) => (
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
                  {[0, 1, 2, 3, 4].map((index) => (
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
                This exhibition celebrates his ‘Farewell to Arabia’ after almost 17 years in the Gulf Region; a reflective collection of work spanning the last 6 years, through a blend of abstraction, symbolism, and structural sensitivity.

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

              {/* Stats - Responsive */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-brown-200">
                <div className="text-center group">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-brown-700 group-hover:scale-110 transition-transform duration-200">10+</div>
                  <div className="text-xs sm:text-sm text-brown-600">Years</div>
                </div>
                <div className="text-center group">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-brown-700 group-hover:scale-110 transition-transform duration-200">50+</div>
                  <div className="text-xs sm:text-sm text-brown-600">Artworks</div>
                </div>
                <div className="text-center group">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-brown-700 group-hover:scale-110 transition-transform duration-200">15+</div>
                  <div className="text-xs sm:text-sm text-brown-600">Exhibitions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Timeline - Shows below content on smaller screens */}
          <div className="lg:hidden mt-16 sm:mt-20">
            <div className="bg-white/40 hover:bg-warm-50/95 rounded-2xl p-6 sm:p-8 shadow-xl border border-brown-200/30 hover:border-brown-300/50 transition-all duration-500">
              {/* Timeline Header */}
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-brown-900 mb-3">
                  Exhibition Timeline
                </h3>
                <div className="inline-flex items-center gap-2 bg-brown-700/90 hover:bg-brown-700 text-warm-50 px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {exhibitionDate}
                </div>
              </div>

              {/* Timeline Events */}
              <div className="space-y-4 sm:space-y-5">
                {timelineEvents.map((event, index) => (
                  <React.Fragment key={event.id}>
                    <div className="flex gap-3 sm:gap-4 items-start group">
                      <div className="flex-shrink-0 w-16 sm:w-20 text-right">
                        <span className="text-lg sm:text-xl font-bold text-brown-800 group-hover:text-brown-900 transition-colors">
                          {event.time}
                        </span>
                      </div>
                      <div className="flex-shrink-0 pt-1.5">
                        <div className="w-3 h-3 bg-brown-600 rounded-full group-hover:scale-125 transition-all duration-300"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-brown-900 mb-1">
                          {event.title}
                        </h4>
                        <p className="text-sm text-brown-700">{event.description}</p>
                      </div>
                    </div>

                    {/* Connecting Line - Don't show after last event */}
                    {index < timelineEvents.length - 1 && (
                      <div className="flex gap-3 sm:gap-4">
                        <div className="w-16 sm:w-20"></div>
                        <div className="flex-shrink-0 w-3 flex justify-center">
                          <div className="w-0.5 h-6 bg-brown-400/50"></div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
