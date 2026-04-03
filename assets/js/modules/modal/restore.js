import {
  openVideoModal,
  openPhotoModal,
  openFolderModal,
  openFolderImageModal,
  openMemberModal,
  openCardModal,
  getFolderById,
} from './index.js';

export function restoreModalsFromParams(pageKey, params, waiters) {
  const { video, photo, profile, card, id, img } = params;
  const { waitForProjects, waitForMembers, waitForHome } = waiters;

  if (pageKey === 'projects') {
    _restoreProjectModal({ video, photo, id, img }, waitForProjects);
  }

  if (pageKey === 'home') {
    _restoreHomeModal({ profile, card }, waitForMembers, waitForHome);
  }
}

function _restoreProjectModal({ video, photo, id, img }, wait) {
  if (video) {
    wait().then(() => openVideoModal(video, false));
  } else if (photo !== null) {
    wait().then(() => openPhotoModal(parseInt(photo), false));
  } else if (id) {
    wait().then(() => _openFolderFromUrl(id, img));
  }
}

function _restoreHomeModal({ profile, card }, waitForMembers, waitForHome) {
  if (profile !== null) waitForMembers().then(() => openMemberModal(parseInt(profile), false));
  if (card)             waitForHome().then(()    => openCardModal(card, false));
}

function _openFolderFromUrl(id, img) {
  const folder = getFolderById(id);
  if (!folder) return;
  if (img !== null) {
    openFolderImageModal(id, folder.name, folder.srcs, parseInt(img), false);
  } else {
    openFolderModal(id, folder.name, folder.srcs, false);
  }
}
