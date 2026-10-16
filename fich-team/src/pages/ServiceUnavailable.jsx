import { useEffect, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import Background from '../components/Background';
import { Badge } from '../components/UI';
import { useNoIndex } from '../hooks/useNoIndex';
import { describeError } from '../lib/supabaseErrors';
import { getServiceStatus, retryService, subscribeServiceStatus } from '../lib/serviceStatus';
import errorStyles from './NotFound.module.css';
import styles from './ServiceUnavailable.module.css';

export default function ServiceUnavailable() {
  useNoIndex();
  const { failure, retrying, retryFailed } = useSyncExternalStore(subscribeServiceStatus, getServiceStatus);

  useEffect(() => {
    document.title = 'Service indisponible — FICH Team';
  }, []);

  if (!failure) return null;

  const copy = describeError(failure.code);

  return (
    <>
      <Background variant="error" />
      <main className={errorStyles.wrap}>
        <motion.div
          className={errorStyles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={errorStyles.glitchWrap} aria-hidden="true">
            <span className={errorStyles.num}>{copy.visual}</span>
            <span className={`${errorStyles.num} ${errorStyles.glitch1}`}>{copy.visual}</span>
            <span className={`${errorStyles.num} ${errorStyles.glitch2}`}>{copy.visual}</span>
          </div>
          <div className={errorStyles.scanlines} aria-hidden="true" />

          <div className={errorStyles.inner}>
            <Badge color="red">Incident technique</Badge>
            <h1 className={errorStyles.title}>{copy.title}</h1>

            <p className={errorStyles.code}>
              <span className={errorStyles.prompt}>$</span>
              <span>{failure.code}</span>
              {failure.httpStatus && <span className={styles.http}>HTTP {failure.httpStatus}</span>}
            </p>

            <p className={errorStyles.desc}>{copy.message}</p>

            <button
              type="button"
              className={styles.retry}
              onClick={retryService}
              disabled={retrying}
              aria-busy={retrying}
            >
              {retrying ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Vérification en cours…
                </>
              ) : (
                'Réessayer'
              )}
            </button>

            <p className={styles.feedback} role="status" aria-live="polite">
              {retryFailed && !retrying && 'Le service est toujours indisponible. Réessaie dans quelques instants.'}
            </p>
          </div>

          <div className={errorStyles.grid} aria-hidden="true" />
        </motion.div>
      </main>
    </>
  );
}
