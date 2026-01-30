import { supabase } from '../config/supabase';

const TABLE_NAME = 'artworks';

// Get all artworks
export const getAllArtworks = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    

    const artworks = data.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      year: artwork.year,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      description: artwork.description,
      category: artwork.category,
      price: artwork.price,
      imageUrl: artwork.image_url,
      imagePath: artwork.image_path,
      featured: artwork.featured,
      artworkNumber: artwork.artwork_number,
      createdAt: artwork.created_at,
      updatedAt: artwork.updated_at,
      userId: artwork.user_id,
    }));
    
    return artworks;
  } catch (error) {
    console.error('Error getting artworks:', error);
    throw error;
  }
};


export const getArtworkById = async (id) => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Artwork not found');
    

    return {
      id: data.id,
      title: data.title,
      artist: data.artist,
      year: data.year,
      medium: data.medium,
      dimensions: data.dimensions,
      description: data.description,
      category: data.category,
      price: data.price,
      imageUrl: data.image_url,
      imagePath: data.image_path,
      featured: data.featured,
      artworkNumber: data.artwork_number,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('Error getting artwork:', error);
    throw error;
  }
};

// Add new artwork
export const addArtwork = async (artworkData) => {
  try {

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const dbData = {
      title: artworkData.title,
      artist: artworkData.artist,
      year: artworkData.year,
      medium: artworkData.medium,
      dimensions: artworkData.dimensions,
      description: artworkData.description,
      category: artworkData.category,
      price: artworkData.price,
      image_url: artworkData.imageUrl,
      image_path: artworkData.imagePath,
      featured: artworkData.featured || false,
      artwork_number: artworkData.artworkNumber || null,
      user_id: user.id,
    };
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([dbData])
      .select()
      .single();
    
    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Error adding artwork:', error);
    throw error;
  }
};

// Update artwork
export const updateArtwork = async (id, artworkData) => {
  try {

    const dbData = {};
    if (artworkData.title !== undefined) dbData.title = artworkData.title;
    if (artworkData.artist !== undefined) dbData.artist = artworkData.artist;
    if (artworkData.year !== undefined) dbData.year = artworkData.year;
    if (artworkData.medium !== undefined) dbData.medium = artworkData.medium;
    if (artworkData.dimensions !== undefined) dbData.dimensions = artworkData.dimensions;
    if (artworkData.description !== undefined) dbData.description = artworkData.description;
    if (artworkData.category !== undefined) dbData.category = artworkData.category;
    if (artworkData.price !== undefined) dbData.price = artworkData.price;
    if (artworkData.imageUrl !== undefined) dbData.image_url = artworkData.imageUrl;
    if (artworkData.imagePath !== undefined) dbData.image_path = artworkData.imagePath;
    if (artworkData.featured !== undefined) dbData.featured = artworkData.featured;
    if (artworkData.artworkNumber !== undefined) dbData.artwork_number = artworkData.artworkNumber;
    
    const { error } = await supabase
      .from(TABLE_NAME)
      .update(dbData)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating artwork:', error);
    throw error;
  }
};

// Delete artwork
export const deleteArtwork = async (id) => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting artwork:', error);
    throw error;
  }
};

// Delete all artworks
export const deleteAllArtworks = async () => {
  try {

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Delete all artworks for the current user
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('user_id', user.id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting all artworks:', error);
    throw error;
  }
};

// Get featured artworks
export const getFeaturedArtworks = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('featured', true)
      .order('artwork_number', { ascending: true, nullsLast: true })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const artworks = data.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      year: artwork.year,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      description: artwork.description,
      category: artwork.category,
      price: artwork.price,
      imageUrl: artwork.image_url,
      imagePath: artwork.image_path,
      featured: artwork.featured,
      artworkNumber: artwork.artwork_number,
      createdAt: artwork.created_at,
      updatedAt: artwork.updated_at,
      userId: artwork.user_id,
    }));
    
    return artworks;
  } catch (error) {
    console.error('Error getting featured artworks:', error);
    throw error;
  }
};

// Get artworks by category
export const getArtworksByCategory = async (category) => {
  try {
    if (category === 'All') {
      return await getAllArtworks();
    }
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    
    const artworks = data.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      year: artwork.year,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      description: artwork.description,
      category: artwork.category,
      price: artwork.price,
      imageUrl: artwork.image_url,
      imagePath: artwork.image_path,
      featured: artwork.featured,
      artworkNumber: artwork.artwork_number,
      createdAt: artwork.created_at,
      updatedAt: artwork.updated_at,
      userId: artwork.user_id,
    }));
    
    return artworks;
  } catch (error) {
    console.error('Error getting artworks by category:', error);
    throw error;
  }
};
