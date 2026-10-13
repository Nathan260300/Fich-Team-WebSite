export function formatDate(value, withYear = true) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
  });
}

export function signed(value) {
  if (value > 0) return `+${value}`;
  return String(value);
}

export function plural(count, one, many) {
  return `${count} ${count > 1 ? many : one}`;
}
