import { useState } from 'react';
import { useAsync } from '../hooks';
import { getMaintenanceState, setMaintenance } from '../api';
import { formatDateTime } from '../format';
import { Button, ConfirmDialog, ErrorState, LoadingBlock, PageHeader, Pill, Switch } from '../ui';
import { useToast } from '../toast';
import styles from './pages.module.css';

const MODES = [
  {
    mode: 'dashboards',
    title: 'Maintenance des dashboards',
    summary: 'Ferme les espaces de gestion privés : le portail /app et le dashboard /app/fich.',
    effects: [
      'Les comptes sans permission ADMIN ne peuvent plus accéder à /app ni à /app/fich.',
      'Les créateurs qui n’ont que la permission FICH voient une page de maintenance.',
      'Les comptes ADMIN conservent l’accès, y compris à /app/admin.',
      'Le site public n’est pas affecté.',
    ],
    confirm: 'Les créateurs seront immédiatement bloqués sur les dashboards, au plus tard une minute après l’activation pour les sessions déjà ouvertes.',
  },
  {
    mode: 'public',
    title: 'Maintenance du site public',
    summary: 'Remplace le site public FICH Team par une page de maintenance.',
    effects: [
      'Les visiteurs voient « Nous effectuons une maintenance » à la place du site.',
      'Les comptes FICH et ADMIN connectés peuvent toujours consulter le site.',
      'Les dashboards ne sont pas affectés.',
    ],
    confirm: 'Les visiteurs ne pourront plus consulter le site, au plus tard une minute après l’activation pour les pages déjà ouvertes.',
  },
];

function ModeCard({ definition, state, onSaved }) {
  const toast = useToast();
  const [draft, setDraft] = useState(state.message);
  const [pending, setPending] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const save = async (enabled, message, kind) => {
    setPending(kind);
    const result = await setMaintenance(definition.mode, enabled, message);
    setPending(null);
    setConfirmOpen(false);

    if (result.failure) {
      toast.error(`${definition.title} : ${result.failure.message}`);
      return;
    }

    if (kind === 'message') toast.success('Message enregistré.');
    else toast.success(enabled ? `${definition.title} activée.` : `${definition.title} désactivée.`);
    onSaved();
  };

  const onToggle = (next) => {
    if (next) setConfirmOpen(true);
    else save(false, state.message, 'toggle');
  };

  const dirty = draft.trim() !== state.message.trim();

  return (
    <section className={`${styles.card} ${state.enabled ? styles.cardActive : ''}`}>
      <div className={styles.cardHead}>
        <div>
          <h2 className={styles.cardTitle}>{definition.title}</h2>
          <p className={styles.cardSub}>{definition.summary}</p>
        </div>
        <div className={styles.switchBox}>
          <Pill tone={state.enabled ? 'warn' : 'ok'}>{state.enabled ? 'Activée' : 'Désactivée'}</Pill>
          <Switch
            checked={state.enabled}
            busy={pending === 'toggle'}
            disabled={pending === 'message'}
            onChange={onToggle}
            label={definition.title}
          />
        </div>
      </div>

      <ul className={styles.effects}>
        {definition.effects.map(effect => <li key={effect}>{effect}</li>)}
      </ul>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Motif affiché aux utilisateurs bloqués (optionnel)</span>
        <textarea
          className={styles.textarea}
          value={draft}
          maxLength={500}
          rows={3}
          onChange={event => setDraft(event.target.value)}
          placeholder="Ex. : Migration de la base de données en cours."
        />
      </label>

      <div className={styles.cardFoot}>
        <p className={styles.meta}>
          {state.updated_at
            ? `Dernière modification : ${formatDateTime(state.updated_at)}${state.updated_by ? ` par ${state.updated_by}` : ''}`
            : 'Jamais modifiée depuis la mise en place.'}
        </p>
        <Button tone="ghost" busy={pending === 'message'} disabled={!dirty || pending === 'toggle'} onClick={() => save(state.enabled, draft, 'message')}>
          Enregistrer le message
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={`Activer : ${definition.title.toLowerCase()} ?`}
        confirmLabel="Activer la maintenance"
        tone="warn"
        busy={pending === 'toggle'}
        onConfirm={() => save(true, draft, 'toggle')}
        onCancel={() => setConfirmOpen(false)}
      >
        <p>{definition.confirm}</p>
        <ul>
          {definition.effects.map(effect => <li key={effect}>{effect}</li>)}
        </ul>
      </ConfirmDialog>
    </section>
  );
}

export default function Maintenance() {
  const { data, failure, loading, reload } = useAsync(getMaintenanceState);

  return (
    <div>
      <PageHeader
        eyebrow="Priorité"
        title="Maintenance"
        description="Deux modes indépendants, activables séparément ou ensemble. Chaque état est enregistré côté serveur : il survit aux rechargements, aux reconnexions et aux redéploiements."
        actions={<Button tone="ghost" busy={loading && Boolean(data)} onClick={reload}>Actualiser</Button>}
      />

      {failure && <ErrorState failure={failure} onRetry={reload} compact />}
      {loading && !data && <LoadingBlock />}

      {data && (
        <div className={styles.stack}>
          {MODES.map(definition => (
            <ModeCard
              key={`${definition.mode}:${data[definition.mode]?.updated_at ?? 'none'}`}
              definition={definition}
              state={data[definition.mode]}
              onSaved={reload}
            />
          ))}
        </div>
      )}
    </div>
  );
}
