import { showPage, resolvePageKey } from './router.js';
import {
  closeModal,
  openVideoModal,
  openPhotoModal,
  openMemberModal,
  openFolderModal,
  openFolderImageModal,
  openCardModal,
  getFolderById,
} from './modal.js';
import { getState } from './state.js';
import { parseUrl } from './navigation.js';
import { home as homePage, projects as projectsPage } from './pages/index.js';

document.addEventListener('click', e => {
  const link = e.target.closest('a[data-page]');
  if (!link) return;
  e.preventDefault();
  closeModal(true);
  showPage(link.dataset.page, true);
});

window.addEventListener('popstate', e => {
  const state   = e.state || {};
  const params  = parseUrl();
  const pageKey = state.p || resolvePageKey(params.page);

  closeModal(true);
  showPage(pageKey, false);

  _restoreModalsOnPop(pageKey, params);
});

document.addEventListener('click', e => {
  const homeCard = e.target.closest('.card[data-card-id]');
  if (homeCard) {
    const cards = getState('homeCards');
    const card  = cards.find(c => c.id === homeCard.dataset.cardId);
    if (card?.full) openCardModal(card.id, true);
    return;
  }

  const vidCard = e.target.closest('.video-card[data-vid-id]');
  if (vidCard) { openVideoModal(vidCard.dataset.vidId); return; }

  const folderCard = e.target.closest('.folder-card[data-folder-id]');
  if (folderCard) {
    const id   = folderCard.dataset.folderId;
    const name = folderCard.dataset.folderName;
    const srcs = JSON.parse(folderCard.dataset.folderSrcs);
    openFolderModal(id, name, srcs, true);
    return;
  }

  const photoItem = e.target.closest('.photo-item[data-img-src]');
  if (photoItem) {
    const folderId = photoItem.dataset.folderId;
    if (folderId) {
      const srcs = JSON.parse(photoItem.dataset.folderSrcs || '[]');
      const idx  = parseInt(photoItem.dataset.imgIdx || '0');
      const grid = photoItem.closest('.folder-modal');
      const name = grid?.querySelector('.folder-modal-title')?.textContent || '';
      openFolderImageModal(folderId, name, srcs, idx, true);
    } else {
      const idx = [...document.querySelectorAll('.photo-item[data-img-src]')].indexOf(photoItem);
      openPhotoModal(idx);
    }
    return;
  }

  const memberCard = e.target.closest('.member-card[data-member-idx]');
  if (memberCard) { openMemberModal(parseInt(memberCard.dataset.memberIdx), true); return; }

  const navMember = e.target.closest('[data-nav-member]');
  if (navMember && !navMember.disabled) {
    openMemberModal(parseInt(navMember.dataset.navMember), 'replace');
    return;
  }

  const navImg = e.target.closest('[data-nav-img]');
  if (navImg && !navImg.disabled) {
    const fi     = navImg.dataset.folderId;
    const folder = getFolderById(fi);
    if (folder) openFolderImageModal(fi, folder.name, folder.srcs, parseInt(navImg.dataset.navImg), 'replace');
    return;
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); return; }
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest(
    '.video-card[data-vid-id], .photo-item[data-img-src], .member-card[data-member-idx], .folder-card[data-folder-id]'
  );
  if (card) { e.preventDefault(); card.click(); }
});

window.addEventListener('scroll', () => {
  document.querySelector('.site-header')
    ?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

function _restoreModalsOnPop(pageKey, { video, photo, profile, card, id, img }) {
  if (pageKey === 'projects') {
    const wait = projectsPage.waitForProjects;
    if (video)       wait().then(() => openVideoModal(video, false));
    else if (photo)  wait().then(() => openPhotoModal(parseInt(photo), false));
    else if (id) {
      wait().then(() => {
        const folder = getFolderById(id);
        if (!folder) return;
        if (img !== null) openFolderImageModal(id, folder.name, folder.srcs, parseInt(img), false);
        else              openFolderModal(id, folder.name, folder.srcs, false);
      });
    }
  }

  if (pageKey === 'home') {
    if (profile !== null) homePage.waitForMembers().then(() => openMemberModal(parseInt(profile), false));
    if (card)             homePage.waitForHome().then(()    => openCardModal(card, false));
  }
}