import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://unhfpfhsidmyxwcfdnek.supabase.co';
const SUPABASE_ANON = 'sb_publishable_60BMiOljgHuEmR4UN1sHhg_zG1zaZWG';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

export const EDGE_AVATAR = `${SUPABASE_URL}/functions/v1/get-discord-avatar`;

export function storageUrl(path) {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/media/${path}`;
}