const BASE = 'https://mc-heads.net';

export function skinFace(username, size = 96) {
  if (!username) return null;
  return `${BASE}/avatar/${encodeURIComponent(username)}/${size}`;
}

export function skinBody(username) {
  if (!username) return null;
  return `${BASE}/body/${encodeURIComponent(username)}/right`;
}
