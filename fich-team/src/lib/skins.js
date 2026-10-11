import { useEffect, useSyncExternalStore } from 'react';
import { supabase, EDGE_SKIN } from './supabase';

const entries = new Map();
const listeners = new Set();
const requested = new Set();
let started = false;

function keyOf(username) {
  return username.trim().toLowerCase();
}

function emit() {
  listeners.forEach(listener => listener());
}

function store(username, url, model) {
  const key = keyOf(username);
  const current = entries.get(key);
  const nextModel = model === 'slim' ? 'slim' : 'classic';
  if (current && current.url === url && current.model === nextModel) return;
  entries.set(key, { url, model: nextModel });
  emit();
}

function fromRow(row) {
  if (!row?.username_lower) return;
  store(row.username_lower, row.found ? row.skin_url : null, row.model);
}

function start() {
  if (started) return;
  started = true;
  supabase
    .from('minecraft_skins')
    .select('username_lower, skin_url, model, found')
    .then(({ data }) => {
      (data ?? []).forEach(row => {
        if (!entries.has(row.username_lower)) fromRow(row);
      });
    });
  supabase
    .channel('minecraft_skins_live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'minecraft_skins' }, payload => {
      if (payload.new?.username_lower) fromRow(payload.new);
    })
    .subscribe();
}

async function verify(username) {
  try {
    const res = await fetch(`${EDGE_SKIN}?username=${encodeURIComponent(username)}`);
    if (res.status === 404) {
      store(username, null, 'classic');
      return;
    }
    if (!res.ok) return;
    const data = await res.json();
    store(username, data.found ? data.skin_url : null, data.model);
  } catch {
    return;
  }
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSkin(username) {
  const name = username?.trim();
  useEffect(() => {
    if (!name || requested.has(keyOf(name))) return;
    requested.add(keyOf(name));
    start();
    verify(name);
  }, [name]);
  return useSyncExternalStore(subscribe, () => (name ? entries.get(keyOf(name)) : undefined));
}