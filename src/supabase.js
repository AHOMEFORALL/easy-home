import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const hasValidUrl =
  typeof supabaseUrl === 'string' &&
  /^https:\/\/[^\s/]+(?:\/.*)?$/.test(supabaseUrl);

export const supabaseConfigError = !supabaseUrl || !supabaseKey
  ? 'Configuration Supabase manquante. Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY dans l’environnement.'
  : !hasValidUrl
    ? 'URL Supabase invalide. Utilise l’URL complète au format https://<project-ref>.supabase.co.'
    : '';

export const supabase = supabaseConfigError
  ? null
  : createClient(supabaseUrl, supabaseKey);
