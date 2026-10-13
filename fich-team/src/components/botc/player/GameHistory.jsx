import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TEAM_BY_ID } from '../../../lib/botc';
import { playerPath } from '../../../lib/botcRoutes';
import { formatDate, signed } from './format';
import styles from './Player.module.css';

const VISIBLE = 8;

export default function GameHistory({ history }) {
  const [all, setAll] = useState(false);
  const rows = all ? history : history.slice(0, VISIBLE);

  return (
    <section className={styles.block}>
      <h2 className={styles.blockTitle}>Historique des parties</h2>

      {history.length === 0 ? (
        <p className={styles.empty}>Aucune partie enregistrée pour ce joueur.</p>
      ) : (
        <>
          <ul className={styles.timeline}>
            {rows.map((game, i) => {
              const team = TEAM_BY_ID[game.role.team];
              const winnerLabel = game.winner === 'demons' ? 'Démons' : 'Citadins';
              return (
                <motion.li
                  key={`${game.game_id}-${game.role_id}-${i}`}
                  className={styles.gameRow}
                  style={{ '--team': team?.color }}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ delay: Math.min(i, 6) * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className={styles.gameDate}>{formatDate(game.playedAt)}</span>
                  <div className={styles.gameMain}>
                    <Link
                      to={`/activites/botc?tab=roles&role=${encodeURIComponent(game.role.slug)}`}
                      className={styles.gameRole}
                    >
                      {game.role.name}
                    </Link>
                    <span className={styles.gameMeta}>
                      {team?.icon} {team?.label} · camp vainqueur : {winnerLabel}
                      {game.storyteller && (
                        <>
                          {' · MJ '}
                          {game.storyteller.minecraft_username ? (
                            <Link to={playerPath(game.storyteller.minecraft_username)}>{game.storyteller.pseudo}</Link>
                          ) : game.storyteller.pseudo}
                        </>
                      )}
                    </span>
                  </div>
                  <span className={`${styles.gameResult} ${game.won ? styles.resultWin : styles.resultLoss}`}>
                    {game.won ? 'Victoire' : 'Défaite'}
                  </span>
                  <span className={`${styles.gamePoints} ${game.points >= 0 ? styles.gain : styles.loss}`}>
                    {signed(game.points)}
                  </span>
                </motion.li>
              );
            })}
          </ul>

          {history.length > VISIBLE && (
            <button type="button" className={styles.moreBtn} onClick={() => setAll(v => !v)}>
              {all ? 'Réduire' : `Voir les ${history.length} parties`}
            </button>
          )}
        </>
      )}
    </section>
  );
}
