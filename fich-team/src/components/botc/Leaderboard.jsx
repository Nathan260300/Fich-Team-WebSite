import { motion } from 'framer-motion';
import Skin from './Skin';
import Podium from './Podium';
import { TEAM_BY_ID } from '../../lib/botc';
import { staggerDelay } from '../../utils/helpers';
import styles from '../../pages/Botc.module.css';

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

function formatPoints(value) {
  return value > 0 ? `+${value}` : String(value);
}

function RoleChip({ role }) {
  const team = TEAM_BY_ID[role.team];
  return (
    <span className={styles.roleChip} style={{ '--team': team?.color }}>
      {role.name}
    </span>
  );
}

export default function Leaderboard({ ranking, onSelect }) {
  if (ranking.length === 0) {
    return <p className={styles.empty}>Aucun joueur au classement pour le moment.</p>;
  }

  const podiumEntries = ranking.slice(0, 3).map(e => ({
    id: e.player.id,
    rank: e.rank,
    pseudo: e.player.pseudo,
    username: e.player.minecraft_username,
    label: `${e.total} pts`,
  }));

  return (
    <div>
      <Podium entries={podiumEntries} onSelect={onSelect} />

      <div className={`${styles.rankHead} ${styles.playerGrid}`} aria-hidden="true">
        <span>#</span>
        <span>Joueur</span>
        <span>Points</span>
        <span>Dernière partie</span>
        <span>3 derniers rôles</span>
        <span>Meilleur rôle</span>
      </div>

      <div className={styles.rankList}>
        {ranking.map((entry, i) => (
          <motion.button
            key={entry.player.id}
            type="button"
            className={`${styles.rankRow} ${styles.playerGrid} ${styles.playerRow}`}
            onClick={() => onSelect(entry.player.id)}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: staggerDelay(Math.min(i, 8), 0.04), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ x: 4 }}
          >
            <span className={`${styles.rankNum} ${styles.aNum}`}>{MEDALS[entry.rank] ?? entry.rank}</span>

            <span className={`${styles.rankPlayer} ${styles.aPlayer}`}>
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
                  : <span className={styles.rankQuoteEmpty}>Aucun fait d'armes renseigné</span>}
              </span>
            </span>

            <span className={`${styles.rankCell} ${styles.aPoints}`}>
              <strong className={styles.rankTotal}>{entry.total}</strong>
              <small className={styles.cellLabel}>pts</small>
            </span>

            <span className={`${styles.rankCell} ${styles.aLast}`}>
              <small className={styles.cellLabel}>Dernière partie</small>
              {entry.lastGamePoints === null
                ? <span className={styles.muted}>—</span>
                : <strong className={entry.lastGamePoints >= 0 ? styles.gain : styles.loss}>{formatPoints(entry.lastGamePoints)}</strong>}
            </span>

            <span className={`${styles.rankCell} ${styles.rankRoles} ${styles.aRoles}`}>
              {entry.lastRoles.length
                ? entry.lastRoles.map((role, idx) => <RoleChip key={`${role.id}-${idx}`} role={role} />)
                : <span className={styles.muted}>—</span>}
            </span>

            <span className={`${styles.rankCell} ${styles.aBest}`}>
              {entry.bestRole
                ? <span className={styles.bestRole}><RoleChip role={entry.bestRole} /><small>{entry.bestRoleWins} victoire{entry.bestRoleWins > 1 ? 's' : ''}</small></span>
                : <span className={styles.muted}>—</span>}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
