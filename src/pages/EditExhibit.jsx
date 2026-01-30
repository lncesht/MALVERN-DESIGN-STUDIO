import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import SuccessModal from '../components/admin/SuccessModal';
import ErrorModal from '../components/admin/ErrorModal';
import { getExhibitById, updateExhibit, uploadExhibitImage } from '../services/exhibitService';

const EditExhibit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    image: null,
    currentImageUrl: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadExhibit();
  }, [id]);

  const loadExhibit = async () => {
    try {
      const exhibit = await getExhibitById(id);
      setFormData({
        image: null,
        currentImageUrl: exhibit.imageUrl || exhibit.image_url
      });
      setImagePreview(exhibit.imageUrl || exhibit.image_url);
    } catch (error) {
      console.error('Error loading exhibit:', error);
      setErrorMessage('Failed to load moment');
      setShowError(true);
      setTimeout(() => navigate('/admin/exhibits'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let updateData = {};

      // If new image is uploaded
      if (formData.image) {
        const { filePath, publicUrl } = await uploadExhibitImage(formData.image);
        updateData.image_url = publicUrl;
        updateData.image_path = filePath;
        
        await updateExhibit(id, updateData);
        setShowSuccess(true);
      } else {

        setErrorMessage('No changes made. Please upload a new image.');
        setShowError(true);
      }
    } catch (error) {
      console.error('Error updating exhibit:', error);
      setErrorMessage('Failed to update moment. Please try again.');
      setShowError(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/admin/exhibits');
  };

  const handleErrorClose = () => {
    setShowError(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto"></div>
            <p className="mt-4 text-brown-600">Loading exhibit...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/exhibits')}
            className="p-2 hover:bg-brown-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-brown-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-brown-900">Edit Moment</h1>
            <p className="text-brown-600 mt-1">Update moment image</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-brown-100 p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-brown-900 mb-2">
              Replace Moment Image
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative aspect-video bg-brown-50 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(formData.currentImageUrl);
                        setFormData({ ...formData, image: null });
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-brown-300 rounded-lg cursor-pointer hover:border-brown-400 transition-colors bg-brown-50">
                <svg className="w-5 h-5 text-brown-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-brown-600">
                  {formData.image ? 'Change image' : 'Upload new image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/exhibits')}
              className="flex-1 px-6 py-3 border border-brown-300 text-brown-700 rounded-lg hover:bg-brown-50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        message="Moment updated successfully!"
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showError}
        onClose={handleErrorClose}
        message={errorMessage}
      />
    </AdminLayout>
  );
};

export default EditExhibit;
