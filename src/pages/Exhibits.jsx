import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import Header from '../components/Header';
import { getAllExhibits } from '../services/exhibitService';

const Exhibits = () => {
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExhibit, setSelectedExhibit] = useState(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadExhibits = async () => {
      try {
        const data = await getAllExhibits();
        setExhibits(data);
      } catch (error) {
        console.error('Error loading exhibits:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExhibits();
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
    setSelectedExhibit(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto"></div>
            <p className="mt-4 text-brown-600">Loading exhibits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      <Header />

      <main className="flex-1 container-custom py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brown-900 mb-4">
              Exhibits
            </h1>
            <p className="text-brown-600 text-lg">
              A collection of contemporary art pieces
            </p>
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
                    src={exhibit.imageUrl}
                    alt={`Exhibit ${exhibit.id}`}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </Masonry>

          {/* Fullscreen Modal */}
          {selectedExhibit && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
              <div className="relative max-w-5xl max-h-full">
                <button
                  onClick={closeFullscreen}
                  className="absolute top-4 right-4 text-white hover:text-brown-200 transition-colors z-10"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img
                  src={selectedExhibit.imageUrl}
                  alt={selectedExhibit.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brown-900 text-warm-200">
        <div className="container-custom py-12 sm:py-16">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-warm-300">
              © 2024 Malvern Design Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Exhibits;
