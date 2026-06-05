import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import styles from './TimelineManager.module.css';

function ItemModal({ item, onClose, onSave }) {
  const isNew = !item.id;
  const [form, setForm] = useState({ id: item.id ?? '', name: item.name ?? '', subtitle: item.subtitle ?? '', date: item.date ?? '', date_label: item.date_label ?? '', icon: item.icon ?? '', uncertain: item.uncertain ?? false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Le nom est requis.'); return; }
    if (isNew && !form.id.trim()) { setError("L'ID est requis."); return; }
    setSaving(true); setError(null);
    const payload = { name: form.name.trim(), subtitle: form.subtitle.trim() || null, date: form.date || null, date_label: form.date_label.trim() || null, icon: form.icon.trim() || null, uncertain: form.uncertain };
    let err;
    if (isNew) {
      const { data: maxRow } = await supabase.from(item._table).select('sort_order').order('sort_order', { ascending: false }).limit(1).single();
      payload.sort_order = (maxRow?.sort_order ?? -1) + 1;
      payload.id = form.id.trim();
      ({ error: err } = await supabase.from(item._table).insert(payload));
    } else {
      ({ error: err } = await supabase.from(item._table).update(payload).eq('id', item.id));
    }
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSave();
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{isNew ? 'Ajouter' : 'Modifier'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          {isNew && (
            <div className={styles.field}>
              <label className={styles.label}>ID (slug unique) *</label>
              <input value={form.id} onChange={e => set('id', e.target.value)} placeholder="ex: event-minecraft-2025" />
            </div>
          )}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Icône (emoji)</label>
              <input value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🎮" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Nom *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nom du projet" />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Sous-titre</label>
            <input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Description courte" />
          </div>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Label date affiché</label>
              <input value={form.date_label} onChange={e => set('date_label', e.target.value)} placeholder="Été 2025" />
            </div>
          </div>
          <label className={styles.checkRow}>
            <input type="checkbox" checked={form.uncertain} onChange={e => set('uncertain', e.target.checked)} />
            <span>Date incertaine (~)</span>
          </label>
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

export default function TimelineManager({ table, title, desc }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from(table).select('*').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [table]);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet élément ?')) return;
    await supabase.from(table).delete().eq('id', id);
    load();
  };

  const move = async (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= items.length) return;
    const reordered = [...items];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    setItems(reordered);
    await Promise.all(reordered.map((it, i) => supabase.from(table).update({ sort_order: i }).eq('id', it.id)));
  };

  return (
    <div>
      <PageHeader title={title} desc={desc} action={<button className={styles.btnPrimary} onClick={() => setModal({ _table: table })}>+ Ajouter</button>} />
      {loading ? <div className={styles.loading}>Chargement…</div> : (
        <div className={styles.list}>
          {items.map((item, i) => (
            <div key={item.id} className={styles.item}>
              <span className={styles.itemIcon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemMeta}>{item.subtitle} {item.date_label && `· ${item.uncertain ? '~' : ''}${item.date_label}`}</span>
              </div>
              <div className={styles.itemActions}>
                <button className={styles.iconBtn} onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                <button className={styles.iconBtn} onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</button>
                <button className={styles.iconBtn} onClick={() => setModal({ ...item, _table: table })}>✏️</button>
                <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={() => handleDelete(item.id)}>🗑️</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className={styles.empty}>Aucun élément.</p>}
        </div>
      )}
      {modal && <ItemModal item={modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
    </div>
  );
}
