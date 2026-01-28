import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import { useArtworks } from '../hooks/useArtworks';

const Admin = () => {
  const navigate = useNavigate();
  const { artworks, loading } = useArtworks();

  const stats = {
    total: artworks.length,
    featured: artworks.filter(art => art.featured).length,
    categories: new Set(artworks.map(art => art.category)).size,
  };

  const recentArtworks = artworks.slice(0, 5);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto"></div>
            <p className="mt-4 text-brown-600">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-brown-900"></h1>
          <p className="text-brown-600 mt-1"></p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl shadow-sm border border-brown-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-brown-500 uppercase tracking-wide mb-1">Total Artworks</p>
                <p className="text-4xl font-bold text-brown-900 mt-2">{stats.total}</p>
                <p className="text-xs text-brown-600 mt-2">All pieces in collection</p>
              </div>
              <div className="bg-gradient-to-br from-brown-500 to-brown-600 rounded-lg p-3 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-brown-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-brown-500 uppercase tracking-wide mb-1">Featured</p>
                <p className="text-4xl font-bold text-brown-900 mt-2">{stats.featured}</p>
                <p className="text-xs text-brown-600 mt-2">Highlighted works</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-3 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-brown-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-brown-500 uppercase tracking-wide mb-1">Categories</p>
                <p className="text-4xl font-bold text-brown-900 mt-2">{stats.categories}</p>
                <p className="text-xs text-brown-600 mt-2">Different styles</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-3 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-brown-100 p-6">
          <h2 className="text-lg font-semibold text-brown-900 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <button
              onClick={() => navigate('/admin/add')}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-brown-600 to-brown-700 text-white rounded-xl hover:from-brown-700 hover:to-brown-800 hover:scale-105 transition-all duration-200 shadow-sm"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">Add Artwork</span>
            </button>

            <button
              onClick={() => navigate('/admin/artworks')}
              className="flex flex-col items-center gap-2 p-4 bg-brown-50 text-brown-700 rounded-xl hover:bg-brown-100 hover:scale-105 transition-all duration-200 border border-brown-200"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="text-sm font-medium">All Works</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex flex-col items-center gap-2 p-4 bg-brown-50 text-brown-700 rounded-xl hover:bg-brown-100 hover:scale-105 transition-all duration-200 border border-brown-200"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-sm font-medium">Gallery</span>
            </button>

            <button
              onClick={() => navigate('/admin/timeline')}
              className="flex flex-col items-center gap-2 p-4 bg-brown-50 text-brown-700 rounded-xl hover:bg-brown-100 hover:scale-105 transition-all duration-200 border border-brown-200"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Timeline</span>
            </button>

            <button
              onClick={() => navigate('/admin/cv')}
              className="flex flex-col items-center gap-2 p-4 bg-brown-50 text-brown-700 rounded-xl hover:bg-brown-100 hover:scale-105 transition-all duration-200 border border-brown-200"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium">Resume</span>
            </button>
          </div>
        </div>

        {/* Recent Artworks */}
        {recentArtworks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-brown-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-brown-900">Recent Artworks</h2>
              <button
                onClick={() => navigate('/admin/artworks')}
                className="text-brown-600 hover:text-brown-800 text-sm font-medium transition-colors flex items-center gap-1"
              >
                View All 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {recentArtworks.map(artwork => (
                <div
                  key={artwork.id}
                  className="flex items-center gap-4 p-3 hover:bg-brown-50 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-brown-200"
                  onClick={() => navigate(`/admin/edit/${artwork.id}`)}
                >
                  <img
                    src={artwork.imageUrl || artwork.image}
                    alt={artwork.title}
                    className="w-14 h-14 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-brown-900 truncate">{artwork.title}</h3>
                    <p className="text-sm text-brown-600">{artwork.artist} • {artwork.year}</p>
                  </div>
                  {artwork.featured && (
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Admin;
