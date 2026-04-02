import { DISCORD_ICON, YT_ICON } from './icons.js';

/**
 * @returns {HTMLElement}
 */
export function LoadingSpinner() {
  const wrap = document.createElement('div');
  wrap.className = 'channels-loading';
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'channels-loading-dot';
    wrap.appendChild(dot);
  }
  return wrap;
}

/**
 * @param {string}   message
 * @param {Function} onRetry
 * @returns {HTMLElement}
 */
export function ErrorMessage(message, onRetry) {
  const wrap = document.createElement('div');
  wrap.className = 'channels-error';

  const icon = document.createElement('span');
  icon.textContent = '⚠️';

  const p = document.createElement('p');
  p.textContent = message;

  wrap.appendChild(icon);
  wrap.appendChild(p);

  if (onRetry) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost';
    btn.textContent = 'Réessayer';
    btn.style.marginTop = '10px';
    btn.addEventListener('click', onRetry);
    wrap.appendChild(btn);
  }

  return wrap;
}

/**
 * @param {{ id, title, short, full, emoji, wide, logo, special }} card
 * @param {number} index
 * @returns {HTMLElement}
 */
export function HomeCard(card, index) {
  const article = document.createElement('article');
  article.className = `card${card.wide ? ' card--wide' : ''} fade-in`;
  article.style.setProperty('--delay', `${(index * 0.08).toFixed(2)}s`);

  if (card.full) {
    article.dataset.cardId = card.id;
    article.setAttribute('role', 'button');
    article.setAttribute('tabindex', '0');
    article.style.cursor = 'pointer';
  }

  const accentBar = document.createElement('div');
  accentBar.className = 'card-accent-bar';
  article.appendChild(accentBar);
  article.appendChild(_buildHomeCardInner(card));

  if (card.full) {
    const hint = document.createElement('div');
    hint.className = 'card-clickable-hint';
    const readMore = document.createElement('span');
    readMore.className = 'card-read-more';
    readMore.textContent = 'Lire la suite →';
    hint.appendChild(readMore);
    article.appendChild(hint);
  }

  return article;
}

function _buildHomeCardInner(card) {
  const inner = document.createElement('div');

  if (card.special === 'fich-letters') {
    inner.className = 'card-inner card-inner--col';
    const letters = document.createElement('div');
    letters.className = 'fich-letters';
    [['F', 'orce'], ['I', 'ntelligence'], ['C', 'harisme'], ['H', 'onneur']].forEach(([letter, rest]) => {
      const span = document.createElement('span');
      const strong = document.createElement('strong');
      strong.textContent = letter;
      span.appendChild(strong);
      span.appendChild(document.createTextNode(rest));
      letters.appendChild(span);
    });
    inner.appendChild(letters);

  } else if (card.wide && card.logo) {
    inner.className = 'card-inner';
    const img = document.createElement('img');
    img.src = 'assets/img/logo.png';
    img.alt = 'FICH Team';
    img.width = 68; img.height = 68;
    img.className = 'card-img';

    const textWrap = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.className = 'card-title';
    h2.textContent = card.title;
    const p = document.createElement('p');
    p.className = 'card-text';
    p.textContent = card.short;
    textWrap.appendChild(h2);
    textWrap.appendChild(p);

    inner.appendChild(img);
    inner.appendChild(textWrap);

  } else {
    inner.className = 'card-inner card-inner--col';
    const emoji = document.createElement('span');
    emoji.className = 'card-emoji';
    emoji.textContent = card.emoji;

    const textWrap = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.className = 'card-title';
    h3.textContent = card.title;
    const p = document.createElement('p');
    p.className = 'card-text';
    p.textContent = card.short;
    textWrap.appendChild(h3);
    textWrap.appendChild(p);

    inner.appendChild(emoji);
    inner.appendChild(textWrap);
  }

  return inner;
}

/**
 * @param {{ pseudo, avatar }} member
 * @param {number} index
 * @returns {HTMLElement}
 */
export function MemberCard(member, index) {
  const div = document.createElement('div');
  div.className = 'member-card fade-in';
  div.style.setProperty('--delay', `${(index * 0.07).toFixed(2)}s`);
  div.dataset.memberIdx = index;
  div.setAttribute('role', 'button');
  div.setAttribute('tabindex', '0');
  div.setAttribute('aria-label', `Voir le profil de ${member.pseudo}`);

  const avatarWrap = document.createElement('div');
  avatarWrap.className = 'member-avatar-wrap';
  const img = document.createElement('img');
  img.src = member.avatar;
  img.alt = member.pseudo;
  img.loading = 'lazy';
  img.className = 'member-avatar';
  avatarWrap.appendChild(img);

  const pseudo = document.createElement('span');
  pseudo.className = 'member-pseudo';
  pseudo.textContent = member.pseudo;

  div.appendChild(avatarWrap);
  div.appendChild(pseudo);
  return div;
}

/**
 * @param {{ name, avatar, description, url }} channel
 * @param {number} index
 * @returns {HTMLElement}
 */
