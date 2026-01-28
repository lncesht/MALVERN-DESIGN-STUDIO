import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { getFeaturedArtworks } from '../services/artworkService';

const ArtGallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [isFullscreenClosing, setIsFullscreenClosing] = useState(false);
  const ITEMS_PER_PAGE = 18; // 6 columns x 3 rows

  // Handle modal close with animation
  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setSelectedArtwork(null);
      setIsModalClosing(false);
    }, 300); // Match animation duration
  };

  // Handle fullscreen close with animation
  const handleCloseFullscreen = () => {
    setIsFullscreenClosing(true);
    setTimeout(() => {
      setFullscreenImage(false);
      setIsFullscreenClosing(false);
    }, 300); // Match animation duration
  };

  // Fetch featured artworks only
  useEffect(() => {
    const fetchFeaturedArtworks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFeaturedArtworks();
        setArtworks(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching featured artworks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArtworks();
  }, []);

  // Get unique categories from featured artworks
  const categories = ['All', ...new Set(artworks.map(art => art.category))];

  const filteredArtworks = selectedCategory === 'All'
    ? artworks
    : artworks.filter(art => art.category === selectedCategory);

  // Limit displayed artworks to 18 unless "See More" is clicked
  const displayedArtworks = showAll 
    ? filteredArtworks 
    : filteredArtworks.slice(0, ITEMS_PER_PAGE);
  
  const hasMore = filteredArtworks.length > ITEMS_PER_PAGE;

  // Loading state
  if (loading) {
    return (
      <section id="gallery" className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brown-600 mx-auto"></div>
          <p className="mt-4 text-brown-600 text-lg">Loading artworks...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="gallery" className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-brown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-brown-900">Error loading artworks</h3>
          <p className="mt-1 text-brown-600">{error}</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (artworks.length === 0) {
    return (
      <section id="gallery" className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-brown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-brown-900">No featured artworks yet</h3>
          <p className="mt-1 text-brown-600">Featured artworks will appear here. Check the admin panel to feature artworks.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="min-h-screen relative py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Enhanced Background with Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-warm-50 to-orange-50"></div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-30">
        {/* Large decorative circles */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-brown-300/20 to-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-amber-300/20 to-brown-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-200/10 to-brown-200/10 rounded-full blur-3xl"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-40 left-20 w-32 h-32 border-2 border-brown-300/20 rounded-lg rotate-12"></div>
        <div className="absolute bottom-60 right-32 w-24 h-24 border-2 border-orange-300/20 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-brown-200/10 rotate-45"></div>
      </div>

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle, #78350f 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}></div>

      <div className="container mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 max-w-[1600px] relative z-10">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-brown-900 mb-4">
            Farewell to Arabia Exhibition
            <br />
            9th of January 2026
          </h2>
          <p className="text-lg sm:text-xl text-brown-600 max-w-2xl">
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-brown-700 text-white shadow-lg'
                    : 'bg-white text-brown-700 hover:bg-brown-50 border border-brown-200 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid - Tightly packed, flows left to right */}
        <Masonry
          breakpointCols={{
            default: 6,
            1536: 6,  // 2xl
            1280: 5,  // xl
            1024: 4,  // lg
            768: 3,   // md
            640: 2    // sm
          }}
          className="flex -ml-4 sm:-ml-6 w-auto"
          columnClassName="pl-4 sm:pl-6 bg-clip-padding"
        >
          {displayedArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="group cursor-pointer mb-4 sm:mb-6"
              onClick={() => setSelectedArtwork(artwork)}
            >
              <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] bg-white">
                {/* Artwork Image */}
                <div className="relative">
                  <img
                    src={artwork.imageUrl || artwork.image}
                    alt={artwork.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  
                    
                  {/* Artwork Number Badge - Top Left */}
                  {artwork.artworkNumber && (
                    <div className="absolute top-3 left-3 w-8 h-8 sm:w-10 sm:h-10 bg-brown-700 rounded-full shadow-lg flex items-center justify-center z-10">
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {artwork.artworkNumber}
                      </span>
                    </div>
                  )}
                  
                  {/* Hover Overlay - Title Only */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <h3 className="text-white font-display font-bold text-base sm:text-lg md:text-xl text-center line-clamp-3">
                      {artwork.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Masonry>

        {/* See More / Show Less Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-brown-600 hover:bg-brown-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {showAll ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Show Less
                </>
              ) : (
                <>
                  See More ({filteredArtworks.length - ITEMS_PER_PAGE} more)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Artwork Detail Modal */}
      {selectedArtwork && !fullscreenImage && (
        <div
          className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 transition-opacity duration-300 ${
            isModalClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleCloseModal}
        >
          <div
            className={`bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transition-all duration-300 ${
              isModalClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-popup'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 sm:p-10">
              {/* Close Button - Inside white modal, top-right */}
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 w-10 h-10 sm:w-12 sm:h-12 bg-brown-700 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-brown-800 hover:scale-110 transition-all duration-200 z-10"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Image - Centered and Clickable */}
              <div className="relative flex items-center justify-center">
                <img
                  src={selectedArtwork.imageUrl || selectedArtwork.image}
                  alt={selectedArtwork.title}
                  className="w-full h-auto rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setFullscreenImage(true)}
                />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {selectedArtwork.artworkNumber && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brown-700 rounded-full shadow-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs sm:text-sm">
                          {selectedArtwork.artworkNumber}
                        </span>
                      </div>
                    )}
                    <span className="inline-block px-4 py-1.5 bg-brown-100 text-brown-700 rounded-full text-sm font-medium">
                      {selectedArtwork.category}
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold text-brown-900 mb-3">
                    {selectedArtwork.title}
                  </h2>
                  <p className="text-xl text-brown-600 mb-2">
                    by {selectedArtwork.artist}
                  </p>
                  <p className="text-lg text-brown-500">
                    {selectedArtwork.year}
                  </p>
                </div>

                {/* Description */}
                {selectedArtwork.description && (
                  <div className="bg-warm-50 p-5 rounded-lg">
                    <h3 className="text-sm font-semibold text-brown-600 uppercase tracking-wide mb-2">
                      About this artwork
                    </h3>
                    <p className="text-brown-700 leading-relaxed">
                      {selectedArtwork.description}
                    </p>
                  </div>
                )}

                {/* Specifications */}
                <div className={`grid gap-4 ${selectedArtwork.price ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {selectedArtwork.medium && (
                    <div className="bg-warm-50 p-4 rounded-lg">
                      <p className="text-xs text-brown-500 uppercase tracking-wide mb-1">Medium</p>
                      <p className="font-semibold text-brown-900">{selectedArtwork.medium}</p>
                    </div>
                  )}
                  {selectedArtwork.dimensions && (
                    <div className="bg-warm-50 p-4 rounded-lg">
                      <p className="text-xs text-brown-500 uppercase tracking-wide mb-1">Dimensions</p>
                      <p className="font-semibold text-brown-900">{selectedArtwork.dimensions}</p>
                    </div>
                  )}
                  {selectedArtwork.price && (
                    <div className="bg-warm-50 p-4 rounded-lg">
                      <p className="text-xs text-brown-500 uppercase tracking-wide mb-1">Price</p>
                      <p className="font-semibold text-brown-900">{selectedArtwork.price}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {fullscreenImage && selectedArtwork && (
        <div
          className={`fixed inset-0 bg-black/95 backdrop-blur-sm z-[60] flex items-center justify-center p-8 sm:p-12 md:p-16 transition-opacity duration-300 ${
            isFullscreenClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleCloseFullscreen}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseFullscreen}
            className="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-all duration-200 z-10"
            aria-label="Close fullscreen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Fullscreen Image - Limited to 80% of viewport */}
          <img
            src={selectedArtwork.imageUrl || selectedArtwork.image}
            alt={selectedArtwork.title}
            className={`max-w-[80%] max-h-[80%] object-contain transition-all duration-300 ${
              isFullscreenClosing ? 'scale-90 opacity-0' : 'scale-100 opacity-100 animate-popup'
            }`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default ArtGallery;
