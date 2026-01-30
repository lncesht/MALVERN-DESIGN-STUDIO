import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import Header from '../components/Header';
import { getAllExhibits } from '../services/exhibitService';
import { getExhibitionDate, getTimelineEvents } from '../services/timelineService';

const Exhibits = () => {
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExhibit, setSelectedExhibit] = useState(null);
  const [exhibitionDate, setExhibitionDate] = useState('9 January 2026');
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadData = async () => {
      try {
        const [exhibitsData, date, events] = await Promise.all([
          getAllExhibits(),
          getExhibitionDate(),
          getTimelineEvents()
        ]);
        
        setExhibits(exhibitsData);
        setExhibitionDate(date);
        setTimelineEvents(events);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const openFullscreen = (exhibit) => {
    setSelectedExhibit(exhibit);
  };

  const closeFullscreen = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedExhibit(null);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 flex flex-col">
        <Header />
        <main className="flex-1 container-custom py-20">
          <br></br><br></br>
          <div className="max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="text-center mb-12">
              <div className="h-12 bg-brown-200 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-brown-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      <Header />

      <main className="flex-1 container-custom py-20">
        <br></br><br></br>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brown-900 mb-4">
            Farewell to Arabia Memories and Conversations
            </h1>
            <p className="font-bold text-brown-600 text-lg">
            </p>
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

          {/* Mobile Timeline - Shows below header on smaller screens */}
          <div className="lg:hidden mb-12">
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

          {/* Exhibits Grid */}
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {exhibits.map((exhibit) => (
              <div
                key={exhibit.id}
                className="mb-4 break-inside-avoid cursor-pointer group"
                onClick={() => openFullscreen(exhibit)}
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={exhibit.image_url || exhibit.imageUrl}
                    alt={`Exhibit ${exhibit.id}`}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            ))}
          </Masonry>

          {/* Fullscreen Modal with Pop Animation */}
          {selectedExhibit && (
            <div 
              className={`fixed inset-0 bg-black flex items-center justify-center z-50 p-4 sm:p-6 md:p-8 transition-all duration-300 ${
                isClosing ? 'bg-opacity-0' : 'bg-opacity-90'
              }`}
              onClick={closeFullscreen}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Close Button - Animated */}
                <button
                  onClick={closeFullscreen}
                  className={`absolute top-2 right-2 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-10 transition-all duration-300 ${
                    isClosing ? 'scale-0 rotate-90' : 'scale-100 rotate-0'
                  }`}
                  aria-label="Close"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Image with Pop Animation - Smaller size with padding */}
                <img
                  src={selectedExhibit.image_url || selectedExhibit.imageUrl}
                  alt={selectedExhibit.title || 'Exhibit'}
                  className={`max-w-[90%] max-h-[90%] sm:max-w-[85%] sm:max-h-[85%] md:max-w-[80%] md:max-h-[80%] object-contain transition-all duration-300 ${
                    isClosing 
                      ? 'scale-90 opacity-0' 
                      : 'scale-100 opacity-100 animate-popup'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Exhibits;
