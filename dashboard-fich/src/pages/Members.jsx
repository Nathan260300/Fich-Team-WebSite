import { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import styles from './Members.module.css';

const EDGE_AVATAR = 'https://unhfpfhsidmyxwcfdnek.supabase.co/functions/v1/get-discord-avatar';
const DISCORD_ID_RE = /^\d{17,20}$/;
const STORAGE = 'https://unhfpfhsidmyxwcfdnek.supabase.co/storage/v1/object/public/media';

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

function MemberModal({ member, onClose, onSave }) {
  const isNew = !member.id;
  const [form, setForm] = useState({ pseudo: member.pseudo ?? '', avatar: member.avatar ?? '', banner: member.banner ?? '', description: member.description ?? '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

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
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{isNew ? 'Ajouter un membre' : 'Modifier le membre'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarPreviewWrap}><AvatarPreview value={form.avatar} /></div>
            <div className={styles.field}>
              <label className={styles.label}>Avatar</label>
              <input value={form.avatar} onChange={e => set('avatar', e.target.value)} placeholder="ID Discord ou chemin storage" />
              <span className={styles.hint}>Ex: 1316068882154393693 ou data-img/members/pp-xxx.webp</span>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Pseudo *</label>
            <input value={form.pseudo} onChange={e => set('pseudo', e.target.value)} placeholder="Pseudo du membre" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Bannière (chemin storage)</label>
            <input value={form.banner} onChange={e => set('banner', e.target.value)} placeholder="data-img/members/banner0.webp" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea rows={5} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Description du membre..." />
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnGhost} onClick={onClose}>Annuler</button>
          <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </div>
    </div>
  );
}

function SortableRow({ member, onEdit, onDelete, onUp, onDown, isFirst, isLast }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: member.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  return (
    <div ref={setNodeRef} style={style} className={styles.row}>
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
    </div>
  );
}

export default function Members() {
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
      <PageHeader title="Membres" desc="Gérer les membres de la FICH Team." action={<button className={styles.btnPrimary} onClick={() => setModal({})}>+ Ajouter</button>} />
      {loading ? <div className={styles.loading}>Chargement…</div> : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={members.map(m => m.id)} strategy={verticalListSortingStrategy}>
            <div className={styles.list}>
              {members.map((m, i) => (
                <SortableRow key={m.id} member={m} isFirst={i === 0} isLast={i === members.length - 1}
                  onEdit={() => setModal(m)} onDelete={() => handleDelete(m.id)}
                  onUp={() => move(i, -1)} onDown={() => move(i, 1)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      {modal && <MemberModal member={modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
    </div>
  );
}
