import React, { useState } from 'react';
import ArtworkItem from './ArtworkItem';

const ArtworkList = ({ artworks, onArtworkDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');


  const categories = ['All', ...new Set(artworks.map(art => art.category))];


  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || artwork.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });


  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (a.artworkNumber && b.artworkNumber) {
      return a.artworkNumber - b.artworkNumber;
    }
    if (a.artworkNumber) return -1;
    if (b.artworkNumber) return 1;
    return 0;
  });

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-brown-600">
        Showing {filteredArtworks.length} of {artworks.length} artworks
      </div>

      {/* Artworks Grid */}
      {sortedArtworks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedArtworks.map(artwork => (
            <ArtworkItem
              key={artwork.id}
              artwork={artwork}
              onDelete={onArtworkDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-brown-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-brown-900">No artworks found</h3>
          <p className="mt-1 text-sm text-brown-500">
            {searchTerm || categoryFilter !== 'All'
              ? 'Try adjusting your search or filter'
              : 'Get started by adding your first artwork'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArtworkList;
