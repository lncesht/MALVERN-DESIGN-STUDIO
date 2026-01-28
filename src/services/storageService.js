import { supabase } from '../config/supabase';

const BUCKET_NAME = 'artworks';

// Upload image to Supabase Storage
export const uploadImage = async (file, folder = 'artworks') => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Create a unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const filename = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${filename}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    
    return {
      url: publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Delete image from Supabase Storage
export const deleteImage = async (imagePath) => {
  try {
    if (!imagePath) return;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([imagePath]);
    
    if (error) {
      // Don't throw error if image doesn't exist
      if (!error.message?.includes('not found')) {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error if image doesn't exist
    if (!error.message?.includes('not found')) {
      throw error;
    }
  }
};

// Validate image file
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 25 * 1024 * 1024; // 25MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 25MB.');
  }
  
  return true;
};
