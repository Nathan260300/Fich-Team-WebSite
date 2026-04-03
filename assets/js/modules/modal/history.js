import { getState } from '../state.js';
import { getQueryParams } from '../utils.js';

export const MODAL_KEYS = ['video', 'photo', 'profile', 'card', 'id', 'img'];

let _skipNextPopstoreRestore = false;

export function consumeSkipRestore() {
  const val = _skipNextPopstoreRestore;
  _skipNextPopstoreRestore = false;
  return val;
}

export function hasModalInUrl() {
  const p = getQueryParams();
  return MODAL_KEYS.some(k => p.has(k));
}

export function pushModalUrl(pageKey, pairs, replace = false) {
  const u = getQueryParams();
  for (const k of MODAL_KEYS) u.delete(k);
  for (let i = 0; i < pairs.length; i += 2) u.set(pairs[i], pairs[i + 1]);
  const url = '?' + u.toString();
  if (replace) {
    history.replaceState({ p: pageKey }, document.title, url);
  } else {
    history.pushState({ p: pageKey, modal: pairs }, document.title, url);
  }
}

export function clearModalUrl(pageKey) {
  const u = getQueryParams();
  for (const k of MODAL_KEYS) u.delete(k);
  history.replaceState({ p: pageKey }, document.title, '?' + u.toString());
}

export function removeImgFromUrl(pageKey) {
  const u = getQueryParams();
  u.delete('img');
  history.replaceState({ p: pageKey }, document.title, '?' + u.toString());
}

export function syncHistoryOnOpen(overlay, pairs, replace) {
  const currentPage = getState('currentPage');
  pushModalUrl(currentPage, pairs, replace);
  if (replace) overlay._noHistoryBack = true;
}

export function syncHistoryOnClose(modal, onReopenFolder) {
  if (!hasModalInUrl()) return;

  const page = getState('currentPage');
  const { _folderId, _folderName, _folderSrcs, _noHistoryBack, _isFolderImg } = modal;

  if (_isFolderImg && _folderId) {
    _handleFolderImgClose(_folderId, _folderName, _folderSrcs, _noHistoryBack, page, onReopenFolder);
  } else if (_noHistoryBack) {
    clearModalUrl(page);
  } else {
    history.back();
  }
}

function _handleFolderImgClose(folderId, name, srcs, noHistoryBack, page, onReopenFolder) {
  if (noHistoryBack) {
    removeImgFromUrl(page);
  } else {
    _skipNextPopstoreRestore = true;
    history.back();
  }
  setTimeout(() => onReopenFolder(folderId, name, srcs), 10);
}
