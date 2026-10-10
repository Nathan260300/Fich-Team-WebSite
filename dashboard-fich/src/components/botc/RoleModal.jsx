import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { TEAMS } from '../../lib/botc';
import FormModal from '../FormModal';
import RichEditor from '../RichEditor';
import s from '../../pages/shared.module.css';

export default function RoleModal({ role, usage, onClose, onSave }) {
  const isNew = !role.id;
  const [name, setName] = useState(role.name ?? '');
  const [team, setTeam] = useState(role.team ?? 'citadin');
  const [description, setDescription] = useState(role.description ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const save = async () => {
    if (!name.trim()) {
      setError('Le nom est requis.');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = { name: name.trim(), team, description };
    const result = isNew
      ? await supabase.from('botc_roles').insert(payload)
      : await supabase.from('botc_roles').update(payload).eq('id', role.id);
    setSaving(false);
    if (result.error) {
      setError(result.error.code === '23505' ? 'Ce rôle existe déjà.' : result.error.message);
      return;
    }
    onSave();
  };

  const remove = async () => {
    if (usage > 0) {
      setError(`Ce rôle est utilisé dans ${usage} participation(s) : impossible de le supprimer.`);
      return;
    }
    if (!confirm(`Supprimer le rôle « ${role.name} » ?`)) return;
    setSaving(true);
    const { error: deleteError } = await supabase.from('botc_roles').delete().eq('id', role.id);
    setSaving(false);
    if (deleteError) {
      setError(deleteError.code === '23503' ? 'Ce rôle est utilisé dans des parties.' : deleteError.message);
      return;
    }
    onSave();
  };

  return (
    <FormModal
      title={isNew ? 'Ajouter un rôle' : `Modifier ${role.name}`}
      onClose={onClose}
      onSubmit={save}
      saving={saving}
      error={error}
      maxWidth={820}
      leftAction={!isNew && <button type="button" className={s.btnDanger} onClick={remove}>Supprimer</button>}
    >
      <div className={s.row2}>
        <div className={s.field}>
          <label className={s.label}>Nom *</label>
          <input value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div className={s.field}>
          <label className={s.label}>Équipe</label>
          <select value={team} onChange={e => setTeam(e.target.value)}>
            {TEAMS.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
          </select>
        </div>
      </div>
      <div className={s.field}>
        <label className={s.label}>Description</label>
        <RichEditor stickyTop="auto" initialMarkdown={role.description ?? ''} onChange={setDescription} />
        <span className={s.hint}>Affichée dans la fenêtre du rôle, sur l’onglet Rôles du site.</span>
      </div>
    </FormModal>
  );
}