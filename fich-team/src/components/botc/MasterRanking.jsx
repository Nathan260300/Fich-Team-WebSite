import { motion } from 'framer-motion';
import Skin from './Skin';
import Podium from './Podium';
import { staggerDelay } from '../../utils/helpers';
import styles from '../../pages/Botc.module.css';

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MasterRanking({ ranking, onSelect }) {
  if (ranking.length === 0) {
    return <p className={styles.empty}>Aucun MJ au classement pour le moment.</p>;
  }

  const podiumEntries = ranking.slice(0, 3).map(e => ({
    id: e.player.id,
    rank: e.rank,
    pseudo: e.player.pseudo,
    username: e.player.minecraft_username,
    label: `${e.games} partie${e.games > 1 ? 's' : ''}`,
  }));

  return (
    <div>
      <Podium entries={podiumEntries} onSelect={onSelect} />

      <div className={`${styles.rankHead} ${styles.masterGrid}`} aria-hidden="true">
        <span>#</span>
        <span>MJ</span>
        <span>Parties menées</span>
        <span>🟥 Démons</span>
        <span>🟦 Citadins</span>
        <span>Équilibre</span>
      </div>

      <div className={styles.rankList}>
        {ranking.map((entry, i) => (
          <motion.button
            key={entry.player.id}
            type="button"
            onClick={() => onSelect(entry.player.id)}
            whileHover={{ x: 4 }}
            className={`${styles.rankRow} ${styles.masterGrid} ${styles.playerRow}`}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: staggerDelay(Math.min(i, 8), 0.04), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={`${styles.rankNum} ${styles.mNum}`}>{MEDALS[entry.rank] ?? entry.rank}</span>

            <span className={`${styles.rankPlayer} ${styles.mPlayer}`}>
              <Skin
                username={entry.player.minecraft_username}
                pseudo={entry.player.pseudo}
                size={64}
                className={styles.rankSkin}
                fallbackClass={styles.rankSkinFallback}
              />
              <span className={styles.rankIdentity}>
                <span className={styles.rankPseudo}>{entry.player.pseudo}</span>
                {entry.player.highlight
                  ? <span className={styles.rankQuote}>« {entry.player.highlight} »</span>
                  : <span className={styles.rankQuoteEmpty}>{entry.last ? `Dernière partie : ${formatDate(entry.last)}` : 'Parties d\'avant le site'}</span>}
              </span>
            </span>

            <span className={`${styles.rankCell} ${styles.mGames}`}>
              <strong className={styles.rankTotal}>{entry.games}</strong>
              <small className={styles.cellLabel}>parties</small>
            </span>

            <span className={`${styles.rankCell} ${styles.mDemons}`}>
              <small className={styles.cellLabel}>🟥 Démons</small>
              <strong className={styles.demonText}>{entry.recorded > 0 ? entry.demons : '—'}</strong>
            </span>

            <span className={`${styles.rankCell} ${styles.mCitadins}`}>
              <small className={styles.cellLabel}>🟦 Citadins</small>
              <strong className={styles.citadinText}>{entry.recorded > 0 ? entry.citadins : '—'}</strong>
            </span>

            <span className={`${styles.rankCell} ${styles.mBalance}`}>
              {entry.recorded > 0 ? (
                <>
                  <span className={styles.balanceBar} role="img" aria-label={`Démons ${entry.demonRate}%, Citadins ${100 - entry.demonRate}%`}>
                    <span className={styles.versusDemons} style={{ width: `${entry.demonRate}%` }} />
                    <span className={styles.versusCitadins} style={{ width: `${100 - entry.demonRate}%` }} />
                  </span>
                  <small className={styles.balanceText}>{entry.demonRate}% / {100 - entry.demonRate}%</small>
                </>
              ) : <span className={styles.muted}>—</span>}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
