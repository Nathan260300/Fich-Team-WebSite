import { openModal, closeModal } from './core.js';
import { getState }              from '../state.js';
import {
  buildVideoContent,
  buildPhotoContent,
  buildFolderContent,
  buildFolderImageContent,
  buildMemberContent,
  buildCardContent,
} from './builders.js';

export { openModal, closeModal };

export function getFolderById(id) {
  return getState('photoFolders')[id] || null;
}

export function openVideoModal(videoId, push = true) {
  if (!videoId) return;
  openModal(buildVideoContent(videoId), push ? ['video', videoId] : []);
}

export function openPhotoModal(idx, push = true, srcs = null) {
  const src = srcs ? srcs[idx] : _srcFromDom(idx);
  if (!src) return;
  openModal(buildPhotoContent(src), push ? ['photo', idx] : []);
}

export function openFolderModal(folderId, name, srcs, push = true) {
  openModal(buildFolderContent(folderId, name, srcs), push ? ['id', folderId] : []);
}

export function openFolderImageModal(folderId, name, srcs, imgIdx, push = true) {
  if (!srcs[imgIdx]) return;
  const isReplace  = push === 'replace';
  const pairs      = _folderImgPairs(folderId, imgIdx, push);

  openModal(buildFolderImageContent(folderId, name, srcs, imgIdx), pairs, isReplace);

  const modal = getState('activeModal');
  if (modal) {
    modal._folderId    = folderId;
    modal._folderName  = name;
    modal._folderSrcs  = srcs;
    modal._isFolderImg = true;
    if (isReplace) modal._noHistoryBack = true;
  }
}

export function openMemberModal(idx, push = true) {
  const data = _getMembersData();
  if (!data[idx]) return;

  const isReplace = push === 'replace';
  const pairs     = _pushOrReplace('profile', idx, push);

  openModal(buildMemberContent(data[idx], idx, data.length), pairs, isReplace);

  if (isReplace) {
    const modal = getState('activeModal');
    if (modal) modal._noHistoryBack = true;
  }
}

export function openCardModal(cardId, push = true) {
  const card = getState('homeCards').find(c => c.id === cardId);
  if (!card?.full) return;
  openModal(buildCardContent(card), push ? ['card', cardId] : []);
}

function _srcFromDom(idx) {
  return [...document.querySelectorAll('.photo-item[data-img-src]')][idx]?.dataset.imgSrc;
}

function _getMembersData() {
  return JSON.parse(document.getElementById('members-grid')?.dataset.members || '[]');
}

function _folderImgPairs(folderId, imgIdx, push) {
  if (!push) return [];
  return ['id', folderId, 'img', imgIdx];
}

function _pushOrReplace(key, value, push) {
  if (!push) return [];
  return [key, value];
}
