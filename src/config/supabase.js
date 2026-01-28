import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://qzlvrycszdhctjmvuhug.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bHZyeWNzemRoY3RqbXZ1aHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzU5NTksImV4cCI6MjA4NDY1MTk1OX0.4kcWrzKp8Dz5pIgvhMq3IGDF8ULY1U9dRjdCbgNbGMo';


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});


export const auth = supabase.auth;
export const db = supabase;
export const storage = supabase.storage;

export default supabase;
