// ─── pages/join.js ─────────────────────────────────────────
// Rendu de la page Rejoindre (contenu statique).
// ────────────────────────────────────────────────────────────

import { DISCORD_ICON } from '../icons.js';

export const title = 'Rejoindre — FICH Team';

export function render() {
  const section = document.createElement('section');
  section.className = 'page';
  section.setAttribute('aria-label', 'Rejoindre');

  section.appendChild(_buildHero());
  section.appendChild(_buildJoinContent());
  return section;
}

// ── Builders DOM ──────────────────────────────────────────────

function _buildHero() {
  const div = document.createElement('div');
  div.className = 'page-hero';
  div.innerHTML = `
    <div class="hero-badge"><span class="badge-dot"></span>Rejoins l'aventure</div>
    <h1 class="page-title">Nous <span class="accent">Rejoindre</span></h1>
    <p class="page-desc">Deux façons d'intégrer l'univers FICH, selon ton niveau d'implication.</p>`;
  return div;
}

function _buildJoinContent() {
  const wrap = document.createElement('div');
  wrap.className = 'join-page';
  const sections = document.createElement('div');
  sections.className = 'join-sections';
  sections.appendChild(_buildFamilySection());
  sections.appendChild(_buildTeamSection());
  wrap.appendChild(sections);
  return wrap;
}

function _buildFamilySection() {
  const article = document.createElement('article');
  article.className = 'join-section fade-in';

  const badge = document.createElement('div');
  badge.className = 'discord-badge';
  badge.innerHTML = DISCORD_ICON;
  badge.appendChild(document.createTextNode('Serveur Discord communautaire'));

  article.innerHTML = `
    <div class="join-section-accent"></div>
    <div class="join-section-header">
      <div class="join-section-num">01</div>
      <div class="join-section-titles">
        <span class="join-section-tag">Communauté ouverte</span>
        <h2 class="join-section-title">FICH Family</h2>
      </div>
    </div>`;

  const body = document.createElement('div');
  body.className = 'join-section-body';
  body.appendChild(badge);

  const p1 = document.createElement('p');
  p1.className = 'join-desc';
  p1.innerHTML = 'La <strong>FICH Family</strong> est notre serveur Discord ouvert à tous. C\'est le point d\'entrée de l\'univers FICH — un espace pour échanger, jouer et faire partie de la communauté avant tout engagement.';

  const p2 = document.createElement('p');
  p2.className = 'join-desc';
  p2.textContent = 'Ce serveur sert aussi de pont vers nos futurs projets. Rejoindre la FICH Family, c\'est la première étape pour intégrer un jour la FICH Team.';

  const link = document.createElement('a');
  link.href = 'https://discord.gg/ACRZ4zK2uD';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'btn btn-primary';
  link.textContent = 'Rejoindre la FICH Family →';

  body.appendChild(p1);
  body.appendChild(p2);
  body.appendChild(link);
  article.appendChild(body);
  return article;
}

function _buildTeamSection() {
  const article = document.createElement('article');
  article.className = 'join-section fade-in';
  article.style.setProperty('--delay', '.12s');

  const badge = document.createElement('div');
  badge.className = 'discord-badge';
  badge.innerHTML = DISCORD_ICON;
  badge.appendChild(document.createTextNode('Serveur privé — sur candidature'));

  article.innerHTML = `
    <div class="join-section-accent"></div>
    <div class="join-section-header">
      <div class="join-section-num">02</div>
      <div class="join-section-titles">
        <span class="join-section-tag">Équipe principale — Accès restreint</span>
        <h2 class="join-section-title">FICH Team</h2>
      </div>
    </div>`;

  const body = document.createElement('div');
  body.className = 'join-section-body';
  body.appendChild(badge);

  const desc = document.createElement('p');
  desc.className = 'join-desc';
  desc.textContent = 'Intégrer la FICH Team, c\'est rejoindre le cœur du projet. La sélection est exigeante — nous acceptons très peu de monde, alors ne sois pas découragé si tu n\'es pas retenu.';
  body.appendChild(desc);

  const reqLabel = document.createElement('div');
  reqLabel.className = 'section-label';
  reqLabel.style.marginBottom = '12px';
  reqLabel.textContent = 'PRÉREQUIS';
  body.appendChild(reqLabel);

  const requirements = [
    'Avoir rejoint la FICH Family au préalable',
    'Être actif et impliqué dans la communauté',
    'Être mature et savoir discuter de manière chill',
    'Partager les valeurs FICH : Force, Intelligence, Charisme, Honneur',
    'Être passionné de gaming et de création',
  ];

  const reqList = document.createElement('div');
  reqList.className = 'join-requirements';
  requirements.forEach(text => {
    const item = document.createElement('div');
    item.className = 'join-req';
    const dot = document.createElement('span');
    dot.className = 'join-req-dot';
    const label = document.createElement('span');
    label.textContent = text;
    item.appendChild(dot);
    item.appendChild(label);
    reqList.appendChild(item);
  });
  body.appendChild(reqList);

  const infoBox = document.createElement('div');
  infoBox.className = 'join-info-box';
  infoBox.innerHTML = '<strong>Comment postuler ?</strong> Un salon dédié aux candidatures est disponible sur le serveur de la FICH Family. Tu peux t\'y présenter de manière originale — montre qui tu es vraiment. Nous lisons chaque candidature avec attention.';
  body.appendChild(infoBox);

  const link = document.createElement('a');
  link.href = 'https://discord.gg/ACRZ4zK2uD';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'btn btn-primary';
  link.textContent = 'Rejoindre la FICH Family d\'abord →';
  body.appendChild(link);

  article.appendChild(body);
  return article;
}
