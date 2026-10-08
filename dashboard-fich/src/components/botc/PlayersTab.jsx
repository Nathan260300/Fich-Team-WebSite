import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Skin from './Skin';
import PlayerModal from './PlayerModal';
import RowActions from '../RowActions';
import s from '../../pages/shared.module.css';
import styles from './Botc.module.css';

export default function PlayersTab({ players, gamePlayers, ranking, reload }) {
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null);

  const statsById = useMemo(() => new Map(ranking.map(entry => [entry.player.id, entry])), [ranking]);
  const countById = useMemo(() => {
    const map = new Map();
    gamePlayers.forEach(gp => map.set(gp.player_id, (map.get(gp.player_id) ?? 0) + 1));
    return map;
  }, [gamePlayers]);

  const filtered = players.filter(p => p.pseudo.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle} style={{ marginBottom: 0 }}>Joueurs</h2>
        <div className={styles.headerTools}>
          <input
            className={styles.search}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un joueur…"
          />
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} className={s.btnPrimary} onClick={() => setModal({})}>
            + Ajouter
          </motion.button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className={s.empty}>{players.length === 0 ? 'Aucun joueur pour le moment.' : 'Aucun résultat.'}</p>
      ) : (
        <div className={s.list}>
          {filtered.map(player => {
            const stats = statsById.get(player.id);
            return (
              <div key={player.id} className={s.row}>
                <Skin username={player.minecraft_username} pseudo={player.pseudo} />
                <div className={s.rowInfo}>
                  <span className={s.rowName}>{player.pseudo}</span>
                  <span className={s.rowSub}>
                    {stats ? `#${stats.rank} · ${stats.total} pts · ${stats.games} parties · ${stats.rate}% victoires · ${stats.mjGames} fois MJ` : '—'}
                  </span>
                </div>
                <RowActions onEdit={() => setModal(player)} />
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <PlayerModal
            player={modal}
            gameCount={countById.get(modal.id) ?? 0}
            onClose={() => setModal(null)}
            onSave={() => {
              setModal(null);
              reload();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
