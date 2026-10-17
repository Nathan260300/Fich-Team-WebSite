const ZONE = 'Europe/Paris';
const STORAGE_KEY = 'fich-season-preview';
const SEASONS = ['halloween', 'noel', 'avril'];

const THEME_COLORS = {
  halloween: '#ff7a1a',
  noel: '#e8c55a',
  avril: '#ff7ab8',
};

const FAVICONS = {
  halloween: '🎃',
  noel: '🎄',
  avril: '🐟',
};

const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function parisParts(date) {
  const parts = {};
  for (const { type, value } of formatter.formatToParts(date)) parts[type] = Number(value);
  return { y: parts.year, m: parts.month, d: parts.day };
}

function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
}

function readPreview() {
  let stored = {};
  try {
    stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    stored = {};
  }

  let params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    return stored;
  }

  const theme = params.get('theme');
  const date = params.get('date');
  let next = stored;

  if (theme === 'reset' || date === 'reset') {
    next = {};
  } else {
    if (theme && (SEASONS.includes(theme) || theme === 'default')) next = { ...next, theme };
    if (date && parseDate(date)) next = { ...next, date };
  }

  try {
    if (Object.keys(next).length) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    return next;
  }

  return next;
}

function seasonFor({ m, d }) {
  if (m === 10 || (m === 11 && d === 1)) return 'halloween';
  if (m === 12 || (m === 1 && d <= 4)) return 'noel';
  if (m === 4 && d === 1) return 'avril';
  return null;
}

const preview = readPreview();

const CANONICAL = {
  halloween: { m: 10, d: 24 },
  noel: { m: 12, d: 12 },
  avril: { m: 4, d: 1 },
};

function resolveToday() {
  const real = parisParts(new Date());
  const forced = preview.date && parseDate(preview.date);
  if (forced) return forced;
  if (preview.theme && CANONICAL[preview.theme] && seasonFor(real) !== preview.theme) return { y: real.y, ...CANONICAL[preview.theme] };
  return real;
}

export const today = resolveToday();

export const season = preview.theme
  ? (preview.theme === 'default' ? null : preview.theme)
  : seasonFor(today);

export const isPreview = Boolean(preview.theme || preview.date);

function dayNumber({ y, m, d }) {
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}

export function daysUntil(month, day) {
  const now = dayNumber(today);
  let target = dayNumber({ y: today.y, m: month, d: day });
  if (target < now) target = dayNumber({ y: today.y + 1, m: month, d: day });
  return target - now;
}

export function isNewYearPhase() {
  return season === 'noel' && ((today.m === 12 && today.d >= 31) || (today.m === 1 && today.d <= 4));
}

export function seasonYear() {
  return today.m === 12 ? today.y + 1 : today.y;
}

function setFavicon(glyph) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${glyph}</text></svg>`;
  document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]').forEach((node) => node.remove());
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  document.head.appendChild(link);
}

function setThemeColor(color) {
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', color);
}

const APRIL_PATTERN = /FICH Team/g;
const APRIL_NAME = "FICH d'Avril";

function rewriteTitle() {
  if (document.title.includes('FICH Team')) document.title = document.title.replace(APRIL_PATTERN, APRIL_NAME);
}

function rewriteTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const value = node.nodeValue;
    if (value && value.includes('FICH Team')) node.nodeValue = value.replace(APRIL_PATTERN, APRIL_NAME);
  }
}

function startAprilRewrite() {
  rewriteTitle();
  const titleNode = document.querySelector('title');
  if (titleNode) new MutationObserver(rewriteTitle).observe(titleNode, { childList: true, characterData: true, subtree: true });

  let queued = false;
  const flush = () => {
    queued = false;
    const root = document.getElementById('root');
    if (root) rewriteTextNodes(root);
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(flush);
  };

  const root = document.getElementById('root');
  if (root) new MutationObserver(schedule).observe(root, { childList: true, characterData: true, subtree: true });
  schedule();
}

export function initSeason() {
  const root = document.documentElement;
  if (!season) {
    root.removeAttribute('data-theme');
    return;
  }
  root.setAttribute('data-theme', season);
  setThemeColor(THEME_COLORS[season]);
  setFavicon(FAVICONS[season]);
  if (season === 'avril') startAprilRewrite();
}
