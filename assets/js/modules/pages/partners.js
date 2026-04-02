// ─── pages/partners.js ─────────────────────────────────────
// Rendu et chargement de la page Partenaires.
// ────────────────────────────────────────────────────────────

import { setLoaded, isLoaded } from '../state.js';
import { clearElement } from '../utils.js';
import { ChannelCard, LoadingSpinner, ErrorMessage } from '../components.js';

export const title = 'Partenaires — FICH Team';

export function render() {
  const section = document.createElement('section');
  section.className = 'page';
  section.setAttribute('aria-label', 'Partenaires');

  section.appendChild(_buildHero());
  section.appendChild(_buildGrid());
  return section;
}

export function onMount() {
  loadChannels();
}

// ── Loader ────────────────────────────────────────────────────

async function loadChannels() {
  const grid = document.getElementById('channels-grid');
  if (!grid || isLoaded('channels')) return;

  try {
    const res  = await fetch('assets/data/channels.json');
    if (!res.ok) throw new Error('Réponse réseau invalide');
    const data = await res.json();

    clearElement(grid);
    if (!data.length) {
      const empty = document.createElement('div');
      empty.className = 'channels-error';
      empty.innerHTML = '<span>🤝</span><p>Aucun partenaire pour l\'instant.</p>';
      grid.appendChild(empty);
      return;
    }
    data.forEach((ch, i) => grid.appendChild(ChannelCard(ch, i)));
    setLoaded('channels');
  } catch (err) {
    console.error('[partners] Erreur chargement chaînes :', err);
    clearElement(grid);
    grid.appendChild(ErrorMessage('Impossible de charger les partenaires.', () => {
      setLoaded('channels', false); // permet un nouveau fetch
      // Réessai
      clearElement(grid);
      grid.appendChild(LoadingSpinner());
      loadChannels();
    }));
  }
}

// ── Builders DOM ──────────────────────────────────────────────

function _buildHero() {
  const div = document.createElement('div');
  div.className = 'page-hero';
  div.innerHTML = `
    <div class="hero-badge"><span class="badge-dot"></span>Créateurs soutenus</div>
    <h1 class="page-title">Nos <span class="accent">Partenaires</span></h1>
    <p class="page-desc">La FICH Team soutient ces créateurs de contenu YouTube passionnés.</p>`;
  return div;
}

function _buildGrid() {
  const grid = document.createElement('div');
  grid.className = 'channels-grid';
  grid.id = 'channels-grid';
  grid.appendChild(LoadingSpinner());
  return grid;
}
