import { motion } from 'framer-motion';
import { formatDate, plural } from './format';
import styles from './Player.module.css';

export default function Storyteller({ entry, ranked }) {
  if (entry.mjGames === 0) return null;

  const recorded = ranked?.recorded ?? 0;
  const demonRate = ranked?.demonRate ?? 0;
  const citadinRate = recorded > 0 ? 100 - demonRate : 0;

  return (
    <section className={styles.block}>
      <h2 className={styles.blockTitle}>Maître du jeu</h2>

      <motion.div
        className={styles.mjCard}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.mjStats}>
          <div className={styles.mjStat}>
            <span className={styles.mjValue}>{entry.mjGames}</span>
            <span className={styles.mjLabel}>{entry.mjGames > 1 ? 'Parties menées' : 'Partie menée'}</span>
          </div>
          <div className={styles.mjStat}>
            <span className={styles.mjValue}>{ranked ? `#${ranked.rank}` : '—'}</span>
            <span className={styles.mjLabel}>Classement MJ</span>
          </div>
          <div className={styles.mjStat}>
            <span className={styles.mjValue}>{ranked?.last ? formatDate(ranked.last) : '—'}</span>
            <span className={styles.mjLabel}>Dernière partie</span>
          </div>
        </div>

        {recorded > 0 && (
          <div className={styles.mjSplit}>
            <div className={styles.mjSplitTop}>
              <span style={{ color: '#ff4d6d' }}>😈 Démons {demonRate}%</span>
              <span style={{ color: '#3d9eff' }}>Citadins {citadinRate}% 🧑</span>
            </div>
            <div className={styles.mjBar}>
              <motion.span
                className={styles.mjBarDemon}
                initial={{ width: 0 }}
                whileInView={{ width: `${demonRate}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className={styles.mjHint}>
              Camp vainqueur sur {plural(recorded, 'partie enregistrée', 'parties enregistrées')}.
            </span>
          </div>
        )}
      </motion.div>
    </section>
  );
}
