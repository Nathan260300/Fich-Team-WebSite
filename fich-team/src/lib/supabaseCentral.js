import { createClient } from '@supabase/supabase-js';
import { fetchWithTimeout } from './supabase';

const CENTRAL_URL = 'https://zhamxczvyigovbkntbun.supabase.co';
const CENTRAL_PUBLISHABLE_KEY = 'sb_publishable_kQEfnqW1e4fiRjGWqUawtw_pJsRyIFa';
const CENTRAL_STORAGE_KEY = 'sb-zhamxczvyigovbkntbun-auth-token';
const EXPIRY_MARGIN_SECONDS = 30;

const clientOptions = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'fich-public-central-anon' },
  global: { fetch: fetchWithTimeout },
};

export const supabaseCentralAnon = createClient(CENTRAL_URL, CENTRAL_PUBLISHABLE_KEY, clientOptions);

export function readStoredAccessToken() {
  try {
    const raw = window.localStorage.getItem(CENTRAL_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw);
    const token = typeof stored?.access_token === 'string' ? stored.access_token : null;
    const expiresAt = Number(stored?.expires_at ?? 0);
    if (!token || expiresAt - EXPIRY_MARGIN_SECONDS <= Date.now() / 1000) return null;
    return token;
  } catch {
    return null;
  }
}

export function createCentralClientWithToken(token) {
  return createClient(CENTRAL_URL, CENTRAL_PUBLISHABLE_KEY, {
    ...clientOptions,
    global: { fetch: fetchWithTimeout, headers: { Authorization: `Bearer ${token}` } },
  });
}
