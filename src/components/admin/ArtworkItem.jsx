import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteArtwork } from '../../services/artworkService';
import { deleteImage } from '../../services/storageService';
import toast from 'react-hot-toast';

const ArtworkItem = ({ artwork, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {

      if (artwork.imagePath) {
        await deleteImage(artwork.imagePath);
      }
      

      await deleteArtwork(artwork.id);
      
      toast.success('Artwork deleted successfully');
      setShowDeleteModal(false);
      onDelete(artwork.id);
    } catch (error) {
      console.error('Error deleting artwork:', error);
      toast.error('Failed to delete artwork');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative h-48 bg-brown-100">
          <img
            src={artwork.imageUrl || artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {/* Artwork Number Badge */}
          {artwork.artworkNumber && (
            <div className="absolute top-2 left-2 w-10 h-10 bg-brown-700 rounded-full shadow-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {artwork.artworkNumber}
              </span>
            </div>
          )}
          {artwork.featured && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
               Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-brown-900 mb-1">
            {artwork.title}
          </h3>
          <p className="text-sm text-brown-600 mb-2">
            {artwork.artist} • {artwork.year}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block px-2 py-1 bg-brown-100 text-brown-700 text-xs rounded">
              {artwork.category}
            </span>
            {artwork.medium && (
              <span className="text-xs text-brown-500">
                {artwork.medium}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/edit/${artwork.id}`)}
              className="flex-1 px-3 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 hover:scale-105 transition-all duration-200 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-brown-900 mb-2">
              Delete Artwork?
            </h3>
            <p className="text-brown-600 mb-6">
              Are you sure you want to delete "{artwork.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:hover:scale-100"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-brown-100 text-brown-700 rounded-lg hover:bg-brown-200 hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:hover:scale-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtworkItem;
