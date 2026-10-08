import { useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { TEAMS } from '../../lib/botc';
import { toInputValue, fromInputValue, nowInputValue } from '../../lib/dates';
import FormModal from '../FormModal';
import s from '../../pages/shared.module.css';
import styles from './Botc.module.css';

let rowCounter = 0;
const newKey = () => `row-${rowCounter++}`;

function expectedWin(role, winner) {
  if (!role) return true;
  return role.team === 'demon' ? winner === 'demons' : winner === 'citadins';
}

export default function GameModal({ game, entries, players, roles, onClose, onSave }) {
  const isNew = !game.id;
  const roleMap = useMemo(() => new Map(roles.map(r => [String(r.id), r])), [roles]);

  const [playedAt, setPlayedAt] = useState(game.played_at ? toInputValue(game.played_at) : nowInputValue());
  const [winner, setWinner] = useState(game.winner ?? 'citadins');
  const [storyteller, setStoryteller] = useState(game.storyteller_id ? String(game.storyteller_id) : '');
  const [notes, setNotes] = useState(game.notes ?? '');
  const [rows, setRows] = useState(() =>
    entries.map(e => ({
      key: newKey(),
      playerId: String(e.player_id),
      roleId: String(e.role_id),
      won: e.won,
      points: String(e.points),
      touched: true,
    }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const changeWinner = value => {
    setWinner(value);
    setRows(list => list.map(r => (r.touched || !r.roleId ? r : { ...r, won: expectedWin(roleMap.get(r.roleId), value) })));
  };

  const updateRow = (key, patch) => setRows(list => list.map(r => (r.key === key ? { ...r, ...patch } : r)));

  const changeRole = (key, roleId) => {
    setRows(list =>
      list.map(r => {
        if (r.key !== key) return r;
        const next = { ...r, roleId };
        if (!r.touched) next.won = expectedWin(roleMap.get(roleId), winner);
        return next;
      })
    );
  };

  const addRow = () =>
    setRows(list => [...list, { key: newKey(), playerId: '', roleId: '', won: true, points: '', touched: false }]);

  const removeRow = key => setRows(list => list.filter(r => r.key !== key));

  const usedIds = new Set(rows.map(r => r.playerId).filter(Boolean));

  const save = async () => {
    if (!playedAt) {
      setError('La date est requise.');
      return;
    }
    for (const [index, row] of rows.entries()) {
      if (!row.playerId || !row.roleId) {
        setError(`Ligne ${index + 1} : joueur et rôle requis.`);
        return;
      }
      if (row.points.trim() === '' || Number.isNaN(parseInt(row.points, 10))) {
        setError(`Ligne ${index + 1} : points manquants.`);
        return;
      }
    }
    if (usedIds.size !== rows.length) {
      setError('Un joueur ne peut apparaître qu’une fois par partie.');
      return;
    }

    setSaving(true);
    setError(null);

    const gamePayload = {
      played_at: fromInputValue(playedAt),
      winner,
      storyteller_id: storyteller ? Number(storyteller) : null,
      notes: notes.trim() || null,
    };

    let gameId = game.id;
    if (isNew) {
      const { data, error: insertError } = await supabase.from('botc_games').insert(gamePayload).select('id').single();
      if (insertError) {
        setSaving(false);
        setError(insertError.message);
        return;
      }
      gameId = data.id;
    } else {
      const { error: updateError } = await supabase.from('botc_games').update(gamePayload).eq('id', gameId);
      if (updateError) {
        setSaving(false);
        setError(updateError.message);
        return;
      }
    }

    const payload = rows.map(r => ({
      game_id: gameId,
      player_id: Number(r.playerId),
      role_id: Number(r.roleId),
      won: r.won,
      points: parseInt(r.points, 10),
    }));

    if (payload.length > 0) {
      const { error: upsertError } = await supabase
        .from('botc_game_players')
        .upsert(payload, { onConflict: 'game_id,player_id' });
      if (upsertError) {
        if (isNew) await supabase.from('botc_games').delete().eq('id', gameId);
        setSaving(false);
        setError(upsertError.message);
        return;
      }
    }

    const keep = payload.map(p => p.player_id);
    let cleanup = supabase.from('botc_game_players').delete().eq('game_id', gameId);
    if (keep.length > 0) cleanup = cleanup.not('player_id', 'in', `(${keep.join(',')})`);
    const { error: cleanupError } = await cleanup;

    setSaving(false);
    if (cleanupError) {
      setError(cleanupError.message);
      return;
    }
    onSave();
  };

  const remove = async () => {
    if (!confirm('Supprimer cette partie et toutes ses participations ?')) return;
    setSaving(true);
    const { error: deleteError } = await supabase.from('botc_games').delete().eq('id', game.id);
    setSaving(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    onSave();
  };

  return (
    <FormModal
      title={isNew ? 'Ajouter une partie' : 'Modifier la partie'}
      onClose={onClose}
      onSubmit={save}
      saving={saving}
      error={error}
      maxWidth={860}
      leftAction={!isNew && <button type="button" className={s.btnDanger} onClick={remove}>Supprimer</button>}
    >
      <div className={styles.gameTop}>
        <div className={s.field}>
          <label className={s.label}>Date *</label>
          <input type="datetime-local" value={playedAt} onChange={e => setPlayedAt(e.target.value)} />
        </div>
        <div className={s.field}>
          <label className={s.label}>Vainqueur *</label>
          <select value={winner} onChange={e => changeWinner(e.target.value)}>
            <option value="demons">🟥 Démons</option>
            <option value="citadins">🟦 Citadins</option>
          </select>
        </div>
        <div className={s.field}>
          <label className={s.label}>MJ</label>
          <select value={storyteller} onChange={e => setStoryteller(e.target.value)}>
            <option value="">Aucun</option>
            {players.map(p => <option key={p.id} value={p.id}>{p.pseudo}</option>)}
          </select>
        </div>
      </div>

      <div className={s.field}>
        <label className={s.label}>Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ minHeight: 56 }} />
      </div>

      <div className={styles.rowsHead}>
        <span className={s.label}>Joueurs ({rows.length})</span>
        <button type="button" className={s.btnGhost} onClick={addRow}>+ Ajouter un joueur</button>
      </div>

      {rows.length === 0 && <p className={s.empty}>Aucun joueur sur cette partie.</p>}

      {rows.map(row => (
        <div key={row.key} className={styles.gameRow}>
          <select value={row.playerId} onChange={e => updateRow(row.key, { playerId: e.target.value })}>
            <option value="">Joueur…</option>
            {players
              .filter(p => String(p.id) === row.playerId || !usedIds.has(String(p.id)))
              .map(p => <option key={p.id} value={p.id}>{p.pseudo}</option>)}
          </select>
          <select value={row.roleId} onChange={e => changeRole(row.key, e.target.value)}>
            <option value="">Rôle…</option>
            {TEAMS.map(team => (
              <optgroup key={team.id} label={`${team.icon} ${team.label}`}>
                {roles.filter(r => r.team === team.id).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </optgroup>
            ))}
          </select>
          <label className={s.checkRow}>
            <input
              type="checkbox"
              checked={row.won}
              onChange={e => updateRow(row.key, { won: e.target.checked, touched: true })}
            />
            Victoire
          </label>
          <input
            type="number"
            value={row.points}
            onChange={e => updateRow(row.key, { points: e.target.value })}
            placeholder="Points"
          />
          <button
            type="button"
            className={`${s.iconBtn} ${s.iconBtnDanger}`}
            onClick={() => removeRow(row.key)}
            title="Retirer"
          >
            ✕
          </button>
        </div>
      ))}
    </FormModal>
  );
}
