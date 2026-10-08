import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toInputValue, fromInputValue } from '../../lib/dates';
import FormModal from '../FormModal';
import s from '../../pages/shared.module.css';

export default function EventModal({ event, defaultStart, tags, onClose, onSave }) {
  const isNew = !event.id;
  const [form, setForm] = useState({
    title: event.title ?? '',
    tag: event.tag ?? 'Général',
    starts_at: event.starts_at ? toInputValue(event.starts_at) : defaultStart ?? '',
    ends_at: toInputValue(event.ends_at),
    description: event.description ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const save = async () => {
    const title = form.title.trim();
    const tag = form.tag.trim();
    if (!title) {
      setError('Le titre est requis.');
      return;
    }
    if (!tag) {
      setError('Le tag est requis.');
      return;
    }
    if (!form.starts_at) {
      setError('La date de début est requise.');
      return;
    }
    if (form.ends_at && new Date(form.ends_at) < new Date(form.starts_at)) {
      setError('La fin doit être après le début.');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      title,
      tag,
      starts_at: fromInputValue(form.starts_at),
      ends_at: fromInputValue(form.ends_at),
      description: form.description.trim() || null,
    };
    const result = isNew
      ? await supabase.from('events').insert(payload)
      : await supabase.from('events').update(payload).eq('id', event.id);
    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    onSave();
  };

  const remove = async () => {
    if (!confirm(`Supprimer l’événement « ${event.title} » ?`)) return;
    setSaving(true);
    const { error: deleteError } = await supabase.from('events').delete().eq('id', event.id);
    setSaving(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    onSave();
  };

  return (
    <FormModal
      title={isNew ? 'Ajouter un événement' : 'Modifier l’événement'}
      onClose={onClose}
      onSubmit={save}
      saving={saving}
      error={error}
      leftAction={!isNew && <button type="button" className={s.btnDanger} onClick={remove}>Supprimer</button>}
    >
      <div className={s.field}>
        <label className={s.label}>Titre *</label>
        <input
          value={form.title}
          onChange={e => set('title', e.target.value)}
          maxLength={120}
          placeholder="Soirée BOTC"
          autoFocus
        />
      </div>

      <div className={s.field}>
        <label className={s.label}>Tag *</label>
        <input value={form.tag} onChange={e => set('tag', e.target.value)} maxLength={40} list="event-tags" />
        <datalist id="event-tags">
          {tags.map(tag => <option key={tag} value={tag} />)}
        </datalist>
        <span className={s.hint}>La couleur est déterminée automatiquement par le tag.</span>
      </div>

      <div className={s.row2}>
        <div className={s.field}>
          <label className={s.label}>Début *</label>
          <input type="datetime-local" value={form.starts_at} onChange={e => set('starts_at', e.target.value)} />
        </div>
        <div className={s.field}>
          <label className={s.label}>Fin</label>
          <input type="datetime-local" value={form.ends_at} onChange={e => set('ends_at', e.target.value)} />
        </div>
      </div>

      <div className={s.field}>
        <label className={s.label}>Description</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          maxLength={2000}
          placeholder="Détails de la session…"
        />
        <span className={s.hint}>{form.description.length} / 2000</span>
      </div>
    </FormModal>
  );
}
