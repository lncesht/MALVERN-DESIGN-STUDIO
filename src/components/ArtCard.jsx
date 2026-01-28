import React from 'react';

const ArtCard = ({ artwork, onClick }) => {
  return (
    <div
      onClick={() => onClick(artwork)}
      className="card overflow-hidden cursor-pointer group animate-fade-in"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
        <img
          src={artwork.imageUrl || artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h4 className="text-sm sm:text-base md:text-lg font-display font-semibold mb-2 line-clamp-2">{artwork.title}</h4>
            <p className="text-xs sm:text-sm font-medium mb-1 opacity-90">{artwork.category}</p>
            <p className="text-[10px] sm:text-xs opacity-80">{artwork.medium}</p>
          </div>
        </div>

        {/* Featured Badge */}
        {artwork.featured && (
          <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-4 md:p-6">
        <h3 className="text-base sm:text-lg md:text-xl font-display font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {artwork.title}
        </h3>
        
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
          <span className="truncate mr-2">{artwork.artist}</span>
          <span className="flex-shrink-0">{artwork.year}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base md:text-lg font-semibold text-primary-600">
            {artwork.price}
          </span>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-xs sm:text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">View</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtCard;
