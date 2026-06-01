import { useState, useEffect } from 'react';
import { EDGE_AVATAR, storageUrl } from '../lib/supabase';

const DISCORD_ID_RE = /^\d{17,20}$/;
const cache = {};

export function useAvatar(avatarRaw) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!avatarRaw) { setUrl(null); return; }

    if (!DISCORD_ID_RE.test(avatarRaw.trim())) {
      setUrl(storageUrl(avatarRaw));
      return;
    }

    const id = avatarRaw.trim();

    if (cache[id]) { setUrl(cache[id]); return; }

    fetch(EDGE_AVATAR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discord_id: id }),
    })
      .then(r => r.json())
      .then(d => {
        const resolved = d.avatar_url ?? null;
        cache[id] = resolved;
        setUrl(resolved);
      })
      .catch(() => setUrl(null));
  }, [avatarRaw]);

  return url;
}