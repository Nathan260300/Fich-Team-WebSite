import { useAsync } from '../hooks/useAsync';
import { listAuditLog } from '../lib/api';
import { describeAuditEntry, formatDateTime } from '../lib/format';
import { Button, ErrorState, LoadingBlock, PageHeader, Pill } from '../components/UI';
import styles from './shared.module.css';

const loadLogs = () => listAuditLog(100);

export default function Logs() {
  const { data, failure, loading, reload } = useAsync(loadLogs);

  return (
    <div>
      <PageHeader
        eyebrow="Traçabilité"
        title="Journaux administratifs"
        description="Actions sensibles effectuées depuis /app/admin, enregistrées côté serveur. Le journal ne contient aucun événement antérieur à sa mise en place."
        actions={<Button tone="ghost" busy={loading && Boolean(data)} onClick={reload}>Actualiser</Button>}
      />

      {failure && <ErrorState failure={failure} onRetry={reload} compact />}
      {loading && !data && <LoadingBlock />}

      {data && data.length === 0 && (
        <p className={styles.empty}>Aucun événement enregistré pour le moment.</p>
      )}

      {data && data.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Utilisateur</th>
                <th>Détail</th>
              </tr>
            </thead>
            <tbody>
              {data.map(entry => {
                const info = describeAuditEntry(entry);
                return (
                  <tr key={entry.id}>
                    <td className={styles.muted}>{formatDateTime(entry.created_at)}</td>
                    <td><Pill tone={info.tone}>{info.label}</Pill></td>
                    <td>{entry.actor_label ?? 'Compte supprimé'}</td>
                    <td className={styles.detail}>{info.detail || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
