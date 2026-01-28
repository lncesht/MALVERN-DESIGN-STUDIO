import React, { useState, useEffect } from 'react';

const TimelineEventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    time: '',
    title: '',
    description: '',
    order: 0
  });
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      const data = {
        time: event.time || '',
        title: event.title || '',
        description: event.description || '',
        order: event.order || 0
      };
      setFormData(data);
      setOriginalData(data);
    } else {
      setOriginalData(null);
    }
  }, [event]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.time)) {
      newErrors.time = 'Time must be in HH:MM format (e.g., 14:00)';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Check if form has been modified
  const hasChanges = () => {
    if (!originalData) return true; // For new events, always allow submission
    
    return (
      formData.time !== originalData.time ||
      formData.title !== originalData.title ||
      formData.description !== originalData.description ||
      formData.order !== originalData.order
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Time */}
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-brown-900 mb-2">
          Time *
        </label>
        <input
          type="text"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          placeholder="14:00"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent ${
            errors.time ? 'border-red-500' : 'border-brown-300'
          }`}
        />
        {errors.time && (
          <p className="mt-1 text-sm text-red-600">{errors.time}</p>
        )}
        <p className="mt-1 text-xs text-brown-600">Format: HH:MM (e.g., 14:00, 16:30)</p>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-brown-900 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Exhibition Opens"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-brown-300'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-brown-900 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Welcome to the exhibition"
          rows="3"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-brown-300'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Order */}
      <div>
        <label htmlFor="order" className="block text-sm font-medium text-brown-900 mb-2">
          Display Order
        </label>
        <input
          type="number"
          id="order"
          name="order"
          value={formData.order}
          onChange={handleChange}
          min="0"
          className="w-full px-4 py-2 border border-brown-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-brown-600">Lower numbers appear first (0, 1, 2, 3...)</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || (event && !hasChanges())}
          className="flex-1 bg-brown-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brown-700 hover:scale-105 transition-all duration-200 disabled:bg-brown-400 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? 'Saving...' : event ? 'Update Event' : 'Add Event'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 bg-brown-100 text-brown-700 px-6 py-3 rounded-lg font-medium hover:bg-brown-200 hover:scale-105 transition-all duration-200 disabled:bg-brown-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TimelineEventForm;
