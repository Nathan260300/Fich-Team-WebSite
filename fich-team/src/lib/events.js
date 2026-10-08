const PALETTE = ['#3d9eff', '#ff4d6d', '#f0c040', '#4dd4c0', '#b18cff', '#ff9a4d', '#7ddc6b', '#ff7ac6'];

export function tagColor(tag) {
  const value = (tag || '').toLowerCase();
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

function pad(n) {
  return String(n).padStart(2, '0');
}

export function dayKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function formatLongDate(iso) {
  const text = new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatMonth(date) {
  const text = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function buildGrid(cursor) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = Math.ceil((offset + daysInMonth) / 7);
  const gridStart = new Date(year, month, 1 - offset);
  const cells = Array.from({ length: weeks * 7 }, (_, i) => new Date(year, month, 1 - offset + i));
  const gridEnd = new Date(year, month, 1 - offset + weeks * 7);
  return { gridStart, gridEnd, cells };
}
