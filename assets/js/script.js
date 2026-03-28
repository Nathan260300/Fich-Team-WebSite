console.log(`%c© 2026 - FICH Team`, "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cFICH Team", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cFICH Team : communauté de joueurs passionnés, force, intelligence, charisme et honneur.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://fich-team.netlify.app", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log(`%cMade with 🕑 and 💖 by Nathan The Coder – Last update : 28/03/2026`,"background: #282c34; color: #c678dd; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

const DISCORD_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#8b9eff" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.034.055a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`;

const YT_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>`;

const PAGES = {
  home: {
    title: 'Accueil — FICH Team',
    render: () => `
      <section class="page" aria-label="Accueil">
        <div class="hero-section">
          <div class="hero-badge"><span class="badge-dot"></span>Communauté active</div>
          <h1 class="hero-title">
            <span class="title-line">FICH</span>
            <span class="title-line accent">TEAM</span>
          </h1>
          <p class="hero-sub">Force · Intelligence · Charisme · Honneur</p>
          <p class="hero-desc">Communauté de joueurs passionnés, matures et créatifs.<br>Build, redstone, RP et minijeux.</p>
          <div class="hero-actions">
            <a href="?p=join" data-page="join" class="btn btn-primary">Nous rejoindre →</a>
            <a href="?p=partners" data-page="partners" class="btn btn-ghost">Nos partenaires</a>
          </div>
        </div>
        <div class="cards-section">
          <div class="section-label">À PROPOS</div>
          <div class="cards-grid">
            <article class="card card--wide fade-in">
              <div class="card-accent-bar"></div>
              <div class="card-inner">
                <img src="assets/img/logo.png" alt="FICH Team" width="68" height="68" class="card-img">
                <div>
                  <h2 class="card-title">C'est quoi la FICH TEAM ?</h2>
                  <p class="card-text">La FICH TEAM est une équipe de joueurs unis par des valeurs de respect, d'entraide et de créativité. Une communauté soudée autour du jeu bien fait.</p>
                </div>
              </div>
            </article>
            <article class="card fade-in" style="--delay:.08s">
              <div class="card-accent-bar"></div>
              <div class="card-inner card-inner--col">
                <span class="card-emoji">📜</span>
                <div>
                  <h3 class="card-title">Les origines</h3>
                  <p class="card-text">Histoire et création de la FICH Team, ses fondateurs et ses premières activités.</p>
                </div>
              </div>
            </article>
            <article class="card fade-in" style="--delay:.16s">
              <div class="card-accent-bar"></div>
              <div class="card-inner card-inner--col">
                <div class="fich-letters">
                  <span><strong>F</strong>orce</span>
                  <span><strong>I</strong>ntelligence</span>
                  <span><strong>C</strong>harisme</span>
                  <span><strong>H</strong>onneur</span>
                </div>
              </div>
            </article>
            <article class="card fade-in" style="--delay:.24s">
              <div class="card-accent-bar"></div>
              <div class="card-inner card-inner--col">
                <span class="card-emoji">🎮</span>
                <div>
                  <h3 class="card-title">Qui ?</h3>
                  <p class="card-text">Joueurs passionnés :</p>
                  <ul class="card-tags"><li>Builders</li><li>Redstoners</li><li>RPistes</li></ul>
                </div>
              </div>
            </article>
            <article class="card fade-in" style="--delay:.32s">
              <div class="card-accent-bar"></div>
              <div class="card-inner card-inner--col">
                <span class="card-emoji">⚡</span>
                <div>
                  <h3 class="card-title">Pourquoi ?</h3>
                  <p class="card-text">Regrouper des personnes matures partageant des valeurs communes et le goût du jeu bien fait.</p>
                </div>
              </div>
            </article>
            <article class="card fade-in" style="--delay:.40s">
              <div class="card-accent-bar"></div>
              <div class="card-inner card-inner--col">
                <span class="card-emoji">🏗️</span>
                <div>
                  <h3 class="card-title">Activités</h3>
                  <p class="card-text">Build, redstone, RP, minijeux et événements communautaires.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>`
  },

  partners: {
    title: 'Partenaires — FICH Team',
    render: () => `
      <section class="page" aria-label="Partenaires">
        <div class="page-hero">
          <div class="hero-badge"><span class="badge-dot"></span>Créateurs soutenus</div>
          <h1 class="page-title">Nos <span class="accent">Partenaires</span></h1>
          <p class="page-desc">La FICH Team soutient ces créateurs de contenu YouTube passionnés.</p>
        </div>
        <div class="channels-grid" id="channels-grid">
          <div class="channels-loading">
            <span class="channels-loading-dot"></span>
            <span class="channels-loading-dot"></span>
            <span class="channels-loading-dot"></span>
          </div>
        </div>
      </section>`
  },

  projects: {
    title: 'Projets — FICH Team',
    render: () => `
      <section class="page" aria-label="Projets">
        <div class="page-hero">
          <div class="hero-badge"><span class="badge-dot"></span>Contenus de la FICH Team</div>
          <h1 class="page-title">Nos <span class="accent">Projets</span></h1>
          <p class="page-desc">Découvrez les créations visuelles et vidéos de la FICH Team.</p>
        </div>
        <div class="projects-page">
          <div class="proj-tabs" role="tablist" aria-label="Sections projets">
            <button class="proj-tab active" data-tab="photos" role="tab" aria-selected="true" aria-controls="tab-photos">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              Images
            </button>
            <button class="proj-tab" data-tab="videos" role="tab" aria-selected="false" aria-controls="tab-videos">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
              Vidéos
            </button>
          </div>
          <div id="tab-photos" class="proj-panel active" role="tabpanel">
            <div class="photo-grid" id="photo-grid">
              <div class="channels-loading" style="grid-column:1/-1">
                <span class="channels-loading-dot"></span>
                <span class="channels-loading-dot"></span>
                <span class="channels-loading-dot"></span>
              </div>
            </div>
          </div>
          <div id="tab-videos" class="proj-panel" role="tabpanel">
            <div class="video-grid" id="video-grid">
              <div class="channels-loading" style="grid-column:1/-1">
                <span class="channels-loading-dot"></span>
                <span class="channels-loading-dot"></span>
                <span class="channels-loading-dot"></span>
              </div>
            </div>
          </div>
        </div>
      </section>`
  },

  join: {
    title: 'Rejoindre — FICH Team',
    render: () => `
      <section class="page" aria-label="Rejoindre">
        <div class="page-hero">
          <div class="hero-badge"><span class="badge-dot"></span>Rejoins l'aventure</div>
          <h1 class="page-title">Nous <span class="accent">Rejoindre</span></h1>
          <p class="page-desc">Deux façons d'intégrer l'univers FICH, selon ton niveau d'implication.</p>
        </div>
        <div class="join-page">
          <div class="join-sections">
            <article class="join-section fade-in">
              <div class="join-section-accent"></div>
              <div class="join-section-header">
                <div class="join-section-num">01</div>
                <div class="join-section-titles">
                  <span class="join-section-tag">Communauté ouverte</span>
                  <h2 class="join-section-title">FICH Family</h2>
                </div>
              </div>
              <div class="join-section-body">
                <div class="discord-badge">${DISCORD_ICON}Serveur Discord communautaire</div>
                <p class="join-desc">La <strong>FICH Family</strong> est notre serveur Discord ouvert à tous. C'est le point d'entrée de l'univers FICH — un espace pour échanger, jouer et faire partie de la communauté avant tout engagement.</p>
                <p class="join-desc">Ce serveur sert aussi de pont vers nos futurs projets. Rejoindre la FICH Family, c'est la première étape pour intégrer un jour la FICH Team.</p>
                <a href="#" class="btn btn-primary">Rejoindre la FICH Family →</a>
              </div>
            </article>
            <article class="join-section fade-in" style="--delay:.12s">
              <div class="join-section-accent"></div>
              <div class="join-section-header">
                <div class="join-section-num">02</div>
                <div class="join-section-titles">
                  <span class="join-section-tag">Équipe principale — Accès restreint</span>
                  <h2 class="join-section-title">FICH Team</h2>
                </div>
              </div>
              <div class="join-section-body">
                <div class="discord-badge">${DISCORD_ICON}Serveur privé — sur candidature</div>
                <p class="join-desc">Intégrer la FICH Team, c'est rejoindre le cœur du projet. La sélection est exigeante — nous acceptons très peu de monde, alors ne sois pas découragé si tu n'es pas retenu.</p>
                <div class="section-label" style="margin-bottom:12px">PRÉREQUIS</div>
                <div class="join-requirements">
                  <div class="join-req"><span class="join-req-dot"></span><span>Avoir rejoint la FICH Family au préalable</span></div>
                  <div class="join-req"><span class="join-req-dot"></span><span>Être actif et impliqué dans la communauté</span></div>
                  <div class="join-req"><span class="join-req-dot"></span><span>Être mature et savoir discuter de manière chill</span></div>
                  <div class="join-req"><span class="join-req-dot"></span><span>Partager les valeurs FICH : Force, Intelligence, Charisme, Honneur</span></div>
                  <div class="join-req"><span class="join-req-dot"></span><span>Être passionné de gaming et de création</span></div>
                </div>
                <div class="join-info-box"><strong>Comment postuler ?</strong> Un salon dédié aux candidatures est disponible sur le serveur de la FICH Family. Tu peux t'y présenter de manière originale — montre qui tu es vraiment. Nous lisons chaque candidature avec attention.</div>
                <a href="#" class="btn btn-primary">Rejoindre la FICH Family d'abord →</a>
              </div>
            </article>
          </div>
        </div>
      </section>`
  },

  '404': {
    title: '404 — Page introuvable · FICH Team',
    render: () => `
      <section class="page" aria-label="Page introuvable">
        <div class="notfound-wrap">
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
              <a href="?p=home" data-page="home" class="btn btn-primary">← Retour à l'accueil</a>
              <a href="?p=partners" data-page="partners" class="btn btn-ghost">Partenaires</a>
            </div>
          </div>
          <div class="notfound-grid" aria-hidden="true"></div>
        </div>
      </section>`
  }
};

const DEFAULT_PAGE  = 'home';
const app           = document.getElementById('app');
let currentPageKey  = null;
let transitionTimer = null;
let channelsLoaded  = false;
let projectsLoaded  = false;
let activeModal     = null;
let _rawBadParam    = '';

function qp() { return new URLSearchParams(window.location.search); }

function buildUrl(p, extra = {}) {
  const u = new URLSearchParams();
  u.set('p', p);
  for (const [k, v] of Object.entries(extra)) u.set(k, v);
  return '?' + u.toString();
}

function getPageKey() {
  const p = qp().get('p');
  if (!p) return DEFAULT_PAGE;
  return PAGES[p] ? p : '404';
}

function showPage(pageKey, pushState = false) {
  if (pageKey === currentPageKey) return;
  const page = PAGES[pageKey] || PAGES[DEFAULT_PAGE];

  if (pushState) history.pushState({ p: pageKey }, page.title, buildUrl(pageKey));

  document.title = page.title;
  document.querySelectorAll('[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageKey);
  });

  const toggle = document.getElementById('nav-toggle');
  if (toggle) toggle.checked = false;

  if (transitionTimer) {
    clearTimeout(transitionTimer);
    transitionTimer = null;
    document.querySelectorAll('.page-flash').forEach(f => f.remove());
  }

  currentPageKey = pageKey;
  channelsLoaded = false;
  projectsLoaded = false;

  const current = app.firstElementChild;
  if (current) current.classList.remove('page-exit', 'page-enter');

  const flash = document.createElement('div');
  flash.className = 'page-flash';
  document.body.appendChild(flash);

  if (current) current.classList.add('page-exit');

  transitionTimer = setTimeout(() => {
    app.innerHTML = page.render();
    const target = app.firstElementChild;
    target.classList.add('page-enter');

    if (pageKey === 'partners') loadChannels();
    if (pageKey === 'projects') loadProjects();
    if (pageKey === '404') {
      const el = document.getElementById('notfound-param');
      if (el) el.textContent = _rawBadParam || qp().get('p') || '???';
    }

    window.scrollTo({ top: 0 });

    transitionTimer = setTimeout(() => {
      target.classList.remove('page-enter');
      flash.remove();
      transitionTimer = null;
    }, 420);
  }, 200);
}

document.getElementById('year').textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  document.querySelector('.site-header').classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

document.addEventListener('click', e => {
  const link = e.target.closest('a[data-page]');
  if (!link) return;
  e.preventDefault();
  closeModal(true);
  showPage(link.dataset.page, true);
});

window.addEventListener('popstate', e => {
  const state    = e.state || {};
  const pageKey  = state.p || getPageKey();
  const p        = qp();
  const videoId  = p.get('video');
  const photoIdx = p.get('photo');

  closeModal(true);
  showPage(pageKey, false);

  if (pageKey === 'projects' && (videoId || photoIdx !== null)) {
    waitForProjects().then(() => {
      if (videoId) _openVideoModal(videoId, false);
      else if (photoIdx !== null) _openPhotoModal(parseInt(photoIdx), false);
    });
  }
});

document.addEventListener('click', e => {
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
});

document.addEventListener('click', e => {
  const vidCard = e.target.closest('.video-card[data-vid-id]');
  if (vidCard) { _openVideoModal(vidCard.dataset.vidId); return; }
  const photoItem = e.target.closest('.photo-item[data-img-src]');
  if (photoItem) {
    const idx = [...document.querySelectorAll('.photo-item[data-img-src]')].indexOf(photoItem);
    _openPhotoModal(idx);
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.video-card[data-vid-id], .photo-item[data-img-src]');
  if (card) { e.preventDefault(); card.click(); }
});

function buildChannelCard(ch, i) {
  return `
    <article class="channel-card fade-in" style="--delay:${i * .12}s">
      <div class="channel-card-bg"></div>
      <div class="channel-avatar-wrap">
        <img src="${ch.avatar}" alt="${ch.name}" width="88" height="88" class="channel-avatar" loading="lazy">
        <div class="channel-avatar-ring"></div>
      </div>
      <div class="channel-info">
        <h2 class="channel-name">${ch.name}</h2>
        <p class="channel-desc">${ch.description}</p>
        <a href="${ch.url}" target="_blank" rel="noopener noreferrer" class="channel-btn">
          ${YT_ICON} Voir la chaîne
        </a>
      </div>
    </article>`;
}

async function loadChannels() {
  const grid = document.getElementById('channels-grid');
  if (!grid) return;
  if (channelsLoaded) return;
  try {
    const res  = await fetch('assets/data/channels.json');
    if (!res.ok) throw new Error();
    const data = await res.json();
    grid.innerHTML = data.length
      ? data.map(buildChannelCard).join('')
      : `<div class="channels-error"><span>🤝</span><p>Aucun partenaire pour l'instant.</p></div>`;
    channelsLoaded = true;
  } catch {
    grid.innerHTML = `<div class="channels-error"><span>⚠️</span><p>Impossible de charger les partenaires.</p><button onclick="channelsLoaded=false;loadChannels()" class="btn btn-ghost" style="margin-top:10px">Réessayer</button></div>`;
  }
}

