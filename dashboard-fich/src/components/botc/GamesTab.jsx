import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDateTime } from '../../lib/dates';
import GameModal from './GameModal';
import RowActions from '../RowActions';
import s from '../../pages/shared.module.css';
import styles from './Botc.module.css';

const PAGE = 30;

export default function GamesTab({ games, gamePlayers, players, roles, reload }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const [modal, setModal] = useState(null);

  const playerMap = useMemo(() => new Map(players.map(p => [p.id, p])), [players]);
  const entriesByGame = useMemo(() => {
    const map = new Map();
    gamePlayers.forEach(gp => {
      if (!map.has(gp.game_id)) map.set(gp.game_id, []);
      map.get(gp.game_id).push(gp);
    });
    return map;
  }, [gamePlayers]);

  const filtered = games.filter(game => {
    if (filter !== 'all' && game.winner !== filter) return false;
    const text = query.trim().toLowerCase();
    if (!text) return true;
    const names = [
      playerMap.get(game.storyteller_id)?.pseudo ?? '',
      ...(entriesByGame.get(game.id) ?? []).map(e => playerMap.get(e.player_id)?.pseudo ?? ''),
    ];
    return names.some(n => n.toLowerCase().includes(text));
  });

  const visible = filtered.slice(0, limit);

  return (
    <div>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle} style={{ marginBottom: 0 }}>Parties</h2>
        <div className={styles.headerTools}>
          <select className={styles.filter} value={filter} onChange={e => { setFilter(e.target.value); setLimit(PAGE); }}>
            <option value="all">Tous les vainqueurs</option>
            <option value="demons">🟥 Démons</option>
            <option value="citadins">🟦 Citadins</option>
          </select>
          <input
            className={styles.search}
            value={query}
            onChange={e => { setQuery(e.target.value); setLimit(PAGE); }}
            placeholder="Joueur ou MJ…"
          />
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} className={s.btnPrimary} onClick={() => setModal({})}>
            + Ajouter
          </motion.button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className={s.empty}>{games.length === 0 ? 'Aucune partie enregistrée.' : 'Aucun résultat.'}</p>
      ) : (
        <div className={s.list}>
          {visible.map(game => {
            const entries = entriesByGame.get(game.id) ?? [];
            const mj = playerMap.get(game.storyteller_id);
            return (
              <div key={game.id} className={s.row}>
                <span className={`${styles.winnerBadge} ${game.winner === 'demons' ? styles.winDemons : styles.winCitadins}`}>
                  {game.winner === 'demons' ? '🟥 Démons' : '🟦 Citadins'}
                </span>
                <div className={s.rowInfo}>
                  <span className={s.rowName}>{formatDateTime(game.played_at)}</span>
                  <span className={s.rowSub}>
                    MJ : {mj?.pseudo ?? '—'} · {entries.length} joueur{entries.length > 1 ? 's' : ''}
                    {entries.length > 0 && ` · ${entries.map(e => playerMap.get(e.player_id)?.pseudo ?? '?').join(', ')}`}
                  </span>
                </div>
                <RowActions
                  onEdit={() => setModal({ game, entries })}
                />
              </div>
            );
          })}
        </div>
      )}

      {filtered.length > limit && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
          <button type="button" className={s.btnGhost} onClick={() => setLimit(l => l + PAGE)}>
            Afficher plus ({filtered.length - limit})
          </button>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <GameModal
            game={modal.game ?? {}}
            entries={modal.entries ?? []}
            players={players}
            roles={roles}
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
