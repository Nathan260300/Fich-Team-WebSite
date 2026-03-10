console.log(`%c© 2026 - FICH Team`, "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cFICH Team", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cFICH Team : communauté de joueurs passionnés, force, intelligence, charisme et honneur.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://fich-team.netlify.app", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log(`%cMade with 🕑 and 💖 by Nathan The Coder – Last update : 10/03/2026`,"background: #282c34; color: #c678dd; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

document.getElementById('year').textContent = new Date().getFullYear();

const YT_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>`;

function buildChannelCard(channel, index) {
  return `
    <article class="channel-card fade-in" style="--delay:${index * 0.12}s">
      <div class="channel-card-bg"></div>
      <div class="channel-avatar-wrap">
        <img src="${channel.avatar}" alt="${channel.name}" width="96" height="96" class="channel-avatar">
        <div class="channel-avatar-ring"></div>
      </div>
      <div class="channel-info">
        <h2 class="channel-name">${channel.name}</h2>
        <p class="channel-desc">${channel.description}</p>
        <a href="${channel.url}" target="_blank" rel="noopener noreferrer" class="channel-btn">
          ${YT_ICON} Voir la chaîne
        </a>
      </div>
    </article>`;
}

let channelsLoaded = false;

async function loadChannels() {
  if (channelsLoaded) return;
  const grid = document.getElementById('channels-grid');
  if (!grid) return;

  try {
    const res  = await fetch('assets/data/channels.json');
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();

    grid.innerHTML = data.map((ch, i) => buildChannelCard(ch, i)).join('');
    channelsLoaded = true;
  } catch (err) {
    grid.innerHTML = `
      <div class="channels-error">
        <span>⚠️</span>
        <p>Impossible de charger les chaînes.</p>
        <button onclick="channelsLoaded=false;loadChannels()" class="btn btn-ghost" style="margin-top:12px">Réessayer</button>
      </div>`;
    console.error('channels.json load error:', err);
  }
}

const PAGES = {
  home:     { id: 'page-home',     title: 'Accueil — FICH Team' },
  channels: { id: 'page-channels', title: 'Chaînes Soutenues — FICH Team' },
  join:     { id: 'page-join',     title: 'Rejoindre — FICH Team' },
  projects: { id: 'page-projects', title: 'Projets — FICH Team' },
  '404':    { id: 'page-404',      title: '404 — Page introuvable · FICH Team' },
};

const DEFAULT_PAGE = 'home';

function getPageParam() {
  const params = new URLSearchParams(window.location.search);
  const p = params.get('page');
  if (!p) return DEFAULT_PAGE;
  return PAGES[p] ? p : '404';
}

let _rawBadParam = '';

let isTransitioning = false;

function showPage(pageKey, pushState = false) {
  if (isTransitioning) return;
  const page = PAGES[pageKey] || PAGES[DEFAULT_PAGE];

  if (pushState) {
    const url = `?page=${pageKey}`;
    history.pushState({ page: pageKey }, page.title, url);
  }
  document.title = page.title;
  document.querySelectorAll('[data-page]').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageKey);
  });
  const toggle = document.getElementById('nav-toggle');
  if (toggle) toggle.checked = false;

  const current = document.querySelector('.page:not([hidden])');
  const target  = document.getElementById(page.id);
  if (!target || target === current) return;

  isTransitioning = true;

  const flash = document.createElement('div');
  flash.className = 'page-flash';
  document.body.appendChild(flash);

  if (current) {
    current.classList.add('page-exit');
  }

  setTimeout(() => {
    if (current) {
      current.classList.remove('page-exit');
      current.hidden = true;
      current.setAttribute('aria-hidden', 'true');
    }

    target.hidden = false;
    target.setAttribute('aria-hidden', 'false');
    target.classList.add('page-enter');

    if (pageKey === 'channels') loadChannels();

    if (pageKey === '404') {
      const el = document.getElementById('notfound-param');
      if (el) el.textContent = _rawBadParam || new URLSearchParams(window.location.search).get('page') || '???';
    }

    target.querySelectorAll('.fade-in').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });

    window.scrollTo({ top: 0 });
    setTimeout(() => {
      target.classList.remove('page-enter');
      flash.remove();
      isTransitioning = false;
    }, 420);

  }, 200);
}

document.addEventListener('click', function(e) {
  const link = e.target.closest('a[data-page]');
  if (!link) return;
  e.preventDefault();
  const pageKey = link.dataset.page;
  showPage(pageKey, true);
});

window.addEventListener('popstate', function(e) {
  const pageKey = e.state?.page || getPageParam();
  showPage(pageKey, false);
});

(function init() {
  const rawParam = new URLSearchParams(window.location.search).get('page');
  const pageKey  = getPageParam();

  if (rawParam && !PAGES[rawParam]) {
    _rawBadParam = rawParam;
  }

  if (!rawParam) {
    history.replaceState({ page: DEFAULT_PAGE }, PAGES[DEFAULT_PAGE].title, '?page=home');
  } else if (pageKey === '404') {
    history.replaceState({ page: '404' }, PAGES['404'].title, `?page=${rawParam}`);
  } else {
    history.replaceState({ page: pageKey }, PAGES[pageKey].title, `?page=${pageKey}`);
  }

  showPage(pageKey, false);
})();