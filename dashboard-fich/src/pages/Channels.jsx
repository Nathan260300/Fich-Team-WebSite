import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import s from './shared.module.css';

function ChannelModal({ channel, onClose, onSave }) {
  const isNew = !channel.id;
  const [form, setForm] = useState({ name: channel.name ?? '', description: channel.description ?? '', url: channel.url ?? '', avatar: channel.avatar ?? '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Le nom est requis.'); return; }
    setSaving(true); setError(null);
    const payload = { name: form.name.trim(), description: form.description.trim() || null, url: form.url.trim() || null, avatar: form.avatar.trim() || null };
    let err;
    if (isNew) {
      const { data: maxRow } = await supabase.from('channels').select('sort_order').order('sort_order', { ascending: false }).limit(1).single();
      payload.sort_order = (maxRow?.sort_order ?? -1) + 1;
      ({ error: err } = await supabase.from('channels').insert(payload));
    } else {
      ({ error: err } = await supabase.from('channels').update(payload).eq('id', channel.id));
    }
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSave();
  };

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.modalHeader}>
          <h2 className={s.modalTitle}>{isNew ? 'Ajouter un partenaire' : 'Modifier le partenaire'}</h2>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={s.modalBody}>
          <div className={s.field}>
            <label className={s.label}>Nom *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nom de la chaîne" />
          </div>
          <div className={s.field}>
            <label className={s.label}>Description</label>
            <input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Description courte" />
          </div>
          <div className={s.field}>
            <label className={s.label}>URL YouTube</label>
            <input value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://youtube.com/@..." />
          </div>
          <div className={s.field}>
            <label className={s.label}>Avatar (URL)</label>
            <input value={form.avatar} onChange={e => set('avatar', e.target.value)} placeholder="https://..." />
            {form.avatar && <img src={form.avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginTop: 4 }} />}
          </div>
          {error && <p className={s.error}>{error}</p>}
        </div>
        <div className={s.modalFooter}>
          <button className={s.btnGhost} onClick={onClose}>Annuler</button>
          <button className={s.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </div>
    </div>
  );
}

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('channels').select('*').order('sort_order');
    setChannels(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce partenaire ?')) return;
    await supabase.from('channels').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <PageHeader title="Partenaires" desc="Gérer les chaînes partenaires." action={<button className={s.btnPrimary} onClick={() => setModal({})}>+ Ajouter</button>} />
      {loading ? <div className={s.loading}>Chargement…</div> : (
        <div className={s.list}>
          {channels.map(c => (
            <div key={c.id} className={s.row}>
              {c.avatar && <img src={c.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />}
              <div className={s.rowInfo}>
                <span className={s.rowName}>{c.name}</span>
                <span className={s.rowSub}>{c.description}</span>
              </div>
              <div className={s.rowActions}>
                <button className={s.iconBtn} onClick={() => setModal(c)} title="Modifier">✏️</button>
                <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={() => handleDelete(c.id)} title="Supprimer">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && <ChannelModal channel={modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
    </div>
  );
}
