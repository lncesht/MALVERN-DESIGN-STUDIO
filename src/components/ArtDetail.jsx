import React, { useEffect } from 'react';

const ArtDetail = ({ artwork, onClose }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!artwork) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-900/80 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-warm-50 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-warm-50/90 hover:bg-warm-50 rounded-full shadow-lg transition-all hover:scale-110"
        >
          <svg className="w-6 h-6 text-brown-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-0 h-full max-h-[90vh] overflow-y-auto">
          {/* Image Section */}
          <div className="relative bg-warm-200 min-h-[400px] md:min-h-full">
            <img
              src={artwork.imageUrl || artwork.image}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
            {artwork.featured && (
              <div className="absolute top-4 left-4 bg-brown-700 text-warm-50 px-4 py-2 rounded-full text-sm font-medium">
                Featured Artwork
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-8 md:p-12 flex flex-col justify-between bg-warm-50">
            <div>
              {/* Category Badge */}
              <div className="inline-block px-3 py-1 bg-primary-200 text-brown-800 rounded-full text-sm font-medium mb-4">
                {artwork.category}
              </div>

              {/* Title */}
              <h2 className="text-4xl font-display font-bold text-brown-900 mb-4">
                {artwork.title}
              </h2>

              {/* Artist & Year */}
              <div className="flex items-center gap-4 text-brown-700 mb-6 pb-6 border-b border-warm-300">
                <div>
                  <p className="text-sm text-brown-600">Artist</p>
                  <p className="font-medium text-brown-900">{artwork.artist}</p>
                </div>
                <div className="w-px h-10 bg-warm-400"></div>
                <div>
                  <p className="text-sm text-brown-600">Year</p>
                  <p className="font-medium text-brown-900">{artwork.year}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-brown-900 mb-3">About This Piece</h3>
                <p className="text-brown-700 leading-relaxed">
                  {artwork.description}
                </p>
              </div>

              {/* Specifications */}
              <div className={`grid gap-4 mb-8 ${artwork.price ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <div className="bg-warm-100 p-4 rounded-lg">
                  <p className="text-sm text-brown-600 mb-1">Medium</p>
                  <p className="font-medium text-brown-900">{artwork.medium}</p>
                </div>
                <div className="bg-warm-100 p-4 rounded-lg">
                  <p className="text-sm text-brown-600 mb-1">Dimensions</p>
                  <p className="font-medium text-brown-900">{artwork.dimensions}</p>
                </div>
                {artwork.price && (
                  <div className="bg-warm-100 p-4 rounded-lg">
                    <p className="text-sm text-brown-600 mb-1">Price</p>
                    <p className="font-semibold text-brown-900">{artwork.price}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtDetail;
