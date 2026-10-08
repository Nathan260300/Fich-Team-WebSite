import { useState } from 'react';
import { supabase, mediaUrl } from '../../lib/supabase';
import { toWebp, slugify } from '../../lib/image';
import { nextSortOrder } from '../../lib/order';
import FormModal from '../FormModal';
import s from '../../pages/shared.module.css';
import styles from './Activities.module.css';

export default function ActivityModal({ activity, onClose, onSave }) {
  const isNew = !activity.id;
  const [form, setForm] = useState({
    name: activity.name ?? '',
    slug: activity.slug ?? '',
    icon: activity.icon ?? '',
    image: activity.image ?? '',
    short_description: activity.short_description ?? '',
    route: activity.route ?? '',
  });
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const changeName = value => {
    setForm(f => ({ ...f, name: value, slug: slugTouched ? f.slug : slugify(value) }));
  };

  const upload = async file => {
    const slug = form.slug.trim() || slugify(form.name);
    if (!slug) {
      setError('Saisis le nom avant d’uploader une image.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const blob = await toWebp(file);
      const path = `data-img/activities/${slug}.webp`;
      const { error: upError } = await supabase.storage
        .from('media')
        .upload(path, blob, { upsert: true, contentType: 'image/webp' });
      if (upError) setError(upError.message);
      else set('image', path);
    } catch (e) {
      setError(e.message);
    }
    setUploading(false);
  };

  const save = async () => {
    const name = form.name.trim();
    const slug = form.slug.trim();
    if (!name) {
      setError('Le nom est requis.');
      return;
    }
    if (!slug) {
      setError('Le slug est requis.');
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError('Le slug ne peut contenir que des minuscules, chiffres et tirets.');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      name,
      slug,
      icon: form.icon.trim() || null,
      image: form.image.trim() || null,
      short_description: form.short_description.trim() || null,
      route: form.route.trim() || null,
    };
    let result;
    if (isNew) {
      payload.sort_order = await nextSortOrder('activities');
      result = await supabase.from('activities').insert(payload);
    } else {
      result = await supabase.from('activities').update(payload).eq('id', activity.id);
    }
    setSaving(false);
    if (result.error) {
      setError(result.error.code === '23505' ? 'Ce slug est déjà utilisé.' : result.error.message);
      return;
    }
    onSave();
  };

  const preview = mediaUrl(form.image.trim());

  return (
    <FormModal
      title={isNew ? 'Ajouter une activité' : 'Modifier l’activité'}
      onClose={onClose}
      onSubmit={save}
      saving={saving}
      error={error}
    >
      <div className={s.field}>
        <label className={s.label}>Nom *</label>
        <input value={form.name} onChange={e => changeName(e.target.value)} placeholder="Blood on the Clocktower" autoFocus />
      </div>

      <div className={s.row2}>
        <div className={s.field}>
          <label className={s.label}>Slug *</label>
          <input
            value={form.slug}
            onChange={e => {
              setSlugTouched(true);
              set('slug', e.target.value);
            }}
            placeholder="botc"
          />
          <span className={s.hint}>Identifiant unique, utilisé aussi pour le nom de l’image.</span>
        </div>
        <div className={s.field}>
          <label className={s.label}>Icône</label>
          <input value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🩸" />
          <span className={s.hint}>Affichée quand il n’y a pas d’image.</span>
        </div>
      </div>

      <div className={s.field}>
        <label className={s.label}>Description courte</label>
        <textarea
          value={form.short_description}
          onChange={e => set('short_description', e.target.value)}
          placeholder="Jeu de déduction sociale…"
        />
      </div>

      <div className={s.field}>
        <label className={s.label}>Route sur le site</label>
        <input
          value={form.route}
          onChange={e => set('route', e.target.value)}
          placeholder="/activites/botc"
          list="activity-routes"
        />
        <datalist id="activity-routes">
          <option value="/activites/botc" />
        </datalist>
        <span className={s.hint}>Vide = la carte affiche « Bientôt » et n’est pas cliquable.</span>
      </div>

      <div className={s.field}>
        <label className={s.label}>Image</label>
        <input
          value={form.image}
          onChange={e => set('image', e.target.value)}
          placeholder="Chemin storage ou URL https://…"
        />
        <label className={s.uploadBtn}>
          {uploading ? 'Upload…' : '📁 Uploader une image'}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            disabled={uploading}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = '';
            }}
          />
        </label>
        {preview && <img src={preview} alt="" className={styles.preview} />}
      </div>
    </FormModal>
  );
}