function buildPhotoCard(img, i) {
  return `
    <div class="photo-item fade-in" style="--delay:${i * .07}s"
         data-img-src="${img.src}"
         role="button" tabindex="0" aria-label="Agrandir la photo">
      <img src="${img.src}" alt="Photo FICH Team" loading="lazy">
    </div>`;
}

function buildVideoCard(vid, i) {
  const thumb = vid.thumbnail || `https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`;
  return `
    <article class="video-card fade-in" style="--delay:${i * .1}s"
             data-vid-id="${vid.id}"
             data-vid-title="${vid.title || ''}"
             data-vid-creator="${vid.creator || ''}"
             role="button" tabindex="0" aria-label="Lire ${vid.title || 'vidéo'}">
      <div class="video-thumb">
        <img src="${thumb}" alt="${vid.title || 'Vidéo FICH Team'}" loading="lazy">
        <div class="video-play">
          <div class="video-play-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      </div>
      <div class="video-info">
        <p class="video-title">${vid.title || 'Sans titre'}</p>
        <p class="video-creator">${vid.creator || ''}</p>
      </div>
    </article>`;
}

async function loadProjects() {
  const photoGrid = document.getElementById('photo-grid');
  const videoGrid = document.getElementById('video-grid');
  if (!photoGrid && !videoGrid) return;
  if (projectsLoaded) return;
  try {
    const res  = await fetch('assets/data/projects.json');
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (photoGrid) {
      photoGrid.innerHTML = data.images && data.images.length
        ? data.images.map(buildPhotoCard).join('')
        : `<div class="proj-empty"><div class="proj-empty-icon">🖼️</div><p>Aucune image pour l'instant.</p></div>`;
    }
    if (videoGrid) {
      videoGrid.innerHTML = data.videos && data.videos.length
        ? data.videos.map(buildVideoCard).join('')
        : `<div class="proj-empty"><div class="proj-empty-icon">🎬</div><p>Aucune vidéo pour l'instant.</p></div>`;
    }
    projectsLoaded = true;
  } catch {
    const errHtml = `<div class="channels-error"><span>⚠️</span><p>Impossible de charger les projets.</p><button onclick="projectsLoaded=false;loadProjects()" class="btn btn-ghost" style="margin-top:10px">Réessayer</button></div>`;
    if (photoGrid) photoGrid.innerHTML = errHtml;
    if (videoGrid) videoGrid.innerHTML = errHtml;
  }
}

