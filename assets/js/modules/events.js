import { showPage, resolvePageKey } from './router.js';
import { closeModal, openVideoModal, openPhotoModal, openMemberModal,
         openFolderModal, openFolderImageModal, openCardModal, getFolderById } from './modal/index.js';
import { restoreModalsFromParams } from './modal/restore.js';
import { consumeSkipRestore } from './modal/history.js';
import { getState }    from './state.js';
import { parseUrl }    from './navigation.js';
import { home, projects } from './pages/index.js';

document.addEventListener('click', e => {
  const link = e.target.closest('a[data-page]');
  if (!link) return;
  e.preventDefault();
  closeModal(true);
  showPage(link.dataset.page, true);
});

window.addEventListener('popstate', e => {
  const params  = parseUrl();
  const pageKey = (e.state || {}).p || resolvePageKey(params.page);

  closeModal(true);
  showPage(pageKey, false);

  if (!consumeSkipRestore()) {
    restoreModalsFromParams(pageKey, params, _buildWaiters());
  }
});

document.addEventListener('click', e => {
  if (_handleHomeCard(e))   return;
  if (_handleVideoCard(e))  return;
  if (_handleFolderCard(e)) return;
  if (_handlePhotoItem(e))  return;
  if (_handleMemberCard(e)) return;
  if (_handleNavMember(e))  return;
  if (_handleNavImg(e))     return;
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

function _handleHomeCard(e) {
  const el = e.target.closest('.card[data-card-id]');
  if (!el) return false;
  const card = getState('homeCards').find(c => c.id === el.dataset.cardId);
  if (card?.full) openCardModal(card.id, true);
  return true;
}

function _handleVideoCard(e) {
  const el = e.target.closest('.video-card[data-vid-id]');
  if (!el) return false;
  openVideoModal(el.dataset.vidId);
  return true;
}

function _handleFolderCard(e) {
  const el = e.target.closest('.folder-card[data-folder-id]');
  if (!el) return false;
  openFolderModal(el.dataset.folderId, el.dataset.folderName, JSON.parse(el.dataset.folderSrcs), true);
  return true;
}

function _handlePhotoItem(e) {
  const el = e.target.closest('.photo-item[data-img-src]');
  if (!el) return false;
  const folderId = el.dataset.folderId;
  if (folderId) {
    const srcs = JSON.parse(el.dataset.folderSrcs || '[]');
    const idx  = parseInt(el.dataset.imgIdx || '0');
    const name = el.closest('.folder-modal')?.querySelector('.folder-modal-title')?.textContent || '';
    openFolderImageModal(folderId, name, srcs, idx, true);
  } else {
    const idx = [...document.querySelectorAll('.photo-item[data-img-src]')].indexOf(el);
    openPhotoModal(idx);
  }
  return true;
}

function _handleMemberCard(e) {
  const el = e.target.closest('.member-card[data-member-idx]');
  if (!el) return false;
  openMemberModal(parseInt(el.dataset.memberIdx), true);
  return true;
}

function _handleNavMember(e) {
  const el = e.target.closest('[data-nav-member]');
  if (!el || el.disabled) return false;
  openMemberModal(parseInt(el.dataset.navMember), 'replace');
  return true;
}

function _handleNavImg(e) {
  const el = e.target.closest('[data-nav-img]');
  if (!el || el.disabled) return false;
  const folder = getFolderById(el.dataset.folderId);
  if (folder) openFolderImageModal(el.dataset.folderId, folder.name, folder.srcs, parseInt(el.dataset.navImg), 'replace');
  return true;
}

function _buildWaiters() {
  return {
    waitForProjects: projects.waitForProjects,
    waitForMembers:  home.waitForMembers,
    waitForHome:     home.waitForHome,
  };
}
