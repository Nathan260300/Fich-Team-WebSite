import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { nextSortOrder } from '../../lib/order';
import FormModal from '../FormModal';
import RichEditor from '../RichEditor';
import s from '../../pages/shared.module.css';

export default function RuleModal({ rule, onClose, onSave }) {
  const isNew = !rule.id;
  const [title, setTitle] = useState(rule.title ?? '');
  const [points, setPoints] = useState(rule.points === null || rule.points === undefined ? '' : String(rule.points));
  const [content, setContent] = useState(rule.content ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const save = async () => {
    if (!title.trim()) {
      setError('Le titre est requis.');
      return;
    }
    const parsed = points.trim() === '' ? null : parseInt(points, 10);
    if (parsed !== null && Number.isNaN(parsed)) {
      setError('Les points doivent être un nombre entier.');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = { title: title.trim(), points: parsed, content };
    let result;
    if (isNew) {
      payload.sort_order = await nextSortOrder('botc_rules');
      result = await supabase.from('botc_rules').insert(payload);
    } else {
      result = await supabase.from('botc_rules').update(payload).eq('id', rule.id);
    }
    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    onSave();
  };

  return (
    <FormModal
      title={isNew ? 'Ajouter une règle' : 'Modifier la règle'}
      onClose={onClose}
      onSubmit={save}
      saving={saving}
      error={error}
      maxWidth={820}
    >
      <div className={s.row2}>
        <div className={s.field}>
          <label className={s.label}>Titre *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Victoire" autoFocus />
        </div>
        <div className={s.field}>
          <label className={s.label}>Points</label>
          <input type="number" value={points} onChange={e => setPoints(e.target.value)} placeholder="Aucun" />
          <span className={s.hint}>Laisse vide pour une règle sans points.</span>
        </div>
      </div>
      <div className={s.field}>
        <label className={s.label}>Contenu</label>
        <RichEditor initialMarkdown={rule.content ?? ''} onChange={setContent} />
      </div>
    </FormModal>
  );
}
