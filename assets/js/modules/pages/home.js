import { getState, setState, setLoaded, isLoaded } from '../state.js';
import { waitUntil, clearElement } from '../utils.js';
import { HomeCard, MemberCard, LoadingSpinner, ErrorMessage } from '../components.js';

export const title = 'Accueil — FICH Team';

export function render() {
  const section = document.createElement('section');
  section.className = 'page';
  section.setAttribute('aria-label', 'Accueil');

  section.appendChild(_buildHero());
  section.appendChild(_buildCardsSection());
  section.appendChild(_buildMembersSection());
  return section;
}

export function onMount() {
  loadHome();
  loadMembers();
}

export function waitForHome() {
  return waitUntil(() => isLoaded('home'));
}

export function waitForMembers() {
  return waitUntil(() => isLoaded('members'));
}

async function loadHome() {
  const grid = document.getElementById('home-cards-grid');
  if (!grid || isLoaded('home')) return;

  try {
    const res  = await fetch('assets/data/home.json');
    if (!res.ok) throw new Error('Réponse réseau invalide');
    const data = await res.json();

    setState('homeCards', data.cards);
    clearElement(grid);
    data.cards.forEach((card, i) => grid.appendChild(HomeCard(card, i)));
    setLoaded('home');
  } catch (err) {
    console.error('[home] Erreur chargement cards :', err);
    clearElement(grid);
  }
}

async function loadMembers() {
  const grid = document.getElementById('members-grid');
  if (!grid || isLoaded('members')) return;

  try {
    const res  = await fetch('assets/data/members.json');
    if (!res.ok) throw new Error('Réponse réseau invalide');
    const data = await res.json();
    if (!data.length) { clearElement(grid); return; }

    clearElement(grid);
    data.forEach((member, i) => grid.appendChild(MemberCard(member, i)));
    grid.dataset.members = JSON.stringify(data);
    setLoaded('members');
  } catch (err) {
    console.error('[home] Erreur chargement membres :', err);
    clearElement(grid);
  }
}

function _buildHero() {
  const div = document.createElement('div');
  div.className = 'hero-section';
  div.innerHTML = `
    <div class="hero-badge"><span class="badge-dot"></span>Communauté active</div>
    <h1 class="hero-title">
      <span class="title-line">FICH</span>
      <span class="title-line accent">TEAM</span>
    </h1>
    <p class="hero-sub">Force · Intelligence · Charisme · Honneur</p>
    <p class="hero-desc">Communauté de joueurs passionnés, matures et créatifs.<br>Build, redstone, RP et minijeux.</p>
    <div class="hero-actions">
      <a href="?p=join"     data-page="join"     class="btn btn-primary">Nous rejoindre →</a>
      <a href="?p=partners" data-page="partners" class="btn btn-ghost">Nos partenaires</a>
      <a href="?p=projects" data-page="projects" class="btn btn-ghost">Nos projets</a>
    </div>`;
  return div;
}

function _buildCardsSection() {
  const section = document.createElement('div');
  section.className = 'cards-section';

  const label = document.createElement('div');
  label.className = 'section-label';
  label.textContent = 'À PROPOS';

  const grid = document.createElement('div');
  grid.className = 'cards-grid';
  grid.id = 'home-cards-grid';
  grid.appendChild(LoadingSpinner());
  grid.firstChild.style.gridColumn = '1 / -1';

  section.appendChild(label);
  section.appendChild(grid);
  return section;
}

function _buildMembersSection() {
  const section = document.createElement('div');
  section.className = 'members-section';

  const label = document.createElement('div');
  label.className = 'section-label';
  label.textContent = 'QUI ?';

  const grid = document.createElement('div');
  grid.className = 'members-grid';
  grid.id = 'members-grid';
  grid.appendChild(LoadingSpinner());

  section.appendChild(label);
  section.appendChild(grid);
  return section;
}