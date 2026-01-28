import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import ArtworkFormSimple from '../components/admin/ArtworkFormSimple';

const AddArtwork = () => {
  return (
    <AdminLayout>
      <div className="mx-auto px-4 lg:px-8 xl:px-12">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-brown-900">Add New Artwork</h1>
          <p className="text-brown-600 mt-1">Fill in the details to add a new artwork to your collection</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 lg:p-10 xl:p-12">
          <ArtworkFormSimple />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddArtwork;
