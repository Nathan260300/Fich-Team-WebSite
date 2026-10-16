export const SETTINGS_REGISTRY = [
  {
    key: 'maintenance_dashboards',
    label: 'Maintenance des dashboards',
    description: 'Ferme /app et /app/fich aux comptes non ADMIN.',
    section: { to: '/maintenance', label: 'Gérer dans Maintenance' },
  },
  {
    key: 'maintenance_public',
    label: 'Maintenance du site public',
    description: 'Remplace le site public par une page de maintenance, sauf pour FICH et ADMIN.',
    section: { to: '/maintenance', label: 'Gérer dans Maintenance' },
  },
];

export function findSettingDefinition(key) {
  return SETTINGS_REGISTRY.find(setting => setting.key === key) ?? null;
}
