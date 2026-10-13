import { createClient } from '@supabase/supabase-js';

const centralSUPABASE_URL = 'https://zhamxczvyigovbkntbun.supabase.co';
const centralSUPABASE_PUBLISHABLE_KEY = 'sb_publishable_IpvrhP92LUNsrFhS0yVLhw_RKKDULBr';

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