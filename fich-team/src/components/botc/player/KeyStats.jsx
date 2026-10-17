import { motion } from 'framer-motion';
import Ring from './Ring';
import { useCountUp } from './useCountUp';
import { signed } from './format';
import styles from './Player.module.css';

function BigNumber({ value, decimals = 0 }) {
  const shown = useCountUp(value);
  return <>{decimals ? shown.toFixed(decimals) : Math.round(shown)}</>;
}

const rise = i => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

export default function KeyStats({ entry }) {
  const last = entry.lastGamePoints;

  return (
    <section className={styles.block}>
      <h2 className={styles.blockTitle}>Chiffres clés</h2>

      <div className={styles.bigGrid}>
        <motion.div className={`${styles.bigCard} ${styles.bigGold}`} {...rise(0)}>
          <span className={styles.bigLabel}>Points totaux</span>
          <span className={styles.bigValue}><BigNumber value={entry.total} /></span>
          <span className={styles.bigSub}>Rang #{entry.rank}</span>
        </motion.div>

        <motion.div className={styles.bigCard} {...rise(1)}>
          <span className={styles.bigLabel}>Parties jouées</span>
          <span className={styles.bigValue}><BigNumber value={entry.games} /></span>
          <span className={styles.bigSub}>{entry.wins} V · {entry.losses} D</span>
        </motion.div>

        <motion.div className={`${styles.bigCard} ${styles.bigRing}`} {...rise(2)}>
          <Ring value={entry.rate} color="var(--c-green)" size={92} stroke={9}>
            <span className={styles.ringValue}>{entry.rate}%</span>
          </Ring>
          <div className={styles.bigRingText}>
            <span className={styles.bigLabel}>Taux de victoire</span>
            <span className={styles.bigSub}>{entry.wins} victoire{entry.wins > 1 ? 's' : ''}</span>
          </div>
        </motion.div>

        <motion.div className={styles.bigCard} {...rise(3)}>
          <span className={styles.bigLabel}>Moyenne / partie</span>
          <span className={styles.bigValue}><BigNumber value={entry.average} decimals={1} /></span>
          <span className={styles.bigSub}>points par partie</span>
        </motion.div>
      </div>

      <div className={styles.smallGrid}>
        <motion.div className={styles.smallCard} {...rise(4)}>
          <span className={`${styles.smallValue} ${styles.gain}`}>{entry.wins}</span>
          <span className={styles.smallLabel}>Victoires</span>
        </motion.div>
        <motion.div className={styles.smallCard} {...rise(5)}>
          <span className={`${styles.smallValue} ${styles.loss}`}>{entry.losses}</span>
          <span className={styles.smallLabel}>Défaites</span>
        </motion.div>
        <motion.div className={styles.smallCard} {...rise(6)}>
          <span className={styles.smallValue}>{entry.mjGames}</span>
          <span className={styles.smallLabel}>Fois MJ</span>
        </motion.div>
        <motion.div className={styles.smallCard} {...rise(7)}>
          <span className={`${styles.smallValue} ${last > 0 ? styles.gain : last < 0 ? styles.loss : ''}`}>
            {last === null || last === undefined ? '—' : signed(last)}
          </span>
          <span className={styles.smallLabel}>Dernière partie</span>
        </motion.div>
        <motion.div className={`${styles.smallCard} ${styles.smallWide}`} {...rise(8)}>
          <span className={styles.smallValue}>{entry.bestRole ? entry.bestRole.name : '—'}</span>
          <span className={styles.smallLabel}>
            {entry.bestRole
              ? `Rôle favori · ${entry.bestRoleWins} victoire${entry.bestRoleWins > 1 ? 's' : ''}`
              : 'Rôle favori'}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
