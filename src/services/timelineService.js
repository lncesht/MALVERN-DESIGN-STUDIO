import { supabase } from '../config/supabase';

const TIMELINE_TABLE = 'timeline_events';
const SETTINGS_TABLE = 'settings';

// Get exhibition date
export const getExhibitionDate = async () => {
  try {
    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .select('image_url')
      .eq('key', 'exhibition_date')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    return data?.image_url || '9 January 2026';
  } catch (error) {
    console.error('Error fetching exhibition date:', error);
    return '9 January 2026';
  }
};

// Update exhibition date
export const updateExhibitionDate = async (date) => {
  try {
    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .upsert({ 
        key: 'exhibition_date', 
        image_url: date 
      }, { 
        onConflict: 'key' 
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating exhibition date:', error);
    throw error;
  }
};


export const getTimelineEvents = async () => {
  try {
    const { data, error } = await supabase
      .from(TIMELINE_TABLE)
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching timeline events:', error);
    return [];
  }
};


export const getTimelineEventById = async (id) => {
  try {
    const { data, error } = await supabase
      .from(TIMELINE_TABLE)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching timeline event:', error);
    throw error;
  }
};

// Add timeline event
export const addTimelineEvent = async (eventData) => {
  try {
    const { data, error } = await supabase
      .from(TIMELINE_TABLE)
      .insert([{
        time: eventData.time,
        title: eventData.title,
        description: eventData.description,
        order: eventData.order
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding timeline event:', error);
    throw error;
  }
};

// Update timeline event
export const updateTimelineEvent = async (id, eventData) => {
  try {
    const updateData = {};
    if (eventData.time !== undefined) updateData.time = eventData.time;
    if (eventData.title !== undefined) updateData.title = eventData.title;
    if (eventData.description !== undefined) updateData.description = eventData.description;
    if (eventData.order !== undefined) updateData.order = eventData.order;
    
    const { error } = await supabase
      .from(TIMELINE_TABLE)
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating timeline event:', error);
    throw error;
  }
};

// Delete timeline event
export const deleteTimelineEvent = async (id) => {
  try {
    const { error } = await supabase
      .from(TIMELINE_TABLE)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting timeline event:', error);
    throw error;
  }
};
