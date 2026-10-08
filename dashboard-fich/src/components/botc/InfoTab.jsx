import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import RichEditor from '../RichEditor';
import s from '../../pages/shared.module.css';
import styles from './Botc.module.css';

function toCount(value) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) || n < 0 ? 0 : n;
}

export default function InfoTab({ info, reload }) {
  const [description, setDescription] = useState(info.description ?? '');
  const [demons, setDemons] = useState(String(info.base_demon_wins ?? 0));
  const [citadins, setCitadins] = useState(String(info.base_citadin_wins ?? 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const dirty =
    description !== (info.description ?? '') ||
    toCount(demons) !== (info.base_demon_wins ?? 0) ||
    toCount(citadins) !== (info.base_citadin_wins ?? 0);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    const { error: saveError } = await supabase.from('botc_info').upsert({
      id: 1,
      description,
      base_demon_wins: toCount(demons),
      base_citadin_wins: toCount(citadins),
    });
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
        <RichEditor initialMarkdown={info.description ?? ''} onChange={value => { setDescription(value); setSaved(false); }} />
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
