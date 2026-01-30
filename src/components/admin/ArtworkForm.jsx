import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import { addArtwork, updateArtwork } from '../../services/artworkService';
import { uploadImage, deleteImage } from '../../services/storageService';
import toast from 'react-hot-toast';

const categories = ['Abstract', 'Contemporary', 'Nature', 'Portrait', 'Landscape', 'Still Life', 'Other'];

const ArtworkForm = ({ artwork = null, isEdit = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    year: new Date().getFullYear(),
    medium: '',
    dimensions: '',
    description: '',
    category: 'Abstract',
    imageUrl: '',
    imagePath: '',
    featured: false,
  });


  useEffect(() => {
    if (artwork) {
      setFormData({
        title: artwork.title || '',
        artist: artwork.artist || '',
        year: artwork.year || new Date().getFullYear(),
        medium: artwork.medium || '',
        dimensions: artwork.dimensions || '',
        description: artwork.description || '',
        category: artwork.category || 'Abstract',
        imageUrl: artwork.imageUrl || artwork.image || '',
        imagePath: artwork.imagePath || '',
        featured: artwork.featured || false,
      });
    }
  }, [artwork]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageSelect = (file) => {
    setImageFile(file);
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

    try {
      let imageUrl = formData.imageUrl;
      let imagePath = formData.imagePath;

      
      if (imageFile) {

        if (isEdit && formData.imagePath) {
          await deleteImage(formData.imagePath);
        }

        // Upload new image
        const uploadResult = await uploadImage(imageFile);
        imageUrl = uploadResult.url;
        imagePath = uploadResult.path;
      }

      const artworkData = {
        title: formData.title.trim(),
        artist: formData.artist.trim(),
        year: parseInt(formData.year),
        medium: formData.medium.trim(),
        dimensions: formData.dimensions.trim(),
        description: formData.description.trim(),
        category: formData.category,
        imageUrl: imageUrl,
        imagePath: imagePath,
        featured: formData.featured,
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
      toast.error('Failed to save artwork. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <ImageUpload
        onImageSelect={handleImageSelect}
        currentImage={formData.imageUrl}
        label="Artwork Image"
      />

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
          placeholder="e.g., Ethereal Dreams"
          required
        />
      </div>

      {/* Artist */}
      <div>
        <label htmlFor="artist" className="block text-sm font-medium text-brown-700 mb-2">
          Artist <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="artist"
          name="artist"
          value={formData.artist}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
          placeholder="e.g., Pablo Picasso"
          required
        />
      </div>

      {/* Year and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          placeholder="Describe the artwork..."
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
          disabled={loading}
          className="flex-1 bg-brown-600 text-white py-3 rounded-lg font-medium hover:bg-brown-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEdit ? 'Updating...' : 'Adding...'}
            </span>
          ) : (
            isEdit ? 'Update Artwork' : 'Add Artwork'
          )}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/artworks')}
          disabled={loading}
          className="flex-1 bg-brown-100 text-brown-700 py-3 rounded-lg font-medium hover:bg-brown-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ArtworkForm;
