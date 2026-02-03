import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.\n' +
    'Required variables:\n' +
    '- REACT_APP_SUPABASE_URL\n' +
    '- REACT_APP_SUPABASE_ANON_KEY'
  );
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,

    storageKey: 'malvern-studio-auth',
  }
});


export const auth = supabase.auth;
export const db = supabase;
export const storage = supabase.storage;

export default supabase;
