import { buildUrl, getQueryParams } from './utils.js';
import { MODAL_KEYS } from './modal/history.js';

export { MODAL_KEYS };

export function replaceHistory(pageKey, title, extra = {}) {
  history.replaceState({ p: pageKey }, title, buildUrl(pageKey, extra));
}

export function pushHistory(pageKey, title, extra = {}) {
  history.pushState({ p: pageKey }, title, buildUrl(pageKey, extra));
}

export function clearModalUrl(pageKey) {
  const u = getQueryParams();
  for (const k of MODAL_KEYS) u.delete(k);
  history.replaceState({ p: pageKey }, document.title, '?' + u.toString());
}

export function parseUrl() {
  const p = getQueryParams();
  return {
    page:    p.get('p'),
    video:   p.get('video'),
    photo:   p.get('photo'),
    profile: p.get('profile'),
    card:    p.get('card'),
    id:      p.get('id'),
    img:     p.get('img'),
  };
}
