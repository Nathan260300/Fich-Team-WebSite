import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import s from './shared.module.css';

function ProjectModal({ project, onClose, onSave }) {
  const isNew = !project.id;
  const [form, setForm] = useState({ id: project.id ?? '', name: project.name ?? '', subtitle: project.subtitle ?? '', date: project.date ?? '', date_label: project.date_label ?? '', icon: project.icon ?? '', uncertain: project.uncertain ?? false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.id.trim()) { setError('L\'ID est requis.'); return; }
    if (!form.name.trim()) { setError('Le nom est requis.'); return; }
    setSaving(true); setError(null);
    const payload = { id: form.id.trim(), name: form.name.trim(), subtitle: form.subtitle.trim() || null, date: form.date || null, date_label: form.date_label.trim() || null, icon: form.icon.trim() || null, uncertain: form.uncertain };
    let err;
    if (isNew) {
      const { data: maxRow } = await supabase.from('future_projects').select('sort_order').order('sort_order', { ascending: false }).limit(1).single();
      payload.sort_order = (maxRow?.sort_order ?? -1) + 1;
      ({ error: err } = await supabase.from('future_projects').insert(payload));
    } else {
      ({ error: err } = await supabase.from('future_projects').update(payload).eq('id', project.id));
    }
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSave();
  };

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.modalHeader}>
          <h2 className={s.modalTitle}>{isNew ? 'Ajouter un projet futur' : 'Modifier le projet'}</h2>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={s.modalBody}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className={s.field}>
              <label className={s.label}>ID *</label>
              <input value={form.id} onChange={e => set('id', e.target.value)} placeholder="ex: minecraft-2" disabled={!isNew} />
            </div>
            <div className={s.field}>
              <label className={s.label}>Icône</label>
              <input value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🎮" />
            </div>
          </div>
          <div className={s.field}>
            <label className={s.label}>Nom *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nom du projet" />
          </div>
          <div className={s.field}>
            <label className={s.label}>Sous-titre</label>
            <input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Sous-titre affiché sous le nom" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className={s.field}>
              <label className={s.label}>Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className={s.field}>
              <label className={s.label}>Label date</label>
              <input value={form.date_label} onChange={e => set('date_label', e.target.value)} placeholder="Ex: Été 2025" />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: 'var(--c-muted)', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.uncertain} onChange={e => set('uncertain', e.target.checked)} style={{ width: 'auto' }} />
            Date incertaine (~)
          </label>
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

export default function FutureProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('future_projects').select('*').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce projet ?')) return;
    await supabase.from('future_projects').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <PageHeader title="Futurs projets" desc="Gérer la timeline des futurs projets." action={<button className={s.btnPrimary} onClick={() => setModal({})}>+ Ajouter</button>} />
      {loading ? <div className={s.loading}>Chargement…</div> : (
        <div className={s.list}>
          {items.map(p => (
            <div key={p.id} className={s.row}>
              <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{p.icon}</span>
              <div className={s.rowInfo}>
                <span className={s.rowName}>{p.name}</span>
                <span className={s.rowSub}>{p.subtitle} · {p.date_label}</span>
              </div>
              <span className={`${s.badge} ${p.uncertain ? s.badgeUncertain : s.badgeSure}`}>{p.uncertain ? '~Incertain' : 'Confirmé'}</span>
              <div className={s.rowActions}>
                <button className={s.iconBtn} onClick={() => setModal(p)} title="Modifier">✏️</button>
                <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={() => handleDelete(p.id)} title="Supprimer">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && <ProjectModal project={modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
    </div>
  );
}
