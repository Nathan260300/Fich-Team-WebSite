import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Background from '../components/Background';
import { Badge } from '../components/UI';
import { useNoIndex } from '../hooks/useNoIndex';
import styles from './Maintenance.module.css';

export default function Maintenance({ message = '' }) {
  useNoIndex();

  useEffect(() => {
    document.title = 'Maintenance — FICH Team';
  }, []);

  const reason = message.trim();

  return (
    <>
      <Background />
      <main className={styles.wrap}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.logoWrap}>
            <img src="/logo.png" alt="FICH Team" width="72" height="72" />
          </div>

          <Badge color="gold">Maintenance en cours</Badge>

          <h1 className={styles.title}>Nous effectuons une maintenance</h1>

          <p className={styles.desc}>
            Le site FICH Team est temporairement indisponible, le temps d’apporter quelques améliorations.
            Nous serons de retour très prochainement.
          </p>

          {reason && (
            <blockquote className={styles.reason}>
              <span className={styles.reasonLabel}>Message de l’équipe</span>
              {reason}
            </blockquote>
          )}

          <div className={styles.progress} aria-hidden="true">
            <span className={styles.progressFill} />
          </div>

          <p className={styles.hint}>Cette page se met à jour automatiquement dès que le site est de retour.</p>

          <a className={styles.team} href="/app/">Accès équipe</a>
        </motion.div>
      </main>
    </>
  );
}
