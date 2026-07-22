import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that the URL looks like a real Supabase URL before initializing
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

const url = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';
const key = supabaseAnonKey && supabaseAnonKey !== 'your-supabase-anon-key'
  ? supabaseAnonKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

if (!isValidUrl(supabaseUrl)) {
  console.warn(
    '[Saba] Supabase no configurado: usando cliente placeholder. ' +
    'Configurá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en frontend/.env'
  );
}

export const supabase = createClient(url, key);
