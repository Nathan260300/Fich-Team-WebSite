const dateTime = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateTime.format(date);
}

export function shortId(value) {
  return typeof value === 'string' ? `${value.slice(0, 8)}…` : '—';
}

export const MODE_LABELS = {
  dashboards: 'Maintenance des dashboards',
  public: 'Maintenance du site public',
};

export function describeAuditEntry(entry) {
  const mode = MODE_LABELS[entry.target] ?? entry.target ?? '—';
  const permission = String(entry.details?.permission ?? '').toUpperCase();
  const who = entry.details?.target_label ?? entry.target ?? '—';

  switch (entry.action) {
    case 'maintenance.enabled':
      return { label: `${mode} activée`, tone: 'warn', detail: entry.details?.message || '' };
    case 'maintenance.disabled':
      return { label: `${mode} désactivée`, tone: 'ok', detail: '' };
    case 'maintenance.message_updated':
      return { label: `Message de ${mode.toLowerCase()} modifié`, tone: 'idle', detail: entry.details?.message || '' };
    case 'permission.granted':
      return { label: `Permission ${permission} accordée`, tone: 'warn', detail: who };
    case 'permission.revoked':
      return { label: `Permission ${permission} retirée`, tone: 'bad', detail: who };
    default:
      return { label: entry.action, tone: 'idle', detail: '' };
  }
}
