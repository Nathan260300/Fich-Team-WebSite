import { getState, setState, resetPageLoaded } from './state.js';
import { parseUrl, replaceHistory, pushHistory } from './navigation.js';
import { home, partners, projects, join, page404 } from './pages/index.js';
import {
  openVideoModal, openPhotoModal,
  openFolderModal, openFolderImageModal,
  openMemberModal, openCardModal,
  getFolderById,
} from './modal.js';

const DEFAULT_PAGE = 'home';

const ROUTES = {
  home,
  partners,
  projects,
  join,
  '404': page404,
};

const app = document.getElementById('app');
let _transitionTimer = null;

export function resolvePageKey(rawPage) {
  if (!rawPage) return DEFAULT_PAGE;
  return ROUTES[rawPage] ? rawPage : '404';
}

export function showPage(pageKey, pushState = false) {
  const currentPage = getState('currentPage');
  if (pageKey === currentPage) return;

  const route = ROUTES[pageKey] || ROUTES[DEFAULT_PAGE];

  if (pushState) pushHistory(pageKey, route.title);

  document.title = route.title;
  _syncNavLinks(pageKey);
  _closeNavMenu();

  if (_transitionTimer) {
    clearTimeout(_transitionTimer);
    _transitionTimer = null;
    document.querySelectorAll('.page-flash').forEach(f => f.remove());
  }

  setState('currentPage', pageKey);
  resetPageLoaded();

  const current = app.firstElementChild;
  const flash = document.createElement('div');
  flash.className = 'page-flash';
  document.body.appendChild(flash);

  if (current) current.classList.add('page-exit');

  _transitionTimer = setTimeout(() => {
    _mountPage(route);
    _transitionTimer = setTimeout(() => {
      app.firstElementChild?.classList.remove('page-enter');
      flash.remove();
      _transitionTimer = null;
    }, 420);
  }, 200);
}

function _mountPage(route) {
  const node = route.render();
  app.replaceChildren(node);
  app.firstElementChild?.classList.add('page-enter');
  route.onMount?.();
  window.scrollTo({ top: 0 });
}

function _syncNavLinks(pageKey) {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageKey);
  });
}

function _closeNavMenu() {
  const toggle = document.getElementById('nav-toggle');
  if (toggle) toggle.checked = false;
}

export function initRouter() {
  const params  = parseUrl();
  const pageKey = resolvePageKey(params.page);

  if (!params.page) {
    replaceHistory(DEFAULT_PAGE, ROUTES[DEFAULT_PAGE].title);
  } else if (pageKey === '404') {
    setState('rawBadParam', params.page);
    replaceHistory('404', ROUTES['404'].title, { p: params.page });
  } else {
    replaceHistory(pageKey, ROUTES[pageKey].title, _buildModalExtra(params));
  }

  setState('currentPage', null);
  showPage(pageKey, false);
  _restoreModals(pageKey, params);
}

function _buildModalExtra({ video, photo, profile, card, id, img }) {
  if (video)            return { video };
  if (photo !== null)   return { photo };
  if (profile !== null) return { profile };
  if (card)             return { card };
  if (id)               return img !== null ? { id, img } : { id };
  return {};
}

function _restoreModals(pageKey, { video, photo, profile, card, id, img }) {
  if (pageKey === 'projects') {
    const wait = projects.waitForProjects;
    if (video)          wait().then(() => openVideoModal(video, false));
    else if (photo)     wait().then(() => openPhotoModal(parseInt(photo), false));
    else if (id)        wait().then(() => {
      const folder = getFolderById(id);
      if (!folder) return;
      if (img !== null) openFolderImageModal(id, folder.name, folder.srcs, parseInt(img), false);
      else              openFolderModal(id, folder.name, folder.srcs, false);
    });
  }

  if (pageKey === 'home') {
    if (profile !== null) home.waitForMembers().then(() => openMemberModal(parseInt(profile), false));
    if (card)             home.waitForHome().then(()    => openCardModal(card, false));
  }
}