export function ChannelCard(channel, index) {
  const article = document.createElement('article');
  article.className = 'channel-card fade-in';
  article.style.setProperty('--delay', `${(index * 0.12).toFixed(2)}s`);

  const bg = document.createElement('div');
  bg.className = 'channel-card-bg';

  const avatarWrap = document.createElement('div');
  avatarWrap.className = 'channel-avatar-wrap';
  const img = document.createElement('img');
  img.src = channel.avatar;
  img.alt = channel.name;
  img.width = 88; img.height = 88;
  img.className = 'channel-avatar';
  img.loading = 'lazy';
  const ring = document.createElement('div');
  ring.className = 'channel-avatar-ring';
  avatarWrap.appendChild(img);
  avatarWrap.appendChild(ring);

  const info = document.createElement('div');
  info.className = 'channel-info';

  const h2 = document.createElement('h2');
  h2.className = 'channel-name';
  h2.textContent = channel.name;

  const desc = document.createElement('p');
  desc.className = 'channel-desc';
  desc.textContent = channel.description;

  const link = document.createElement('a');
  link.href = channel.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'channel-btn';
  link.innerHTML = YT_ICON;
  link.appendChild(document.createTextNode(' Voir la chaîne'));

  info.appendChild(h2);
  info.appendChild(desc);
  info.appendChild(link);

  article.appendChild(bg);
  article.appendChild(avatarWrap);
  article.appendChild(info);
  return article;
}

/**
 * @param {{ id, name, imgs: Array<{src}> }} folder
 * @returns {HTMLElement}
 */
export function FolderCard(folder) {
  const cover  = folder.imgs[folder.imgs.length - 1].src;
  const srcs   = folder.imgs.map(i => i.src);

  const div = document.createElement('div');
  div.className = 'folder-card fade-in';
  div.dataset.folderId   = folder.id;
  div.dataset.folderName = folder.name;
  div.dataset.folderSrcs = JSON.stringify(srcs);
  div.setAttribute('role', 'button');
  div.setAttribute('tabindex', '0');
  div.setAttribute('aria-label', `Ouvrir ${folder.name}`);

  const coverWrap = document.createElement('div');
  coverWrap.className = 'folder-card-cover';
  const img = document.createElement('img');
  img.src = cover;
  img.alt = folder.name;
  img.loading = 'lazy';

  const overlay = document.createElement('div');
  overlay.className = 'folder-card-overlay';
  const count = document.createElement('span');
  count.className = 'folder-card-count';
  count.textContent = `${srcs.length} image${srcs.length > 1 ? 's' : ''}`;
  overlay.appendChild(count);

  coverWrap.appendChild(img);
  coverWrap.appendChild(overlay);

  const infoBar = document.createElement('div');
  infoBar.className = 'folder-card-info';
  const icon = document.createElement('span');
  icon.className = 'folder-card-icon';
  icon.textContent = '📁';
  const name = document.createElement('span');
  name.className = 'folder-card-name';
  name.textContent = folder.name;
  infoBar.appendChild(icon);
  infoBar.appendChild(name);

  div.appendChild(coverWrap);
  div.appendChild(infoBar);
  return div;
}

/**
 * @param {string} src
 * @param {number} index
 * @param {string} [folderId]
 * @param {string[]} [folderSrcs]
 * @returns {HTMLElement}
 */
export function PhotoItem(src, index, folderId, folderSrcs) {
  const div = document.createElement('div');
  div.className = 'photo-item fade-in';
  div.style.setProperty('--delay', `${(index * 0.04).toFixed(2)}s`);
  div.dataset.imgSrc = src;
  div.dataset.imgIdx = index;
  if (folderId)   div.dataset.folderId   = folderId;
  if (folderSrcs) div.dataset.folderSrcs = JSON.stringify(folderSrcs);
  div.setAttribute('role', 'button');
  div.setAttribute('tabindex', '0');
  div.setAttribute('aria-label', 'Agrandir la photo');

  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Photo FICH Team';
  img.loading = 'lazy';
  div.appendChild(img);
  return div;
}

/**
 * @param {{ id, title, creator, thumbnail }} vid
 * @param {number} index
 * @returns {HTMLElement}
 */
export function VideoCard(vid, index) {
  const thumb = vid.thumbnail || `https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`;

  const article = document.createElement('article');
  article.className = 'video-card fade-in';
  article.style.setProperty('--delay', `${(index * 0.1).toFixed(2)}s`);
  article.dataset.vidId      = vid.id;
  article.dataset.vidTitle   = vid.title   || '';
  article.dataset.vidCreator = vid.creator || '';
  article.setAttribute('role', 'button');
  article.setAttribute('tabindex', '0');
  article.setAttribute('aria-label', `Lire ${vid.title || 'vidéo'}`);

  const thumbWrap = document.createElement('div');
  thumbWrap.className = 'video-thumb';
  const img = document.createElement('img');
  img.src = thumb;
  img.alt = vid.title || 'Vidéo FICH Team';
  img.loading = 'lazy';

  const playWrap = document.createElement('div');
  playWrap.className = 'video-play';
  const playBtn = document.createElement('div');
  playBtn.className = 'video-play-btn';
  playBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  playWrap.appendChild(playBtn);

  thumbWrap.appendChild(img);
  thumbWrap.appendChild(playWrap);

  const infoWrap = document.createElement('div');
  infoWrap.className = 'video-info';
  const title = document.createElement('p');
  title.className = 'video-title';
  title.textContent = vid.title || 'Sans titre';
  const creator = document.createElement('p');
  creator.className = 'video-creator';
  creator.textContent = vid.creator || '';
  infoWrap.appendChild(title);
  infoWrap.appendChild(creator);

  article.appendChild(thumbWrap);
  article.appendChild(infoWrap);
  return article;
}