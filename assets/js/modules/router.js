import { getState, setState, resetPageLoaded } from './state.js';
import { parseUrl, replaceHistory, pushHistory } from './navigation.js';
import { home, partners, projects, join, page404 } from './pages/index.js';
import { closeModal } from './modal/index.js';
import { restoreModalsFromParams } from './modal/restore.js';

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
  if (pageKey === getState('currentPage')) return;

  const route = ROUTES[pageKey] || ROUTES[DEFAULT_PAGE];

  if (pushState) pushHistory(pageKey, route.title);

  document.title = route.title;
  _syncNavLinks(pageKey);
  _closeNavMenu();
  _cancelTransition();

  setState('currentPage', pageKey);
  resetPageLoaded();

  const current = app.firstElementChild;
  const flash   = _createFlash();

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

export function initRouter() {
  const params  = parseUrl();
  const pageKey = resolvePageKey(params.page);

  _initHistory(pageKey, params);

  setState('currentPage', null);
  showPage(pageKey, false);
  restoreModalsFromParams(pageKey, params, _buildWaiters());
}

function _initHistory(pageKey, params) {
  if (!params.page) {
    replaceHistory(DEFAULT_PAGE, ROUTES[DEFAULT_PAGE].title);
  } else if (pageKey === '404') {
    setState('rawBadParam', params.page);
    replaceHistory('404', ROUTES['404'].title, { p: params.page });
  } else {
    replaceHistory(pageKey, ROUTES[pageKey].title, _modalExtra(params));
  }
}

function _modalExtra({ video, photo, profile, card, id, img }) {
  if (video)          return { video };
  if (photo !== null) return { photo };
  if (profile)        return { profile };
  if (card)           return { card };
  if (id)             return img !== null ? { id, img } : { id };
  return {};
}

function _buildWaiters() {
  return {
    waitForProjects: projects.waitForProjects,
    waitForMembers:  home.waitForMembers,
    waitForHome:     home.waitForHome,
  };
}

function _mountPage(route) {
  app.replaceChildren(route.render());
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

function _cancelTransition() {
  if (!_transitionTimer) return;
  clearTimeout(_transitionTimer);
  _transitionTimer = null;
  document.querySelectorAll('.page-flash').forEach(f => f.remove());
}

function _createFlash() {
  const flash = document.createElement('div');
  flash.className = 'page-flash';
  document.body.appendChild(flash);
  return flash;
}
