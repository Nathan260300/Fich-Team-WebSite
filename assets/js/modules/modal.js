import { getState, setState } from './state.js';
import { getQueryParams } from './utils.js';
import { pushModalUrl, clearModalUrl } from './navigation.js';
import { PhotoItem } from './components.js';
import { textToHtml } from './utils.js';

export function getFolderById(id) {
  const folders = getState('photoFolders');
  return folders[id] || null;
}

/**
 * @param {HTMLElement} content
 * @param {string[]}    [modalPairs=[]] 
 * @param {boolean}     [replace=false]
 */
export function openModal(content, modalPairs = [], replace = false) {
  closeModal(true);

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const box = document.createElement('div');
  box.className = 'modal-box';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.setAttribute('aria-label', 'Fermer');
  closeBtn.textContent = '✕';

  const scroll = document.createElement('div');
  scroll.className = 'modal-box-scroll';
  scroll.appendChild(content);

  box.appendChild(closeBtn);
  box.appendChild(scroll);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  setState('activeModal', overlay);

  if (replace) overlay.classList.add('modal-no-anim');

  if (modalPairs.length) {
    const currentPage = getState('currentPage');
    pushModalUrl(currentPage, modalPairs, replace);
    if (replace) overlay._noHistoryBack = true;
  }

  closeBtn.addEventListener('click', () => closeModal());
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
}

/**
 * @param {boolean} [instant=false]
 */
export function closeModal(instant = false) {
  const modal = getState('activeModal');
  if (!modal) return;

  const { _folderId, _folderName, _folderSrcs, _noHistoryBack, _isFolderImg } = modal;
  setState('activeModal', null);
  document.body.style.overflow = '';
  modal.querySelectorAll('iframe').forEach(f => { f.src = ''; });

  if (instant) { modal.remove(); return; }

  modal.classList.add('closing');
  setTimeout(() => modal.remove(), 200);

  const p = getQueryParams();
  const hasModal = p.has('video') || p.has('photo') || p.has('profile') || p.has('card') || p.has('id');
  if (!hasModal) return;

  const currentPage = getState('currentPage');

  if (_isFolderImg && _folderId) {
    if (_noHistoryBack) {
      const u = getQueryParams();
      u.delete('img');
      history.replaceState({ p: currentPage }, document.title, '?' + u.toString());
    } else {
      history.back();
    }
    setTimeout(() => openFolderModal(_folderId, _folderName, _folderSrcs, false), 10);
  } else if (_noHistoryBack) {
    clearModalUrl(currentPage);
  } else {
    history.back();
  }
}

/**
 * @param {string}  videoId
 * @param {boolean} [push=true]
 */
