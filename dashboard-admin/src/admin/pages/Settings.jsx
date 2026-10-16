import { Link } from 'react-router-dom';
import { useAsync } from '../hooks';
import { listSettings } from '../api';
import { findSettingDefinition } from '../settingsRegistry';
import { formatDateTime } from '../format';
import { Button, ErrorState, LoadingBlock, PageHeader, Pill } from '../ui';
import styles from './pages.module.css';

function summarize(value) {
  if (value && typeof value === 'object' && 'enabled' in value) {
    return value.enabled ? 'Activé' : 'Désactivé';
  }
  return JSON.stringify(value);
}

export default function Settings() {
  const { data, failure, loading, reload } = useAsync(listSettings);

  return (
    <div>
      <PageHeader
        eyebrow="Configuration"
        title="Configuration du site"
        description="Les paramètres globaux sont stockés dans la table site_settings et modifiables uniquement par les fonctions serveur réservées aux ADMIN. Seuls les paramètres déjà définis et exploités par le site apparaissent ici."
        actions={<Button tone="ghost" busy={loading && Boolean(data)} onClick={reload}>Actualiser</Button>}
      />

      {failure && <ErrorState failure={failure} onRetry={reload} compact />}
      {loading && !data && <LoadingBlock />}

      {data && data.length === 0 && <p className={styles.empty}>Aucun paramètre enregistré.</p>}

      {data && data.length > 0 && (
        <div className={styles.stack}>
          {data.map(setting => {
            const definition = findSettingDefinition(setting.key);
            return (
              <section key={setting.key} className={styles.card}>
                <div className={styles.cardHead}>
                  <div>
                    <h2 className={styles.cardTitle}>{definition?.label ?? setting.key}</h2>
                    <p className={styles.cardSub}>{definition?.description ?? 'Paramètre non référencé dans le registre de l’interface.'}</p>
                  </div>
                  <Pill tone="idle">{summarize(setting.value)}</Pill>
                </div>
                <div className={styles.cardFoot}>
                  <p className={styles.meta}>
                    <code className={styles.code}>{setting.key}</code>
                    {' · '}
                    {formatDateTime(setting.updated_at)}
                    {setting.updated_by ? ` · ${setting.updated_by}` : ''}
                  </p>
                  {definition?.section && (
                    <Link to={definition.section.to} className={styles.linkBtn}>{definition.section.label}</Link>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
