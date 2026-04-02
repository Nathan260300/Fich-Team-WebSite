/**
 * @returns {URLSearchParams}
 */
export function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

/**
 * @param {string} page
 * @param {Record<string,string|number>} [extra={}]
 * @returns {string}
 */
export function buildUrl(page, extra = {}) {
  const u = new URLSearchParams();
  u.set('p', page);
  for (const [k, v] of Object.entries(extra)) {
    u.set(k, String(v));
  }
  return '?' + u.toString();
}

/**
 * @param {string} tag
 * @param {Record<string,string>} [attrs={}]
 * @param {string} [text='']
 * @returns {HTMLElement}
 */
export function createElement(tag, attrs = {}, text = '') {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else el.setAttribute(k, v);
  }
  if (text) el.textContent = text;
  return el;
}

/**
 * @param {HTMLElement} el
 */
export function clearElement(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

/**
 * @param {() => boolean} predicate
 * @param {number} [intervalMs=50]
 * @param {number} [maxTries=160]
 * @returns {Promise<void>}
 */
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

/**
 * @param {string} text
 * @returns {string}
 */
export function textToHtml(text) {
  return text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
}