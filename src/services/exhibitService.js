import { supabase } from '../config/supabase';

// Compress image before upload for better performance
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

        // Calculate new dimensions while maintaining aspect ratio
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

// Get all exhibit images from Supabase
export const getAllExhibits = async () => {
  try {
    const { data, error } = await supabase
      .from('exhibits')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error getting exhibits:', error);
    throw error;
  }
};

// Get single exhibit by ID
export const getExhibitById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('exhibits')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error getting exhibit:', error);
    throw error;
  }
};

// Upload exhibit image to Supabase storage with compression
export const uploadExhibitImage = async (file) => {
  try {
    // Compress image before upload for better performance
    const compressedFile = await compressImage(file);
    
    const fileExt = 'jpg'; // Always use jpg after compression
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase storage with cache control
    const { error: uploadError } = await supabase.storage
      .from('moments')
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('moments')
      .getPublicUrl(filePath);

    return { filePath, publicUrl };
  } catch (error) {
    console.error('Error uploading exhibit image:', error);
    throw error;
  }
};

// Create new exhibit
export const createExhibit = async (exhibitData) => {
  try {
    const { data, error } = await supabase
      .from('exhibits')
      .insert([exhibitData])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating exhibit:', error);
    throw error;
  }
};

// Update exhibit
export const updateExhibit = async (id, exhibitData) => {
  try {
    const { data, error } = await supabase
      .from('exhibits')
      .update(exhibitData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error updating exhibit:', error);
    throw error;
  }
};

// Delete exhibit
export const deleteExhibit = async (id) => {
  try {
    // Get exhibit to find image path
    const exhibit = await getExhibitById(id);

    // Delete from storage if image exists
    if (exhibit.image_path) {
      const { error: storageError } = await supabase.storage
        .from('moments')
        .remove([exhibit.image_path]);

      if (storageError) console.error('Error deleting image from storage:', storageError);
    }

    // Delete from database
    const { error } = await supabase
      .from('exhibits')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting exhibit:', error);
    throw error;
  }
};

// Update exhibit order
export const updateExhibitOrder = async (exhibits) => {
  try {
    const updates = exhibits.map((exhibit, index) => ({
      id: exhibit.id,
      order_index: index
    }));

    const { error } = await supabase
      .from('exhibits')
      .upsert(updates);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error updating exhibit order:', error);
    throw error;
  }
};
