import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { uploadImage, deleteImage, validateImageFile } from '../services/storageService';
import AdminLayout from '../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const CVSettings = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'cv')
          .single();
        

        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          const url = data.image_url || data.imageUrl || '';
          const path = data.image_path || '';
          setImageUrl(url);
          setImagePath(path);
          setImagePreview(url);
        }

      } catch (error) {
        console.error('Error fetching CV:', error);

        if (error.code !== 'PGRST116') {
          toast.error('Failed to load CV settings');
        }
      } finally {
        setFetching(false);
      }
    };

    fetchCV();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {

      validateImageFile(file);
      

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error(error.message);
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(imageUrl); 
    const fileInput = document.getElementById('cvImageFile');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile && !imageUrl) {
      toast.error('Please select a CV image');
      return;
    }

    setLoading(true);
    let uploadedImageUrl = imageUrl;
    let uploadedImagePath = imagePath;

    try {

      if (imageFile) {
        setUploading(true);
        const uploadResult = await uploadImage(imageFile, 'cv');
        uploadedImageUrl = uploadResult.url;
        uploadedImagePath = uploadResult.path;
        

        if (imagePath) {
          await deleteImage(imagePath);
        }
        setUploading(false);
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upsert CV settings
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'cv',
          image_url: uploadedImageUrl,
          image_path: uploadedImagePath,
          updated_at: new Date().toISOString(),
          user_id: user.id,
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      setImageUrl(uploadedImageUrl);
      setImagePath(uploadedImagePath);
      setImageFile(null);
      toast.success('CV updated successfully!');
    } catch (error) {
      console.error('Error updating CV:', error);
      toast.error(error.message || 'Failed to update CV. Please try again.');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (fetching) {
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
        <div className="mx-auto px-4 lg:px-8 xl:px-12">
          <div className="mb-6">
            <h1 className="text-3xl font-display font-bold text-brown-900">CV/Resume Settings</h1>
            <p className="text-brown-600 mt-1"></p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 lg:p-10 xl:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* CV Image Upload */}
            <div>
              <label htmlFor="cvImageFile" className="block text-sm font-medium text-brown-700 mb-2">
                CV/Resume Image <span className="text-red-500">*</span>
              </label>
              
              {/* Custom File Input Button */}
              <div className="mt-1">
                <input
                  type="file"
                  id="cvImageFile"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={uploading || loading}
                />
                <label
                  htmlFor="cvImageFile"
                  className="inline-flex items-center px-6 py-3 bg-brown-600 text-white font-medium rounded-lg hover:bg-brown-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Choose CV/Resume File
                </label>
                <p className="mt-2 text-sm text-brown-500">
                  Upload your CV as an image (JPG, PNG, WebP, GIF - Max 5MB)
                </p>
                <p className="mt-1 text-sm text-brown-600">
                </p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-brown-700">Preview:</p>
                    {imageFile && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                        disabled={uploading || loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="relative w-full max-w-4xl">
                    <img
                      src={imagePreview}
                      alt="CV Preview"
                      className="w-full h-auto max-h-[600px] object-contain"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="text-center text-white">
                          <svg className="animate-spin h-10 w-10 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-sm font-medium">Uploading...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Current CV Info */}
            {imageUrl && !imageFile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                </p>
                <p className="mt-2 text-sm text-green-700">
                  ✓ Visitors can download as PDF
                </p>
                <a
                  href="/TEST-WEBSITE/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-700 hover:underline mt-2 inline-block font-medium"
                >
                  → View public Resume page
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full bg-brown-600 text-white py-3 rounded-lg font-medium hover:bg-brown-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || uploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {uploading ? 'Uploading...' : 'Saving...'}
                </span>
              ) : (
                'Save CV Image'
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CVSettings;
