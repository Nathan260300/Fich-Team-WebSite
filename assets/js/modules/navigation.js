import { buildUrl, getQueryParams } from './utils.js';

/**
 * @param {string} pageKey
 * @param {string} title
 * @param {Record<string,string|number>} [extra={}]
 */
export function replaceHistory(pageKey, title, extra = {}) {
  history.replaceState({ p: pageKey }, title, buildUrl(pageKey, extra));
}

/**
 * @param {string} pageKey
 * @param {string} title
 * @param {Record<string,string|number>} [extra={}]
 */
export function pushHistory(pageKey, title, extra = {}) {
  history.pushState({ p: pageKey }, title, buildUrl(pageKey, extra));
}

/**
 * @param {string}   pageKey
 * @param {string[]} pairs
 * @param {boolean}  replace
 */
export function pushModalUrl(pageKey, pairs, replace = false) {
  const MODAL_KEYS = ['video', 'photo', 'profile', 'card', 'id', 'img'];
  const u = getQueryParams();

  for (const k of MODAL_KEYS) u.delete(k);
  for (let i = 0; i < pairs.length; i += 2) {
    u.set(pairs[i], pairs[i + 1]);
  }

  const url = '?' + u.toString();
  if (replace) {
    history.replaceState({ p: pageKey }, document.title, url);
  } else {
    history.pushState({ p: pageKey, modal: pairs }, document.title, url);
  }
}

/**
 * @param {string} pageKey
 */
export function clearModalUrl(pageKey) {
  const MODAL_KEYS = ['video', 'photo', 'profile', 'card', 'id', 'img'];
  const u = getQueryParams();
  for (const k of MODAL_KEYS) u.delete(k);
  history.replaceState({ p: pageKey }, document.title, '?' + u.toString());
}

/**
 * @returns {{ page: string, video: string|null, photo: string|null,
 *             profile: string|null, card: string|null,
 *             id: string|null, img: string|null }}
 */
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