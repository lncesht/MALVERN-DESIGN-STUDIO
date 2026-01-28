import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import ArtworkList from '../components/admin/ArtworkList';
import { useArtworks } from '../hooks/useArtworks';
import { deleteAllArtworks } from '../services/artworkService';

const Artworks = () => {
  const navigate = useNavigate();
  const { artworks, loading, refetch } = useArtworks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);

  const handleArtworkDelete = () => {
    refetch();
  };

  const handleDeleteAllClick = () => {
    setDeleteStep(1);
    setShowDeleteModal(true);
  };

  const handleModalCancel = () => {
    setShowDeleteModal(false);
    setDeleteStep(1);
  };

  const handleFirstConfirm = () => {
    setDeleteStep(2);
  };

  const handleFinalConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteAllArtworks();
      await refetch();
      setShowDeleteModal(false);
      setDeleteStep(1);
    } catch (error) {
      console.error('Error deleting all artworks:', error);
      alert('Failed to delete all artworks. Please try again.');
    } finally {
      setIsDeleting(false);
    }
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
          <div className="flex gap-3">
            {artworks.length > 0 && (
              <button
                onClick={handleDeleteAllClick}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200 font-medium disabled:bg-red-400 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete All
              </button>
            )}
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
        </div>

        {/* Artworks List */}
        <ArtworkList artworks={artworks} onArtworkDelete={handleArtworkDelete} />

        {/* Delete All Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-warm-50 rounded-lg shadow-2xl max-w-md w-full p-6 border border-brown-200">
              {/* Modal Header */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-brown-900">
                  {deleteStep === 1 ? 'Delete All Artworks?' : 'Final Confirmation'}
                </h3>
              </div>

              {/* Modal Content */}
              <div className="mb-6">
                {deleteStep === 1 ? (
                  <>
                    <p className="text-brown-800 mb-3">
                      Are you sure you want to delete ALL {artworks.length} artworks?
                    </p>
                    <p className="text-red-600 font-medium">
                      This action cannot be undone!
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-brown-800 mb-3">
                      This is your final warning.
                    </p>
                    <p className="text-red-600 font-bold">
                      Delete ALL artworks permanently?
                    </p>
                  </>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                {deleteStep === 1 ? (
                  <>
                    <button
                      onClick={handleFirstConfirm}
                      className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 hover:scale-105 transition-all duration-200"
                    >
                      OK
                    </button>
                    <button
                      onClick={handleModalCancel}
                      className="flex-1 bg-brown-200 text-brown-900 px-4 py-3 rounded-lg font-medium hover:bg-brown-300 hover:scale-105 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFinalConfirm}
                      disabled={isDeleting}
                      className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 hover:scale-105 transition-all duration-200 disabled:bg-red-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isDeleting ? 'Deleting...' : 'Yes, Delete All'}
                    </button>
                    <button
                      onClick={handleModalCancel}
                      disabled={isDeleting}
                      className="flex-1 bg-brown-200 text-brown-900 px-4 py-3 rounded-lg font-medium hover:bg-brown-300 hover:scale-105 transition-all duration-200 disabled:bg-brown-100 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Artworks;
