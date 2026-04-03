import { PhotoItem } from '../components.js';
import { textToHtml } from '../utils.js';

export function buildVideoContent(videoId) {
  const card    = document.querySelector(`.video-card[data-vid-id="${videoId}"]`);
  const title   = card?.dataset.vidTitle   || '';
  const creator = card?.dataset.vidCreator || '';

  const wrap   = _el('div', 'modal-video-wrap');
  const iframe = document.createElement('iframe');
  iframe.src             = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`;
  iframe.allow           = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  iframe.loading         = 'lazy';
  iframe.title           = title;
  wrap.appendChild(iframe);

  const info    = _el('div', 'modal-video-info');
  const titleEl = _text('p', 'modal-video-title', title);
  info.appendChild(titleEl);
  if (creator) info.appendChild(_text('p', 'modal-video-creator', `par ${creator}`));

  return _wrap(wrap, info);
}

export function buildPhotoContent(src, alt = 'Photo FICH Team') {
  const wrap = _el('div', 'modal-photo-wrap');
  const img  = document.createElement('img');
  img.src = src;
  img.alt = alt;
  wrap.appendChild(img);
  return wrap;
}

export function buildFolderContent(folderId, name, srcs) {
  const root   = _el('div', 'folder-modal');
  root.appendChild(_buildFolderHeader(name, srcs.length));
  root.appendChild(_buildFolderGrid(folderId, srcs));
  return root;
}

export function buildFolderImageContent(folderId, name, srcs, imgIdx) {
  const photo  = buildPhotoContent(srcs[imgIdx], name);
  const footer = buildNavFooter({
    label:    `📁 ${name}`,
    current:  imgIdx,
    total:    srcs.length,
    prevAttr: { 'data-nav-img': imgIdx - 1, 'data-folder-id': folderId },
    nextAttr: { 'data-nav-img': imgIdx + 1, 'data-folder-id': folderId },
  });
  return _wrap(photo, footer);
}

export function buildMemberContent(m, idx, total) {
  const banner    = _el('div', 'member-modal-banner');
  const bannerImg = document.createElement('img');
  bannerImg.src   = m.banner;
  bannerImg.alt   = `Bannière ${m.pseudo}`;
  banner.appendChild(bannerImg);

  const body       = _el('div', 'member-modal-body');
  const avatarWrap = _el('div', 'member-modal-avatar-wrap');
  const avatarImg  = document.createElement('img');
  avatarImg.src       = m.avatar;
  avatarImg.alt       = m.pseudo;
  avatarImg.className = 'member-modal-avatar';
  avatarWrap.appendChild(avatarImg);

  body.appendChild(avatarWrap);
  body.appendChild(_text('h2', 'member-modal-name', m.pseudo));

  if (m.description) {
    const desc   = _el('p', 'member-modal-desc');
    desc.innerHTML = m.description.replace(/\n/g, '<br>');
    body.appendChild(desc);
  }

  body.appendChild(buildNavFooter({
    current:  idx,
    total,
    prevAttr: { 'data-nav-member': idx - 1 },
    nextAttr: { 'data-nav-member': idx + 1 },
  }));

  return _wrap(banner, body);
}

export function buildCardContent(card) {
  const root   = _el('div', 'home-card-modal');
  const header = _el('div', 'home-card-modal-header');

  if (card.emoji) header.appendChild(_text('span', 'home-card-modal-emoji', card.emoji));
  header.appendChild(_text('h2', 'home-card-modal-title', card.title));

  const body = _el('div', 'home-card-modal-body');
  const p    = document.createElement('p');
  p.innerHTML = textToHtml(card.full);
  body.appendChild(p);

  root.appendChild(header);
  root.appendChild(body);
  return root;
}

export function buildNavFooter({ label, current, total, prevAttr, nextAttr }) {
  const footer = _el('div', 'modal-img-footer');

  if (label) footer.appendChild(_text('span', 'modal-img-category', label));

  const nav     = _el('div', 'modal-nav');
  const prevBtn = _navBtn('←', current <= 0, prevAttr);
  const counter = _text('span', 'modal-nav-counter', `${current + 1} / ${total}`);
  const nextBtn = _navBtn('→', current >= total - 1, nextAttr);

  nav.appendChild(prevBtn);
  nav.appendChild(counter);
  nav.appendChild(nextBtn);

  footer.appendChild(nav);
  return footer;
}

function _buildFolderHeader(name, count) {
  const header   = _el('div', 'folder-modal-header');
  const icon     = _text('span', '', '📁');
  const title    = _text('h2', 'folder-modal-title', name);
  const countEl  = _text('span', 'photo-folder-count', `${count} image${count > 1 ? 's' : ''}`);
  header.appendChild(icon);
  header.appendChild(title);
  header.appendChild(countEl);
  return header;
}

function _buildFolderGrid(folderId, srcs) {
  const grid = _el('div', 'photo-grid folder-modal-grid');
  grid.dataset.folderSrcs = JSON.stringify(srcs);
  srcs.forEach((src, i) => grid.appendChild(PhotoItem(src, i, folderId, srcs)));
  return grid;
}

function _navBtn(label, disabled, attrs = {}) {
  const btn = _el('button', 'modal-nav-btn');
  btn.textContent = label;
  if (disabled) btn.disabled = true;
  for (const [k, v] of Object.entries(attrs)) btn.dataset[_camel(k)] = v;
  return btn;
}

function _camel(attr) {
  return attr.replace(/^data-/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function _el(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function _text(tag, className, text) {
  const el = _el(tag, className);
  el.textContent = text;
  return el;
}

function _wrap(...children) {
  const div = document.createElement('div');
  children.forEach(c => div.appendChild(c));
  return div;
}
