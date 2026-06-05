import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import s from './shared.module.css';

function InfoModal({ info, projectId, onClose, onSave }) {
  const isNew = !info.id;
  const [form, setForm] = useState({ icon: info.icon ?? '', label: info.label ?? '', value: info.value ?? '', highlight: info.highlight ?? false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.label.trim()) { setError('Le label est requis.'); return; }
    setSaving(true); setError(null);
    const payload = { next_project_id: projectId, icon: form.icon.trim() || null, label: form.label.trim(), value: form.value.trim() || null, highlight: form.highlight };
    let err;
    if (isNew) {
      const { data: maxRow } = await supabase.from('next_project_infos').select('sort_order').order('sort_order', { ascending: false }).limit(1).single();
      payload.sort_order = (maxRow?.sort_order ?? -1) + 1;
      ({ error: err } = await supabase.from('next_project_infos').insert(payload));
    } else {
      ({ error: err } = await supabase.from('next_project_infos').update(payload).eq('id', info.id));
    }
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSave();
  };

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.modalHeader}>
          <h2 className={s.modalTitle}>{isNew ? 'Ajouter une info' : 'Modifier l\'info'}</h2>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={s.modalBody}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12 }}>
            <div className={s.field}>
              <label className={s.label}>Icône</label>
              <input value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🗺️" />
            </div>
            <div className={s.field}>
              <label className={s.label}>Label *</label>
              <input value={form.label} onChange={e => set('label', e.target.value)} placeholder="Serveur" />
            </div>
          </div>
          <div className={s.field}>
            <label className={s.label}>Valeur</label>
            <input value={form.value} onChange={e => set('value', e.target.value)} placeholder="survival.fich.fr" />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: 'var(--c-muted)', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.highlight} onChange={e => set('highlight', e.target.checked)} style={{ width: 'auto' }} />
            Mettre en avant (highlight)
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

export default function NextProject() {
  const [project, setProject] = useState(null);
  const [infos, setInfos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [infoModal, setInfoModal] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', date: '', form_url: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const load = async () => {
    setLoading(true);
    const { data: p } = await supabase.from('next_project').select('*').single();
    const { data: i } = await supabase.from('next_project_infos').select('*').order('sort_order');
    setProject(p ?? null);
    setInfos(i ?? []);
    if (p) setForm({ name: p.name ?? '', description: p.description ?? '', date: p.date ?? '', form_url: p.form_url ?? '' });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    const payload = { name: form.name.trim(), description: form.description.trim() || null, date: form.date || null, form_url: form.form_url.trim() || null };
    if (project) {
      await supabase.from('next_project').update(payload).eq('id', project.id);
    } else {
      await supabase.from('next_project').insert(payload);
    }
    setSaving(false);
    load();
  };

  const handleDeleteInfo = async (id) => {
    if (!confirm('Supprimer cette info ?')) return;
    await supabase.from('next_project_infos').delete().eq('id', id);
    load();
  };

  if (loading) return <div className={s.loading}>Chargement…</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageHeader title="Prochain event" desc="Modifier les informations du prochain événement." />

      <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-lg)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--c-text)' }}>Informations générales</h3>
        <div className={s.field}>
          <label className={s.label}>Nom de l'event</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Survival Season 3" />
        </div>
        <div className={s.field}>
          <label className={s.label}>Description</label>
          <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Description de l'event..." />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className={s.field}>
            <label className={s.label}>Date</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div className={s.field}>
            <label className={s.label}>URL Formulaire</label>
            <input value={form.form_url} onChange={e => set('form_url', e.target.value)} placeholder="https://forms.google.com/..." />
          </div>
        </div>
        <button className={s.btnPrimary} style={{ alignSelf: 'flex-start' }} onClick={handleSave} disabled={saving}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>

      <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-lg)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--c-text)' }}>Infos affichées</h3>
          {project && <button className={s.btnPrimary} onClick={() => setInfoModal({})}>+ Ajouter</button>}
        </div>
        <div className={s.list}>
          {infos.map(info => (
            <div key={info.id} className={s.row}>
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{info.icon}</span>
              <div className={s.rowInfo}>
                <span className={s.rowName}>{info.label}</span>
                <span className={s.rowSub}>{info.value}</span>
              </div>
              {info.highlight && <span className={`${s.badge} ${s.badgeSure}`}>Highlight</span>}
              <div className={s.rowActions}>
                <button className={s.iconBtn} onClick={() => setInfoModal(info)} title="Modifier">✏️</button>
                <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={() => handleDeleteInfo(info.id)} title="Supprimer">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {infoModal && project && <InfoModal info={infoModal} projectId={project.id} onClose={() => setInfoModal(null)} onSave={() => { setInfoModal(null); load(); }} />}
    </div>
  );
}
