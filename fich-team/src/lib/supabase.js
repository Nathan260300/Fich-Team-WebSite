import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://unhfpfhsidmyxwcfdnek.supabase.co';
const SUPABASE_ANON = 'sb_publishable_5cDdiGYwiRn619gA9shx0A_tuyM1ipK';

export const REQUEST_TIMEOUT_MS = 12000;

export function fetchWithTimeout(input, init = {}) {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal = init.signal && typeof AbortSignal.any === 'function'
    ? AbortSignal.any([init.signal, timeout])
    : (init.signal ?? timeout);
  return fetch(input, { ...init, signal });
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  global: { fetch: fetchWithTimeout },
});

export const EDGE_SKIN = `${SUPABASE_URL}/functions/v1/get-minecraft-skin`;

export const EDGE_AVATAR = `${SUPABASE_URL}/functions/v1/get-discord-avatar`;

export function storageUrl(path) {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/media/${path}`;
}

export function mediaUrl(value) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return storageUrl(value);
}