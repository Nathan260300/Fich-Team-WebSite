import { getState, setState, setLoaded, isLoaded } from '../state.js';
import { waitUntil, clearElement } from '../utils.js';
import { FolderCard, VideoCard, LoadingSpinner, ErrorMessage } from '../components.js';

export const title = 'Projets — FICH Team';

export function render() {
  const section = document.createElement('section');
  section.className = 'page';
  section.setAttribute('aria-label', 'Projets');

  section.appendChild(_buildHero());
  section.appendChild(_buildProjectsLayout());
  return section;
}

export function onMount() {
  loadProjects();
  _initTabs();
}

export function waitForProjects() {
  return waitUntil(() => isLoaded('projects'));
}

async function loadProjects() {
  const photoGrid = document.getElementById('photo-grid');
  const videoGrid = document.getElementById('video-grid');
  if ((!photoGrid && !videoGrid) || isLoaded('projects')) return;

  try {
    const res  = await fetch('assets/data/projects.json');
    if (!res.ok) throw new Error('Réponse réseau invalide');
    const data = await res.json();

    if (data.images?.length) _storeFolders(data.images);

    if (photoGrid) {
      clearElement(photoGrid);
      if (data.images?.length) {
        const foldersGrid = _buildFoldersGrid(data.images);
        photoGrid.appendChild(foldersGrid);
      } else {
        photoGrid.appendChild(_buildEmpty('🖼️', 'Aucune image pour l\'instant.'));
      }
    }

    if (videoGrid) {
      clearElement(videoGrid);
      if (data.videos?.length) {
        data.videos.forEach((vid, i) => videoGrid.appendChild(VideoCard(vid, i)));
      } else {
        videoGrid.appendChild(_buildEmpty('🎬', 'Aucune vidéo pour l\'instant.'));
      }
    }

    setLoaded('projects');
  } catch (err) {
    console.error('[projects] Erreur chargement :', err);
    const onRetry = () => { setLoaded('projects', false); clearElement(photoGrid); clearElement(videoGrid); photoGrid?.appendChild(LoadingSpinner()); loadProjects(); };
    if (photoGrid) { clearElement(photoGrid); photoGrid.appendChild(ErrorMessage('Impossible de charger les projets.', onRetry)); }
    if (videoGrid) { clearElement(videoGrid); videoGrid.appendChild(ErrorMessage('Impossible de charger les projets.', onRetry)); }
  }
}

function _storeFolders(images) {
  const folders = {};
  images.forEach(img => {
    const catId = img.category_id || (img.category || 'sans-categorie').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const name  = img.category || 'Sans catégorie';
    if (!folders[catId]) folders[catId] = { name, srcs: [] };
    folders[catId].srcs.push(img.src);
  });
  setState('photoFolders', folders);
}

function _initTabs() {
  document.addEventListener('click', _onTabClick);
}

function _onTabClick(e) {
  const tab = e.target.closest('.proj-tab');
  if (!tab) return;
  const key = tab.dataset.tab;
  document.querySelectorAll('.proj-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === key);
    t.setAttribute('aria-selected', t.dataset.tab === key);
  });
  document.querySelectorAll('.proj-panel').forEach(p => {
    p.classList.toggle('active', p.id === `tab-${key}`);
  });
}

function _buildHero() {
  const div = document.createElement('div');
  div.className = 'page-hero';
  div.innerHTML = `
    <div class="hero-badge"><span class="badge-dot"></span>Contenus de la FICH Team</div>
    <h1 class="page-title">Nos <span class="accent">Projets</span></h1>
    <p class="page-desc">Découvrez les créations visuelles et vidéos de la FICH Team.</p>`;
  return div;
}

function _buildProjectsLayout() {
  const wrap = document.createElement('div');
  wrap.className = 'projects-page';

  const tabs = document.createElement('div');
  tabs.className = 'proj-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Sections projets');

  tabs.appendChild(_buildTab('photos', 'Images', true, `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
    </svg>`));
  tabs.appendChild(_buildTab('videos', 'Vidéos', false, `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>`));

  const panelPhotos = _buildPanel('photos', 'photo-grid', true);
  const panelVideos = _buildPanel('videos', 'video-grid', false);

  wrap.appendChild(tabs);
  wrap.appendChild(panelPhotos);
  wrap.appendChild(panelVideos);
  return wrap;
}

function _buildTab(key, label, active, iconSvg) {
  const btn = document.createElement('button');
  btn.className = `proj-tab${active ? ' active' : ''}`;
  btn.dataset.tab = key;
  btn.setAttribute('role', 'tab');
  btn.setAttribute('aria-selected', active);
  btn.setAttribute('aria-controls', `tab-${key}`);
  btn.innerHTML = iconSvg;
  btn.appendChild(document.createTextNode(label));
  return btn;
}

function _buildPanel(key, gridId, active) {
  const panel = document.createElement('div');
  panel.id = `tab-${key}`;
  panel.className = `proj-panel${active ? ' active' : ''}`;
  panel.setAttribute('role', 'tabpanel');

  if (key === 'videos') {
    const grid = document.createElement('div');
    grid.className = 'video-grid';
    grid.id = gridId;
    const spinner = LoadingSpinner();
    spinner.style.gridColumn = '1 / -1';
    grid.appendChild(spinner);
    panel.appendChild(grid);
  } else {
    const placeholder = document.createElement('div');
    placeholder.id = gridId;
    placeholder.appendChild(LoadingSpinner());
    panel.appendChild(placeholder);
  }

  return panel;
}

function _buildFoldersGrid(images) {
  const grouped = {};
  images.forEach(img => {
    const cat   = img.category    || 'Sans catégorie';
    const catId = img.category_id || cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!grouped[catId]) grouped[catId] = { id: catId, name: cat, imgs: [] };
    grouped[catId].imgs.push(img);
  });

  const wrap = document.createElement('div');
  wrap.className = 'folders-grid';
  Object.values(grouped).forEach(folder => wrap.appendChild(FolderCard(folder)));
  return wrap;
}

function _buildEmpty(icon, text) {
  const div = document.createElement('div');
  div.className = 'proj-empty';
  const iconEl = document.createElement('div');
  iconEl.className = 'proj-empty-icon';
  iconEl.textContent = icon;
  const p = document.createElement('p');
  p.textContent = text;
  div.appendChild(iconEl);
  div.appendChild(p);
  return div;
}
