export function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

export function buildUrl(page, extra = {}) {
  const u = new URLSearchParams();
  u.set('p', page);
  for (const [k, v] of Object.entries(extra)) {
    u.set(k, String(v));
  }
  return '?' + u.toString();
}

export function createElement(tag, attrs = {}, text = '') {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else el.setAttribute(k, v);
  }
  if (text) el.textContent = text;
  return el;
}

export function clearElement(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

export function waitUntil(predicate, intervalMs = 50, maxTries = 160) {
  return new Promise(resolve => {
    if (predicate()) { resolve(); return; }
    let tries = 0;
    const t = setInterval(() => {
      if (predicate() || ++tries >= maxTries) {
        clearInterval(t);
        resolve();
      }
    }, intervalMs);
  });
}

export function textToHtml(text) {
  return text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
}
