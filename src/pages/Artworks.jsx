import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import ArtworkList from '../components/admin/ArtworkList';
import { useArtworks } from '../hooks/useArtworks';

const Artworks = () => {
  const navigate = useNavigate();
  const { artworks, loading, refetch } = useArtworks();

  const handleArtworkDelete = () => {
    refetch();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-10 bg-brown-200 rounded-lg w-64 animate-pulse"></div>
              <div className="h-5 bg-brown-200 rounded-lg w-48 animate-pulse"></div>
            </div>
            <div className="h-10 bg-brown-200 rounded-lg w-40 animate-pulse"></div>
          </div>

          {/* List Skeleton */}
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-brown-100 p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-brown-100 rounded-lg animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-brown-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-brown-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-brown-200 rounded w-1/3 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-brown-900">All Artworks</h1>
            <p className="text-brown-600 mt-1">Manage your art collection ({artworks.length} total)</p>
          </div>
          <button
            onClick={() => navigate('/admin/add')}
            className="flex items-center gap-2 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 hover:scale-105 transition-all duration-200 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Artwork
          </button>
        </div>

        {/* Artworks List */}
        <ArtworkList artworks={artworks} onArtworkDelete={handleArtworkDelete} />
      </div>
    </AdminLayout>
  );
};

export default Artworks;