export function openVideoModal(videoId, push = true) {
  if (!videoId) return;
  const card    = document.querySelector(`.video-card[data-vid-id="${videoId}"]`);
  const title   = card?.dataset.vidTitle   || '';
  const creator = card?.dataset.vidCreator || '';

  const wrap = document.createElement('div');
  wrap.className = 'modal-video-wrap';

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`;
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  iframe.loading = 'lazy';
  iframe.title = title;
  wrap.appendChild(iframe);

  const infoWrap = document.createElement('div');
  infoWrap.className = 'modal-video-info';
  const titleEl = document.createElement('p');
  titleEl.className = 'modal-video-title';
  titleEl.textContent = title;
  infoWrap.appendChild(titleEl);
  if (creator) {
    const creatorEl = document.createElement('p');
    creatorEl.className = 'modal-video-creator';
    creatorEl.textContent = `par ${creator}`;
    infoWrap.appendChild(creatorEl);
  }

  const fragment = document.createDocumentFragment();
  fragment.appendChild(wrap);
  fragment.appendChild(infoWrap);

  const container = document.createElement('div');
  container.appendChild(fragment);
  openModal(container, push ? ['video', videoId] : []);
}

/**
 * @param {number}    idx
 * @param {boolean}   [push=true]
 * @param {string[]}  [srcs=null]
 */
export function openPhotoModal(idx, push = true, srcs = null) {
  let src;
  if (srcs) {
    src = srcs[idx];
  } else {
    const items = [...document.querySelectorAll('.photo-item[data-img-src]')];
    src = items[idx]?.dataset.imgSrc;
  }
  if (!src) return;

  const wrap = document.createElement('div');
  wrap.className = 'modal-photo-wrap';
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Photo FICH Team';
  wrap.appendChild(img);

  openModal(wrap, push ? ['photo', idx] : []);
}

/**
 * @param {string}   folderId
 * @param {string}   name
 * @param {string[]} srcs
 * @param {boolean}  [push=true]
 */
export function openFolderModal(folderId, name, srcs, push = true) {
  const content = _buildFolderModalContent(folderId, name, srcs);
  openModal(content, push ? ['id', folderId] : []);
}

/**
 * @param {string}   folderId
 * @param {string}   name
 * @param {string[]} srcs
 * @param {number}   imgIdx
 * @param {boolean|'replace'} [push=true]
 */
export function openFolderImageModal(folderId, name, srcs, imgIdx, push = true) {
  const src = srcs[imgIdx];
  if (!src) return;

  const isReplace  = push === 'replace';
  const modalPairs = isReplace ? ['id', folderId, 'img', imgIdx]
                   : push      ? ['id', folderId, 'img', imgIdx]
                   : [];

  const wrap = document.createElement('div');
  wrap.className = 'modal-photo-wrap';
  const img = document.createElement('img');
  img.src = src;
  img.alt = name;
  wrap.appendChild(img);

  const footer = _buildImageFooter(folderId, name, srcs, imgIdx);

  const container = document.createElement('div');
  container.appendChild(wrap);
  container.appendChild(footer);

  openModal(container, modalPairs, isReplace);

  const modal = getState('activeModal');
  if (modal) {
    modal._folderId    = folderId;
    modal._folderName  = name;
    modal._folderSrcs  = srcs;
    modal._isFolderImg = true;
    if (isReplace) modal._noHistoryBack = true;
  }
}

/**
 * @param {number} idx
 * @param {boolean|'replace'} [push=true]
 */
export function openMemberModal(idx, push = true) {
  const grid = document.getElementById('members-grid');
  if (!grid) return;
  const data = JSON.parse(grid.dataset.members || '[]');
  const m = data[idx];
  if (!m) return;

  const isReplace  = push === 'replace';
  const modalPairs = isReplace ? ['profile', idx]
                   : push      ? ['profile', idx]
                   : [];

  const content = _buildMemberModalContent(m, idx, data.length);
  openModal(content, modalPairs, isReplace);

  if (isReplace && getState('activeModal')) {
    getState('activeModal')._noHistoryBack = true;
  }
}

/**
 * @param {string}  cardId
 * @param {boolean} [push=true]
 */
export function openCardModal(cardId, push = true) {
  const cards = getState('homeCards');
  const card  = cards.find(c => c.id === cardId);
  if (!card || !card.full) return;

  const content = _buildCardModalContent(card);
  openModal(content, push ? ['card', cardId] : []);
}

function _buildFolderModalContent(folderId, name, srcs) {
  const root = document.createElement('div');
  root.className = 'folder-modal';

  const header = document.createElement('div');
  header.className = 'folder-modal-header';
  const icon = document.createElement('span');
  icon.textContent = '📁';
  const h2 = document.createElement('h2');
  h2.className = 'folder-modal-title';
  h2.textContent = name;
  const countEl = document.createElement('span');
  countEl.className = 'photo-folder-count';
  countEl.textContent = `${srcs.length} image${srcs.length > 1 ? 's' : ''}`;
  header.appendChild(icon);
  header.appendChild(h2);
  header.appendChild(countEl);

  const grid = document.createElement('div');
  grid.className = 'photo-grid folder-modal-grid';
  grid.dataset.folderSrcs = JSON.stringify(srcs);

  srcs.forEach((src, i) => {
    grid.appendChild(PhotoItem(src, i, folderId, srcs));
  });

  root.appendChild(header);
  root.appendChild(grid);
  return root;
}

function _buildImageFooter(folderId, name, srcs, imgIdx) {
  const footer = document.createElement('div');
  footer.className = 'modal-img-footer';

  const cat = document.createElement('span');
  cat.className = 'modal-img-category';
  cat.textContent = `📁 ${name}`;

  const nav = document.createElement('div');
  nav.className = 'modal-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'modal-nav-btn';
  prevBtn.textContent = '←';
  prevBtn.dataset.navImg   = imgIdx - 1;
  prevBtn.dataset.folderId = folderId;
  if (imgIdx <= 0) prevBtn.disabled = true;

  const counter = document.createElement('span');
  counter.className = 'modal-nav-counter';
  counter.textContent = `${imgIdx + 1} / ${srcs.length}`;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'modal-nav-btn';
  nextBtn.textContent = '→';
  nextBtn.dataset.navImg   = imgIdx + 1;
  nextBtn.dataset.folderId = folderId;
  if (imgIdx >= srcs.length - 1) nextBtn.disabled = true;

  nav.appendChild(prevBtn);
  nav.appendChild(counter);
  nav.appendChild(nextBtn);
  footer.appendChild(cat);
  footer.appendChild(nav);
  return footer;
}

function _buildMemberModalContent(m, idx, total) {
  const root = document.createDocumentFragment();

  const banner = document.createElement('div');
  banner.className = 'member-modal-banner';
  const bannerImg = document.createElement('img');
  bannerImg.src = m.banner;
  bannerImg.alt = `Bannière ${m.pseudo}`;
  banner.appendChild(bannerImg);

  const body = document.createElement('div');
  body.className = 'member-modal-body';

  const avatarWrap = document.createElement('div');
  avatarWrap.className = 'member-modal-avatar-wrap';
  const avatarImg = document.createElement('img');
  avatarImg.src = m.avatar;
  avatarImg.alt = m.pseudo;
  avatarImg.className = 'member-modal-avatar';
  avatarWrap.appendChild(avatarImg);

  const name = document.createElement('h2');
  name.className = 'member-modal-name';
  name.textContent = m.pseudo;

  body.appendChild(avatarWrap);
  body.appendChild(name);

  if (m.description) {
    const desc = document.createElement('p');
    desc.className = 'member-modal-desc';
    desc.innerHTML = m.description.replace(/\n/g, '<br>');
    body.appendChild(desc);
  }

  body.appendChild(_buildMemberNav(idx, total));

  const container = document.createElement('div');
  container.appendChild(banner);
  container.appendChild(body);
  return container;
}

function _buildMemberNav(idx, total) {
  const nav = document.createElement('div');
  nav.className = 'modal-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'modal-nav-btn';
  prevBtn.textContent = '←';
  prevBtn.dataset.navMember = idx - 1;
  if (idx <= 0) prevBtn.disabled = true;

  const counter = document.createElement('span');
  counter.className = 'modal-nav-counter';
  counter.textContent = `${idx + 1} / ${total}`;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'modal-nav-btn';
  nextBtn.textContent = '→';
  nextBtn.dataset.navMember = idx + 1;
  if (idx >= total - 1) nextBtn.disabled = true;

  nav.appendChild(prevBtn);
  nav.appendChild(counter);
  nav.appendChild(nextBtn);
  return nav;
}

function _buildCardModalContent(card) {
  const root = document.createElement('div');
  root.className = 'home-card-modal';

  const header = document.createElement('div');
  header.className = 'home-card-modal-header';
  if (card.emoji) {
    const emoji = document.createElement('span');
    emoji.className = 'home-card-modal-emoji';
    emoji.textContent = card.emoji;
    header.appendChild(emoji);
  }
  const title = document.createElement('h2');
  title.className = 'home-card-modal-title';
  title.textContent = card.title;
  header.appendChild(title);

  const bodyWrap = document.createElement('div');
  bodyWrap.className = 'home-card-modal-body';
  const p = document.createElement('p');
  p.innerHTML = textToHtml(card.full);
  bodyWrap.appendChild(p);

  root.appendChild(header);
  root.appendChild(bodyWrap);
  return root;
}