function waitForProjects() {
  return new Promise(resolve => {
    if (projectsLoaded) { resolve(); return; }
    let tries = 0;
    const t = setInterval(() => {
      if (projectsLoaded || ++tries > 160) { clearInterval(t); resolve(); }
    }, 50);
  });
}

function _openModal(html, pushParam = null) {
  closeModal(true);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="Fermer">✕</button>
      ${html}
    </div>`;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  activeModal = overlay;
  if (pushParam) {
    const u = qp();
    u.delete('video');
    u.delete('photo');
    u.set(pushParam[0], pushParam[1]);
    history.pushState({ p: 'projects', modal: pushParam }, document.title, '?' + u.toString());
  }
  overlay.querySelector('.modal-close').addEventListener('click', () => closeModal());
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
}

function closeModal(instant = false) {
  if (!activeModal) return;
  const el = activeModal;
  activeModal = null;
  document.body.style.overflow = '';
  el.querySelectorAll('iframe').forEach(f => { f.src = ''; });
  const p = qp();
  if (!instant && (p.has('video') || p.has('photo'))) history.back();
  if (instant) { el.remove(); return; }
  el.classList.add('closing');
  setTimeout(() => el.remove(), 200);
}

function _openVideoModal(id, push = true) {
  if (!id) return;
  const card    = document.querySelector(`.video-card[data-vid-id="${id}"]`);
  const title   = card?.dataset.vidTitle   || '';
  const creator = card?.dataset.vidCreator || '';
  _openModal(`
    <div class="modal-video-wrap">
      <iframe
        src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen loading="lazy" title="${title}">
      </iframe>
    </div>
    <div class="modal-video-info">
      <p class="modal-video-title">${title}</p>
      ${creator ? `<p class="modal-video-creator">par ${creator}</p>` : ''}
    </div>`, push ? ['video', id] : null);
}

function _openPhotoModal(idx, push = true) {
  const items = [...document.querySelectorAll('.photo-item[data-img-src]')];
  const item  = items[idx];
  if (!item) return;
  _openModal(`
    <div class="modal-photo-wrap">
      <img src="${item.dataset.imgSrc}" alt="Photo FICH Team">
    </div>`, push ? ['photo', idx] : null);
}

(function init() {
  const rawP     = qp().get('p');
  const videoId  = qp().get('video');
  const photoIdx = qp().get('photo');
  const pageKey  = getPageKey();

  if (rawP && !PAGES[rawP]) _rawBadParam = rawP;

  if (!rawP) {
    history.replaceState({ p: DEFAULT_PAGE }, PAGES[DEFAULT_PAGE].title, buildUrl(DEFAULT_PAGE));
  } else if (pageKey === '404') {
    history.replaceState({ p: '404' }, PAGES['404'].title, buildUrl(rawP));
  } else {
    const extra = {};
    if (videoId) extra.video = videoId;
    else if (photoIdx !== null) extra.photo = photoIdx;
    history.replaceState({ p: pageKey }, PAGES[pageKey].title, buildUrl(pageKey, extra));
  }

  currentPageKey = null;
  showPage(pageKey, false);

  if (pageKey === 'projects' && (videoId || photoIdx !== null)) {
    waitForProjects().then(() => {
      if (videoId) _openVideoModal(videoId, false);
      else if (photoIdx !== null) _openPhotoModal(parseInt(photoIdx), false);
    });
  }
})();