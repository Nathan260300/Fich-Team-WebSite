import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import RichEditor from '../RichEditor';
import s from '../../pages/shared.module.css';
import styles from './Botc.module.css';

export default function InfoTab({ info, reload }) {
  const [description, setDescription] = useState(info.description ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const dirty = description !== (info.description ?? '');

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    const { error: saveError } = await supabase.from('botc_info').upsert({ id: 1, description });
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setSaved(true);
    reload();
  };

  return (
    <div>
      <div className={s.card}>
        <h2 className={s.sectionTitle}>Description du jeu</h2>
        <RichEditor
          initialMarkdown={info.description ?? ''}
          onChange={value => {
            setDescription(value);
            setSaved(false);
          }}
        />
      </div>

      {error && <p className={s.error}>{error}</p>}

      <div className={styles.saveBar}>
        {saved && !dirty && <span className={styles.savedText}>✓ Enregistré</span>}
        <button type="button" className={s.btnPrimary} onClick={save} disabled={saving || !dirty}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
