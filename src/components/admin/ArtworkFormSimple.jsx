import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addArtwork, updateArtwork } from '../../services/artworkService';
import { uploadImage, deleteImage, validateImageFile } from '../../services/storageService';
import toast from 'react-hot-toast';

const categories = ['Abstract', 'Contemporary', 'Nature', 'Portrait', 'Landscape', 'Still Life', 'Other'];

const ArtworkFormSimple = ({ artwork = null, isEdit = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    artist: 'John Price',
    year: new Date().getFullYear(),
    medium: '',
    dimensions: '',
    price: '',
    description: '',
    category: 'Abstract',
    imageUrl: '',
    imagePath: '',
    featured: false,
    artworkNumber: '',
  });

  // Load existing artwork data if editing
  useEffect(() => {
    if (artwork) {
      const initialData = {
        title: artwork.title || '',
        artist: artwork.artist || 'John Price',
        year: artwork.year || new Date().getFullYear(),
        medium: artwork.medium || '',
        dimensions: artwork.dimensions || '',
        price: artwork.price || '',
        description: artwork.description || '',
        category: artwork.category || 'Abstract',
        imageUrl: artwork.imageUrl || '',
        imagePath: artwork.imagePath || '',
        featured: artwork.featured || false,
        artworkNumber: artwork.artworkNumber || '',
      };
      setFormData(initialData);
      setOriginalData(initialData);
      setImagePreview(artwork.imageUrl || '');
    }
  }, [artwork]);

  // Check for changes when editing
  useEffect(() => {
    if (isEdit && originalData) {
      const dataChanged = 
        formData.title !== originalData.title ||
        formData.artist !== originalData.artist ||
        formData.year !== originalData.year ||
        formData.medium !== originalData.medium ||
        formData.dimensions !== originalData.dimensions ||
        formData.price !== originalData.price ||
        formData.description !== originalData.description ||
        formData.category !== originalData.category ||
        formData.featured !== originalData.featured ||
        formData.artworkNumber !== originalData.artworkNumber ||
        imageFile !== null; // New image selected
      
      setHasChanges(dataChanged);
    }
  }, [formData, imageFile, originalData, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validate file
      validateImageFile(file);
      
      // Set file and create preview
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
    setImagePreview('');
    const fileInput = document.getElementById('imageFile');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!formData.artist.trim()) {
      toast.error('Please enter an artist name');
      return;
    }
    

    if (!isEdit && !imageFile) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    let uploadedImageUrl = formData.imageUrl;
    let uploadedImagePath = formData.imagePath;

    try {

      if (imageFile) {
        setUploading(true);
        const uploadResult = await uploadImage(imageFile);
        uploadedImageUrl = uploadResult.url;
        uploadedImagePath = uploadResult.path;
        

        if (isEdit && formData.imagePath) {
          await deleteImage(formData.imagePath);
        }
        setUploading(false);
      }

      const artworkData = {
        title: formData.title.trim(),
        artist: formData.artist.trim(),
        year: parseInt(formData.year),
        medium: formData.medium.trim(),
        dimensions: formData.dimensions.trim(),
        price: formData.price.trim(),
        description: formData.description.trim(),
        category: formData.category,
        imageUrl: uploadedImageUrl,
        imagePath: uploadedImagePath,
        featured: formData.featured,
        artworkNumber: formData.artworkNumber ? parseInt(formData.artworkNumber) : null,
      };

      if (isEdit) {
        await updateArtwork(artwork.id, artworkData);
        toast.success('Artwork updated successfully!');
      } else {
        await addArtwork(artworkData);
        toast.success('Artwork added successfully!');
      }

      navigate('/admin/artworks');
    } catch (error) {
      console.error('Error saving artwork:', error);
      toast.error(error.message || 'Failed to save artwork. Please try again.');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label htmlFor="imageFile" className="block text-sm font-medium text-brown-700 mb-2">
          Artwork Image {!isEdit && <span className="text-red-500">*</span>}
        </label>
        
        {/* Custom File Input Button */}
        <div className="mt-1">
          <input
            type="file"
            id="imageFile"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            className="hidden"
            disabled={uploading || loading}
          />
          <label
            htmlFor="imageFile"
            className="inline-flex items-center px-6 py-3 bg-brown-600 text-white font-medium rounded-lg hover:bg-brown-700 hover:scale-105 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Choose Image File
          </label>
          <p className="mt-2 text-sm text-brown-500">
            Supported formats: JPG, PNG, WebP, GIF (Max 25MB)
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
                  className="text-sm text-red-600 hover:text-red-700 hover:scale-105 transition-all duration-200 font-medium"
                  disabled={uploading || loading}
                >
                  Remove
                </button>
              )}
            </div>
            <div className="relative w-full max-w-md">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border-2 border-brown-200 shadow-sm"
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

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-brown-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
          required
        />
      </div>

      {/* Artist */}
      <div>
        <label htmlFor="artist" className="block text-sm font-medium text-brown-700 mb-2">
          Artist
        </label>
        <input
          type="text"
          id="artist"
          name="artist"
          value={formData.artist}
          readOnly
          disabled
          className="w-full px-4 py-2 border border-brown-200 rounded-lg bg-brown-50 text-brown-600 cursor-not-allowed"
        />
      </div>

      {/* Year, Category, and Artwork Number */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-brown-700 mb-2">
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="1800"
            max={new Date().getFullYear() + 1}
            className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-brown-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="artworkNumber" className="block text-sm font-medium text-brown-700 mb-2">
            Artwork Number
          </label>
          <input
            type="number"
            id="artworkNumber"
            name="artworkNumber"
            value={formData.artworkNumber}
            onChange={handleChange}
            min="1"
            max="999"
            className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-brown-500">
            Display order (1-15)
          </p>
        </div>
      </div>

      {/* Medium and Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="medium" className="block text-sm font-medium text-brown-700 mb-2">
            Medium
          </label>
          <input
            type="text"
            id="medium"
            name="medium"
            value={formData.medium}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
            placeholder="e.g., Oil on Canvas"
          />
        </div>

        <div>
          <label htmlFor="dimensions" className="block text-sm font-medium text-brown-700 mb-2">
            Dimensions
          </label>
          <input
            type="text"
            id="dimensions"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
            placeholder="e.g., 48 x 36 inches"
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-brown-700 mb-2">
          Price
        </label>
        <input
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
        />
        <p className="mt-1 text-sm text-brown-500">
          Enter the price or text like "Contact for Price", "Sold", "Not for Sale", etc.
        </p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-brown-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="h-4 w-4 text-brown-600 focus:ring-brown-500 border-brown-300 rounded"
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-brown-700">
          Feature this artwork on the homepage
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading || uploading || (isEdit && !hasChanges)}
          className="flex-1 bg-brown-600 text-white py-3 rounded-lg font-medium hover:bg-brown-700 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading || uploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {uploading ? 'Uploading Image...' : isEdit ? 'Updating...' : 'Adding...'}
            </span>
          ) : (
            isEdit ? 'Update Artwork' : 'Add Artwork'
          )}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/artworks')}
          disabled={loading || uploading}
          className="flex-1 bg-brown-100 text-brown-700 py-3 rounded-lg font-medium hover:bg-brown-200 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
        >
          Cancel
        </button>
      </div>

      {/* No Changes Message */}
      {isEdit && !hasChanges && !loading && !uploading && (
        <div className="mt-4 text-center">
          <p className="text-sm text-brown-500">
            No changes detected. Modify any field to enable the update button.
          </p>
        </div>
      )}
    </form>
  );
};

export default ArtworkFormSimple;
