import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import ErrorModal from '../components/admin/ErrorModal';
import { getAllExhibits, deleteExhibit } from '../services/exhibitService';

const ExhibitsAdmin = () => {
  const navigate = useNavigate();
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadExhibits();
  }, []);

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

  const handleDelete = async (id) => {
    try {
      await deleteExhibit(id);
      setExhibits(exhibits.filter(ex => ex.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting exhibit:', error);
      setErrorMessage('Failed to delete moment. Please try again.');
      setShowError(true);
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-10 bg-brown-200 rounded-lg w-64 animate-pulse"></div>
            <div className="h-12 bg-brown-200 rounded-lg w-40 animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-brown-100 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-brown-100 rounded-lg p-3 w-12 h-12 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-8 bg-brown-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-brown-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-brown-100 overflow-hidden">
                <div className="aspect-square bg-brown-100 animate-pulse"></div>
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
            <h1 className="text-3xl font-display font-bold text-brown-900">Manage Moments</h1>
          </div>
          <button
            onClick={() => navigate('/admin/exhibits/add')}
            className="flex items-center gap-2 px-6 py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Moment
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-brown-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-brown-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-brown-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-brown-900">{exhibits.length}</p>
              <p className="text-sm text-brown-600">Total Moments</p>
            </div>
          </div>
        </div>

        {/* Exhibits Grid */}
        {exhibits.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-brown-100 p-12 text-center">
            <svg className="w-16 h-16 text-brown-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-brown-900 mb-2">No moments yet</h3>
            <p className="text-brown-600 mb-4">Get started by adding your first moment image</p>
            <button
              onClick={() => navigate('/admin/exhibits/add')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add First Moment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {exhibits.map((exhibit) => (
              <div
                key={exhibit.id}
                className="bg-white rounded-xl shadow-sm border border-brown-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="aspect-square relative group">
                  <img
                    src={exhibit.imageUrl || exhibit.image_url}
                    alt={exhibit.title || `Exhibit ${exhibit.id}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => navigate(`/admin/exhibits/edit/${exhibit.id}`)}
                      className="p-2 bg-white text-brown-600 rounded-lg hover:bg-brown-50 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(exhibit.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-brown-900 mb-4">Delete Moment?</h3>
              <p className="text-brown-600 mb-6">
                Are you sure you want to delete this moment? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-brown-300 text-brown-700 rounded-lg hover:bg-brown-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        <ErrorModal
          isOpen={showError}
          onClose={() => setShowError(false)}
          message={errorMessage}
        />
      </div>
    </AdminLayout>
  );
};

export default ExhibitsAdmin;
