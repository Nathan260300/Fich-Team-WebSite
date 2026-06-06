import { usePageTitle } from '../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import s from './shared.module.css';

function VideoModal({ video, onClose, onSave }) {
  const isNew = !video.id;
  const [form, setForm] = useState({ id: video.id ?? '', title: video.title ?? '', creator: video.creator ?? '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.id.trim()) { setError("L'ID YouTube est requis."); return; }
    if (!form.title.trim()) { setError('Le titre est requis.'); return; }
    setSaving(true); setError(null);
    const payload = { id: form.id.trim(), title: form.title.trim(), creator: form.creator.trim() || null };
    let err;
    if (isNew) {
      const { data: maxRow } = await supabase.from('videos').select('sort_order').order('sort_order', { ascending: false }).limit(1).single();
      payload.sort_order = (maxRow?.sort_order ?? -1) + 1;
      ({ error: err } = await supabase.from('videos').insert(payload));
    } else {
      ({ error: err } = await supabase.from('videos').update({ title: payload.title, creator: payload.creator }).eq('id', video.id));
    }
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSave();
  };

  const thumb = form.id.trim() ? `https://img.youtube.com/vi/${form.id.trim()}/mqdefault.jpg` : null;

  return (
    <motion.div className={s.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className={s.modal} initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }}>
        <div className={s.modalHeader}>
          <h2 className={s.modalTitle}>{isNew ? 'Ajouter une vidéo' : 'Modifier la vidéo'}</h2>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={s.modalBody}>
          {thumb && <img src={thumb} alt="" style={{ borderRadius: 'var(--r-sm)', width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />}
          <div className={s.field}>
            <label className={s.label}>ID YouTube *</label>
            <input value={form.id} onChange={e => set('id', e.target.value)} placeholder="Ex: dQw4w9WgXcQ" disabled={!isNew} />
            <span className={s.hint}>La partie après ?v= dans l'URL YouTube</span>
          </div>
          <div className={s.field}>
            <label className={s.label}>Titre *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Titre de la vidéo" />
          </div>
          <div className={s.field}>
            <label className={s.label}>Créateur</label>
            <input value={form.creator} onChange={e => set('creator', e.target.value)} placeholder="Nom du créateur" />
          </div>
          {error && <motion.p className={s.error} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.p>}
        </div>
        <div className={s.modalFooter}>
          <button className={s.btnGhost} onClick={onClose}>Annuler</button>
          <button className={s.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Videos() {
  usePageTitle('Vidéos');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('videos').select('*').order('sort_order');
    setVideos(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette vidéo ?')) return;
    await supabase.from('videos').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <PageHeader title="Vidéos" desc="Gérer les vidéos YouTube affichées sur le site." action={
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} className={s.btnPrimary} onClick={() => setModal({})}>+ Ajouter</motion.button>
      } />
      {loading ? <div className={s.loading}>Chargement…</div> : (
        <motion.div className={s.list} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
          {videos.map(v => (
            <motion.div key={v.id} className={s.row} variants={{ hidden: { opacity: 0, x: -14 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}>
              <img src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`} alt="" style={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 'var(--r-xs)', flexShrink: 0 }} />
              <div className={s.rowInfo}>
                <span className={s.rowName}>{v.title}</span>
                <span className={s.rowSub}>{v.creator} · {v.id}</span>
              </div>
              <div className={s.rowActions}>
                <button className={s.iconBtn} onClick={() => setModal(v)} title="Modifier">✏️</button>
                <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={() => handleDelete(v.id)} title="Supprimer">🗑️</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      <AnimatePresence>
        {modal && <VideoModal video={modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
      </AnimatePresence>
    </div>
  );
}