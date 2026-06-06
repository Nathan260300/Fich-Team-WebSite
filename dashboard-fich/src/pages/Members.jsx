import { usePageTitle } from '../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import styles from './Members.module.css';

const EDGE_AVATAR = 'https://unhfpfhsidmyxwcfdnek.supabase.co/functions/v1/get-discord-avatar';
const DISCORD_ID_RE = /^\d{17,20}$/;
const STORAGE = 'https://unhfpfhsidmyxwcfdnek.supabase.co/storage/v1/object/public/media';

const toWebp = (file) => new Promise((resolve, reject) => {
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Conversion échouée')), 'image/webp', 0.9);
  };
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image invalide')); };
  img.src = url;
});

function AvatarPreview({ value }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!value) { setUrl(null); return; }
    if (!DISCORD_ID_RE.test(value.trim())) { setUrl(`${STORAGE}/${value}`); return; }
    fetch(EDGE_AVATAR, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ discord_id: value.trim() }) })
      .then(r => r.json()).then(d => setUrl(d.avatar_url ?? null)).catch(() => setUrl(null));
  }, [value]);
  if (!url) return <div className={styles.avatarFallback}>?</div>;
  return <img src={url} alt="" className={styles.avatarImg} />;
}

function UploadBtn({ label, uploading, onFile }) {
  return (
    <label className={styles.uploadBtn}>
      {uploading ? 'Upload…' : label}
      <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />
    </label>
  );
}

