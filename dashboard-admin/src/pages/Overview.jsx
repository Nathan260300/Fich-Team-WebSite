import { Link } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { getMaintenanceState, listAuditLog, probeCentralProject, probeDataProject } from '../lib/api';
import { describeAuditEntry, formatDateTime } from '../lib/format';
import { Button, ErrorState, LoadingBlock, PageHeader, Pill } from '../components/UI';
import styles from './shared.module.css';

async function loadOverview() {
  const [state, audit, central, data] = await Promise.all([
    getMaintenanceState(),
    listAuditLog(5),
    probeCentralProject(),
    probeDataProject(),
  ]);
  return { data: { state, audit, central, data }, failure: null };
}

const SHORTCUTS = [
  { to: '/maintenance', title: 'Maintenance', desc: 'Activer ou désactiver les deux modes.' },
  { to: '/utilisateurs', title: 'Utilisateurs', desc: 'Consulter et gérer les permissions.' },
  { to: '/journaux', title: 'Journaux', desc: 'Historique des actions administratives.' },
  { to: '/configuration', title: 'Configuration', desc: 'Paramètres globaux du site.' },
];

function ProbeCard({ title, subtitle, probe }) {
  return (
    <div className={styles.statCard}>
      <p className={styles.statLabel}>{title}</p>
      <Pill tone={probe.available ? 'ok' : 'bad'}>{probe.available ? 'Disponible' : 'Indisponible'}</Pill>
      <p className={styles.statMeta}>
        {probe.available ? `${probe.latency} ms de latence` : probe.failure?.message}
      </p>
      <p className={styles.statHint}>{subtitle}</p>
    </div>
  );
}

function MaintenanceCard({ title, mode }) {
  return (
    <div className={styles.statCard}>
      <p className={styles.statLabel}>{title}</p>
      <Pill tone={mode.enabled ? 'warn' : 'ok'}>{mode.enabled ? 'Maintenance active' : 'Normal'}</Pill>
      <p className={styles.statMeta}>
        {mode.updated_at ? `Modifié le ${formatDateTime(mode.updated_at)}` : 'Jamais modifié'}
      </p>
    </div>
  );
}

export default function Overview() {
  const { data, loading, reload } = useAsync(loadOverview);

  if (!data) {
    return (
      <div>
        <PageHeader eyebrow="Administration" title="Vue d’ensemble" />
        <LoadingBlock label="Vérification des services…" />
      </div>
    );
  }

  const { state, audit, central, data: dataProbe } = data;
  const probesFailing = !central.available || !dataProbe.available;
  const maintenanceActive = state.data && (state.data.dashboards.enabled || state.data.public.enabled);

  let globalTone = 'ok';
  let globalLabel = 'Opérationnel';
  if (probesFailing) {
    globalTone = 'bad';
    globalLabel = 'Incident détecté';
  } else if (maintenanceActive) {
    globalTone = 'warn';
    globalLabel = 'Maintenance active';
  }

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Vue d’ensemble"
        description="État calculé à partir de contrôles réels effectués à l’ouverture de la page."
        actions={<Button tone="ghost" busy={loading} onClick={reload}>Actualiser</Button>}
      />

      <section className={styles.banner}>
        <div>
          <p className={styles.statLabel}>État général</p>
          <Pill tone={globalTone}>{globalLabel}</Pill>
        </div>
        <p className={styles.bannerText}>
          {probesFailing
            ? 'Au moins un projet Supabase ne répond pas correctement. Consulte les cartes ci-dessous.'
            : maintenanceActive
              ? 'Un ou plusieurs modes de maintenance sont activés.'
              : 'Les deux projets Supabase répondent et aucune maintenance n’est active.'}
        </p>
      </section>

      <div className={styles.statGrid}>
        <ProbeCard title="Supabase — projet central" subtitle="Authentification, permissions, maintenance" probe={central} />
        <ProbeCard title="Supabase — données du site" subtitle="Contenu du site public et du dashboard FICH" probe={dataProbe} />
        {state.data ? (
          <>
            <MaintenanceCard title="Maintenance des dashboards" mode={state.data.dashboards} />
            <MaintenanceCard title="Maintenance du site public" mode={state.data.public} />
          </>
        ) : (
          <div className={`${styles.statCard} ${styles.statWide}`}>
            <ErrorState failure={state.failure} onRetry={reload} compact />
          </div>
        )}
      </div>

      <h2 className={styles.sectionTitle}>Raccourcis</h2>
      <div className={styles.shortcutGrid}>
        {SHORTCUTS.map(shortcut => (
          <Link key={shortcut.to} to={shortcut.to} className={styles.shortcut}>
            <span className={styles.shortcutTitle}>{shortcut.title}</span>
            <span className={styles.shortcutDesc}>{shortcut.desc}</span>
          </Link>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Derniers événements administratifs</h2>
      {audit.failure && <ErrorState failure={audit.failure} onRetry={reload} compact />}
      {audit.data && audit.data.length === 0 && (
        <p className={styles.empty}>Aucun événement enregistré depuis la mise en place du journal.</p>
      )}
      {audit.data && audit.data.length > 0 && (
        <ul className={styles.events}>
          {audit.data.map(entry => {
            const info = describeAuditEntry(entry);
            return (
              <li key={entry.id} className={styles.event}>
                <Pill tone={info.tone}>{info.label}</Pill>
                <span className={styles.eventMeta}>
                  {entry.actor_label ?? 'Compte supprimé'} · {formatDateTime(entry.created_at)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
