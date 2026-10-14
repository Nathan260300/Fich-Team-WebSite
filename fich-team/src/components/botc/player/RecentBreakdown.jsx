import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { POINT_FIELDS, TEAM_BY_ID, hasPointDetail } from '../../../lib/botc';
import { formatDate, signed } from './format';
import styles from './Player.module.css';

function BreakdownCard({ game, index }) {
  const team = TEAM_BY_ID[game.role.team];
  const detailed = hasPointDetail(game);

  return (
    <motion.article
      className={styles.breakCard}
      style={{ '--team': team?.color }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className={styles.breakHead}>
        <span className={styles.breakDate}>{formatDate(game.playedAt)}</span>
        <Link
          to={`/activites/botc?tab=roles&role=${encodeURIComponent(game.role.slug)}`}
          className={styles.breakRole}
        >
          {game.role.name}
        </Link>
        <span className={`${styles.gameResult} ${game.won ? styles.resultWin : styles.resultLoss}`}>
          {game.won ? 'Victoire' : 'Défaite'}
        </span>
      </header>

      {detailed ? (
        <ul className={styles.breakList}>
          {POINT_FIELDS.map(field => {
            const raw = game[field.key] ?? 0;
            const value = raw * field.sign;
            return (
              <li key={field.key} className={`${styles.breakItem} ${raw === 0 ? styles.breakZero : ''}`}>
                <span>{field.label}</span>
                <span className={value > 0 ? styles.gain : value < 0 ? styles.loss : ''}>
                  {raw === 0 ? '0' : signed(value)}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.breakLegacy}>Détail non renseigné pour cette partie.</p>
      )}

      <footer className={styles.breakTotal}>
        <span>Total</span>
        <strong className={game.points >= 0 ? styles.gain : styles.loss}>{signed(game.points)} pts</strong>
      </footer>
    </motion.article>
  );
}

export default function RecentBreakdown({ history }) {
  const recent = history.slice(0, 3);
  if (recent.length === 0) return null;

  return (
    <section className={styles.block}>
      <h2 className={styles.blockTitle}>Détail des points</h2>
      <p className={styles.blockSub}>
        {recent.length > 1 ? `Les ${recent.length} dernières parties` : 'La dernière partie'}, point par point.
      </p>
      <div className={styles.breakGrid}>
        {recent.map((game, i) => (
          <BreakdownCard key={`${game.game_id}-${game.role_id}`} game={game} index={i} />
        ))}
      </div>
    </section>
  );
}
