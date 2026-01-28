import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import ArtworkFormSimple from '../components/admin/ArtworkFormSimple';
import { getArtworkById } from '../services/artworkService';
import toast from 'react-hot-toast';

const EditArtwork = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const data = await getArtworkById(id);
        setArtwork(data);
      } catch (error) {
        console.error('Error fetching artwork:', error);
        toast.error('Failed to load artwork');
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto"></div>
            <p className="mt-4 text-brown-600">Loading artwork...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!artwork) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-brown-900">Artwork not found</h2>
          <p className="text-brown-600 mt-2">The artwork you're looking for doesn't exist.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto px-4 lg:px-8 xl:px-12">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-brown-900">Edit Artwork</h1>
          <p className="text-brown-600 mt-1">Update the details of "{artwork.title}"</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 lg:p-10 xl:p-12">
          <ArtworkFormSimple artwork={artwork} isEdit={true} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditArtwork;
