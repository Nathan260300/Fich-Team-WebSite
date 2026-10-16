import { describeError } from '../lib/supabaseErrors';
import styles from './StatusScreen.module.css';

function WrenchIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a4 4 0 00-5.4 5.1L3 17.7 6.3 21l6.3-6.3a4 4 0 005.1-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l10 18H2L12 3z" />
      <path d="M12 10v5M12 18h.01" />
    </svg>
  );
}

export default function StatusScreen({ kind, message = '', failure = null, retried = false, onRetry, onLogout }) {
  const isMaintenance = kind === 'maintenance';
  const copy = failure ? describeError(failure.code) : null;
  const reason = message.trim();

  return (
    <div className={styles.root}>
      <div className={isMaintenance ? styles.orbGold : styles.orbRed} />
      <div className={styles.orb2} />

      <div className={styles.card} role={isMaintenance ? 'status' : 'alert'}>
        <div className={isMaintenance ? styles.iconGold : styles.iconRed}>
          {isMaintenance ? <WrenchIcon /> : <AlertIcon />}
        </div>

        <h1 className={styles.title}>
          {isMaintenance ? 'Dashboards en maintenance' : copy.title}
        </h1>

        <p className={styles.text}>
          {isMaintenance
            ? 'Les espaces de gestion sont temporairement fermés pendant une opération de maintenance. Ils seront de nouveau accessibles très bientôt.'
            : copy.message}
        </p>

        {isMaintenance && reason && (
          <p className={styles.reason}>{reason}</p>
        )}

        {!isMaintenance && failure && (
          <p className={styles.code}>
            {failure.code}
            {failure.httpStatus ? ` · HTTP ${failure.httpStatus}` : ''}
          </p>
        )}

        {!isMaintenance && retried && (
          <p className={styles.retryNote}>Le problème persiste. Réessaie dans quelques instants.</p>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={onRetry}>
            {isMaintenance ? 'Vérifier à nouveau' : 'Réessayer'}
          </button>
          <button type="button" className={styles.ghost} onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
