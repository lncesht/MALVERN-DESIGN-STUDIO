import { supabase } from '../config/supabase';

const BUCKET_NAME = 'artworks';


const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;


        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};


export const uploadImage = async (file, folder = 'artworks') => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    

    const compressedFile = await compressImage(file);
    

    const timestamp = Date.now();
    const fileExt = 'jpg'; 
    const filename = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${filename}`;
    

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, compressedFile, {
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


export const deleteImage = async (imagePath) => {
  try {
    if (!imagePath) return;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([imagePath]);
    
    if (error) {

      if (!error.message?.includes('not found')) {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error deleting image:', error);

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
