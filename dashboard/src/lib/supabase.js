import { createClient } from '@supabase/supabase-js';

const centralSUPABASE_URL = import.meta.env.VITE_CENTRAL_SUPABASE_URL;
const centralSUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_CENTRAL_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(centralSUPABASE_URL, centralSUPABASE_PUBLISHABLE_KEY);