import { useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { listPermissions, setPermission } from '../lib/api';
import { formatDateTime, shortId } from '../lib/format';
import { Button, ConfirmDialog, ErrorState, LoadingBlock, PageHeader, Pill, Switch } from '../components/UI';
import { useToast } from '../hooks/useToast';
import { useCurrentUser } from '../hooks/useCurrentUser';
import styles from './shared.module.css';

const PERMISSION_LABELS = { fich: 'FICH', admin: 'ADMIN' };

function describeChange(change, currentUserId) {
  const label = PERMISSION_LABELS[change.permission];
  const self = change.user.user_id === currentUserId;

  if (change.permission === 'admin' && change.next) {
    return {
      title: `Accorder ADMIN à ${change.user.display_name} ?`,
      tone: 'warn',
      confirm: 'Accorder ADMIN',
      body: 'Cette personne pourra ouvrir /app/admin, activer les maintenances et modifier les permissions de tous les comptes. La permission FICH n’est pas modifiée.',
    };
  }

  if (change.permission === 'admin') {
    return {
      title: `Retirer ADMIN à ${change.user.display_name} ?`,
      tone: 'danger',
      confirm: 'Retirer ADMIN',
      body: self
        ? 'Tu vas retirer ta propre permission ADMIN : tu perdras immédiatement l’accès à cet espace. Le dernier administrateur ne peut pas être retiré.'
        : 'Cette personne perdra l’accès à /app/admin. La permission FICH n’est pas modifiée.',
    };
  }

  return {
    title: `${change.next ? 'Accorder' : 'Retirer'} ${label} à ${change.user.display_name} ?`,
    tone: change.next ? 'primary' : 'danger',
    confirm: change.next ? 'Accorder FICH' : 'Retirer FICH',
    body: change.next
      ? 'Cette personne pourra ouvrir le dashboard /app/fich. La permission ADMIN n’est pas modifiée.'
      : 'Cette personne perdra l’accès à /app/fich. La permission ADMIN n’est pas modifiée.',
  };
}

export default function Users() {
  const currentUserId = useCurrentUser();
  const toast = useToast();
  const { data, failure, loading, reload } = useAsync(listPermissions);
  const [change, setChange] = useState(null);
  const [saving, setSaving] = useState(false);

  const confirm = async () => {
    setSaving(true);
    const result = await setPermission(change.user.user_id, change.permission, change.next);
    setSaving(false);

    if (result.failure) {
      toast.error(result.failure.message);
      setChange(null);
      return;
    }

    toast.success(`Permission ${PERMISSION_LABELS[change.permission]} mise à jour.`);
    const selfRevoked = change.permission === 'admin' && !change.next && change.user.user_id === currentUserId;
    setChange(null);
    if (selfRevoked) {
      window.location.reload();
      return;
    }
    reload();
  };

  const copy = change ? describeChange(change, currentUserId) : null;

  return (
    <div>
      <PageHeader
        eyebrow="Sécurité"
        title="Utilisateurs et permissions"
        description="Reflet de la table user_permissions. Chaque modification est vérifiée et appliquée côté serveur, puis consignée dans le journal. Les deux permissions sont indépendantes."
        actions={<Button tone="ghost" busy={loading && Boolean(data)} onClick={reload}>Actualiser</Button>}
      />

      {failure && <ErrorState failure={failure} onRetry={reload} compact />}
      {loading && !data && <LoadingBlock />}

      {data && data.length === 0 && <p className={styles.empty}>Aucune ligne dans user_permissions.</p>}

      {data && data.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Dernière connexion</th>
                <th className={styles.center}>FICH</th>
                <th className={styles.center}>ADMIN</th>
              </tr>
            </thead>
            <tbody>
              {data.map(user => (
                <tr key={user.user_id}>
                  <td>
                    <div className={styles.userCell}>
                      {user.avatar_url
                        ? <img src={user.avatar_url} alt="" className={styles.avatar} width="32" height="32" loading="lazy" />
                        : <span className={styles.avatarFallback}>{user.display_name.slice(0, 1).toUpperCase()}</span>}
                      <div>
                        <p className={styles.userName}>
                          {user.display_name}
                          {user.user_id === currentUserId && <Pill tone="idle">Toi</Pill>}
                        </p>
                        <p className={styles.userId}>{shortId(user.user_id)}</p>
                      </div>
                    </div>
                  </td>
                  <td className={styles.muted}>{formatDateTime(user.last_sign_in_at)}</td>
                  <td className={styles.center}>
                    <Switch
                      checked={user.fich}
                      onChange={next => setChange({ user, permission: 'fich', next })}
                      label={`FICH pour ${user.display_name}`}
                    />
                  </td>
                  <td className={styles.center}>
                    <Switch
                      checked={user.admin}
                      onChange={next => setChange({ user, permission: 'admin', next })}
                      label={`ADMIN pour ${user.display_name}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(change)}
        title={copy?.title ?? ''}
        confirmLabel={copy?.confirm}
        tone={copy?.tone}
        busy={saving}
        onConfirm={confirm}
        onCancel={() => setChange(null)}
      >
        <p>{copy?.body}</p>
      </ConfirmDialog>
    </div>
  );
}
