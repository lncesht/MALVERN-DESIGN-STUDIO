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
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto"></div>
            <p className="mt-4 text-brown-600">Loading artworks...</p>
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