function MemberModal({ member, onClose, onSave }) {
  const isNew = !member.id;
  const [form, setForm] = useState({ pseudo: member.pseudo ?? '', avatar: member.avatar ?? '', banner: member.banner ?? '', description: member.description ?? '' });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleUploadAvatar = async (file) => {
    if (!form.pseudo.trim()) { setError('Saisis le pseudo avant d\'uploader l\'avatar.'); return; }
    setUploadingAvatar(true); setError(null);
    try {
      const blob = await toWebp(file);
      const pseudo = form.pseudo.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'member';
      const path = `data-img/members/pp-${pseudo}.webp`;
      const { error: upErr } = await supabase.storage.from('media').upload(path, blob, { upsert: true, contentType: 'image/webp' });
      if (upErr) { setError(upErr.message); } else { set('avatar', path); }
    } catch (e) { setError(e.message); }
    setUploadingAvatar(false);
  };

  const handleUploadBanner = async (file) => {
    setUploadingBanner(true); setError(null);
    try {
      const { data: existing } = await supabase.storage.from('media').list('data-img/members', { search: 'banner' });
      const nums = (existing ?? []).map(f => { const m = f.name.match(/banner(\d+)\.webp$/); return m ? parseInt(m[1]) : -1; });
      const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 0;
      const path = `data-img/members/banner${nextNum}.webp`;
      const blob = await toWebp(file);
      const { error: upErr } = await supabase.storage.from('media').upload(path, blob, { upsert: false, contentType: 'image/webp' });
      if (upErr) { setError(upErr.message); } else { set('banner', path); }
    } catch (e) { setError(e.message); }
    setUploadingBanner(false);
  };

  const handleSave = async () => {
    if (!form.pseudo.trim()) { setError('Le pseudo est requis.'); return; }
    setSaving(true); setError(null);
    const payload = { pseudo: form.pseudo.trim(), avatar: form.avatar.trim() || null, banner: form.banner.trim() || null, description: form.description.trim() || null };
    let err;
    if (isNew) {
      const { data: maxRow } = await supabase.from('members').select('sort_order').order('sort_order', { ascending: false }).limit(1).single();
      payload.sort_order = (maxRow?.sort_order ?? -1) + 1;
      ({ error: err } = await supabase.from('members').insert(payload));
    } else {
      ({ error: err } = await supabase.from('members').update(payload).eq('id', member.id));
    }
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSave();
  };

  return (
    <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className={styles.modal} initial={{ opacity: 0, y: 32, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }} transition={{ duration: 0.25, ease: [0.16,1,0.3,1] }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{isNew ? 'Ajouter un membre' : 'Modifier le membre'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarPreviewWrap}><AvatarPreview value={form.avatar} /></div>
            <div className={styles.field} style={{ flex: 1 }}>
              <label className={styles.label}>Avatar</label>
              <input value={form.avatar} onChange={e => set('avatar', e.target.value)} placeholder="ID Discord ou chemin storage" />
              <span className={styles.hint}>Ex: 1316068882154393693</span>
              <UploadBtn label="📁 Uploader un avatar" uploading={uploadingAvatar} onFile={handleUploadAvatar} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Pseudo *</label>
            <input value={form.pseudo} onChange={e => set('pseudo', e.target.value)} placeholder="Pseudo du membre" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Bannière</label>
            <input value={form.banner} onChange={e => set('banner', e.target.value)} placeholder="data-img/members/banner0.webp" />
            {form.banner && <img src={`${STORAGE}/${form.banner}`} alt="" style={{ width: '100%', aspectRatio: '3/1', objectFit: 'cover', borderRadius: 'var(--r-sm)', marginTop: 4 }} />}
            <UploadBtn label="📁 Uploader une bannière" uploading={uploadingBanner} onFile={handleUploadBanner} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea rows={5} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Description du membre..." />
          </div>
          {error && <motion.p className={styles.error} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.p>}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnGhost} onClick={onClose}>Annuler</button>
          <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SortableRow({ member, onEdit, onDelete, onUp, onDown, isFirst, isLast }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: member.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  return (
    <motion.div ref={setNodeRef} style={style} className={styles.row} layout>
      <div className={styles.dragHandle} {...attributes} {...listeners}>⠿</div>
      <div className={styles.rowAvatar}><AvatarPreview value={member.avatar} /></div>
      <div className={styles.rowInfo}>
        <span className={styles.rowPseudo}>{member.pseudo}</span>
        <span className={styles.rowDesc}>{member.description?.slice(0, 60)}{member.description?.length > 60 ? '…' : ''}</span>
      </div>
      <div className={styles.rowActions}>
        <button className={styles.iconBtn} onClick={onUp} disabled={isFirst} title="Monter">↑</button>
        <button className={styles.iconBtn} onClick={onDown} disabled={isLast} title="Descendre">↓</button>
        <button className={styles.iconBtn} onClick={onEdit} title="Modifier">✏️</button>
        <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={onDelete} title="Supprimer">🗑️</button>
      </div>
    </motion.div>
  );
}

export default function Members() {
  usePageTitle('Membres');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('members').select('*').order('sort_order');
    setMembers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const reordered = arrayMove(members, members.findIndex(m => m.id === active.id), members.findIndex(m => m.id === over.id));
    setMembers(reordered);
    await Promise.all(reordered.map((m, i) => supabase.from('members').update({ sort_order: i }).eq('id', m.id)));
  };

  const move = async (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= members.length) return;
    const reordered = arrayMove(members, idx, newIdx);
    setMembers(reordered);
    await Promise.all(reordered.map((m, i) => supabase.from('members').update({ sort_order: i }).eq('id', m.id)));
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce membre ?')) return;
    await supabase.from('members').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <PageHeader title="Membres" desc="Gérer les membres de la FICH Team." action={
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} className={styles.btnPrimary} onClick={() => setModal({})}>+ Ajouter</motion.button>
      } />
      {loading ? (
        <div className={styles.loading}>
          {[0,1,2].map(i => <motion.span key={i} className={styles.loadingDot} animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />)}
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={members.map(m => m.id)} strategy={verticalListSortingStrategy}>
            <motion.div className={styles.list} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
              {members.map((m, i) => (
                <motion.div key={m.id} variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}>
                  <SortableRow member={m} isFirst={i === 0} isLast={i === members.length - 1}
                    onEdit={() => setModal(m)} onDelete={() => handleDelete(m.id)}
                    onUp={() => move(i, -1)} onDown={() => move(i, 1)} />
                </motion.div>
              ))}
            </motion.div>
          </SortableContext>
        </DndContext>
      )}
      <AnimatePresence>
        {modal && <MemberModal member={modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
      </AnimatePresence>
    </div>
  );
}