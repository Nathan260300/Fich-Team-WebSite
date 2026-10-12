import { createClient } from '@supabase/supabase-js';

const centralSUPABASE_URL = 'https://zhamxczvyigovbkntbun.supabase.co';
const centralSUPABASE_PUBLISHABLE_KEY = 'sb_publishable_kQEfnqW1e4fiRjGWqUawtw_pJsRyIFa';

export const supabaseCentral = createClient(
  centralSUPABASE_URL,
  centralSUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);