import { getState } from '../state.js';

export const title = '404 — Page introuvable · FICH Team';

export function render() {
  const section = document.createElement('section');
  section.className = 'page';
  section.setAttribute('aria-label', 'Page introuvable');
  section.appendChild(_buildContent());
  return section;
}

export function onMount() {
  const el = document.getElementById('notfound-param');
  if (el) {
    const raw = getState('rawBadParam');
    el.textContent = raw || new URLSearchParams(window.location.search).get('p') || '???';
  }
}

function _buildContent() {
  const wrap = document.createElement('div');
  wrap.className = 'notfound-wrap';
  wrap.innerHTML = `
    <div class="notfound-glitch-wrap" aria-hidden="true">
      <span class="notfound-num">404</span>
      <span class="notfound-num glitch-1">404</span>
      <span class="notfound-num glitch-2">404</span>
    </div>
    <div class="notfound-scanlines" aria-hidden="true"></div>
    <div class="notfound-content">
      <div class="hero-badge" style="margin:0 auto 20px;color:#ff6b84;background:rgba(255,77,109,.09);border-color:rgba(255,77,109,.18);">
        <span class="badge-dot" style="background:#ff4d6d;box-shadow:0 0 7px #ff4d6d"></span>
        Erreur système
      </div>
      <h1 class="notfound-title">Page introuvable</h1>
      <p class="notfound-code">
        <span class="notfound-prompt">$</span>
        <span>GET /?p=<span id="notfound-param">???</span></span>
        <span class="notfound-cursor">█</span>
      </p>
      <p class="notfound-desc">Cette page n'existe pas ou a été déplacée.<br>Vérifie l'URL ou retourne à l'accueil.</p>
      <div class="notfound-actions">
        <a href="?p=home"     data-page="home"     class="btn btn-primary">← Retour à l'accueil</a>
        <a href="?p=partners" data-page="partners" class="btn btn-ghost">Partenaires</a>
      </div>
    </div>
    <div class="notfound-grid" aria-hidden="true"></div>`;
  return wrap;
}
