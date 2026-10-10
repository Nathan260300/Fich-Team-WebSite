import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import FormModal from '../FormModal';
import s from '../../pages/shared.module.css';

export default function PlayerModal({ player, gameCount, onClose, onSave }) {
  const isNew = !player.id;
  const [form, setForm] = useState({
    pseudo: player.pseudo ?? '',
    minecraft_username: player.minecraft_username ?? '',
    highlight: player.highlight ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const save = async () => {
    const pseudo = form.pseudo.trim();
    if (!pseudo) {
      setError('Le pseudo est requis.');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      pseudo,
      minecraft_username: form.minecraft_username.trim() || null,
      highlight: form.highlight.trim() || null,
    };
    const result = isNew
      ? await supabase.from('botc_players').insert(payload)
      : await supabase.from('botc_players').update(payload).eq('id', player.id);
    setSaving(false);
    if (result.error) {
      setError(result.error.code === '23505' ? 'Ce pseudo existe déjà.' : result.error.message);
      return;
    }
    onSave();
  };

  const remove = async () => {
    const warning = gameCount > 0
      ? `Supprimer ${player.pseudo} ? Ses ${gameCount} participation(s) aux parties seront aussi supprimées.`
      : `Supprimer ${player.pseudo} ?`;
    if (!confirm(warning)) return;
    setSaving(true);
    const { error: deleteError } = await supabase.from('botc_players').delete().eq('id', player.id);
    setSaving(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    onSave();
  };

  return (
    <FormModal
      title={isNew ? 'Ajouter un joueur' : `Modifier ${player.pseudo}`}
      onClose={onClose}
      onSubmit={save}
      saving={saving}
      error={error}
      leftAction={!isNew && <button type="button" className={s.btnDanger} onClick={remove}>Supprimer</button>}
    >
      <div className={s.row2}>
        <div className={s.field}>
          <label className={s.label}>Pseudo *</label>
          <input value={form.pseudo} onChange={e => set('pseudo', e.target.value)} autoFocus />
        </div>
        <div className={s.field}>
          <label className={s.label}>Pseudo Minecraft</label>
          <input value={form.minecraft_username} onChange={e => set('minecraft_username', e.target.value)} />
          <span className={s.hint}>Sert à afficher le skin.</span>
        </div>
      </div>

      <div className={s.field}>
        <label className={s.label}>Fait d’armes</label>
        <input value={form.highlight} onChange={e => set('highlight', e.target.value)} placeholder="Citation affichée sous son pseudo" />
      </div>
    </FormModal>
  );
}
