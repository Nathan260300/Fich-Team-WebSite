import { usePageTitle } from '../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import s from './shared.module.css';

function InfoModal({ info, projectId, onClose, onSave }) {
  const isNew = !info.id;
  const [form, setForm] = useState({ icon: info.icon ?? '', label: info.label ?? '', value: info.value ?? '', url: info.url ?? '', highlight: info.highlight ?? false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.label.trim()) { setError('Le label est requis.'); return; }
    setSaving(true); setError(null);
    const payload = { next_project_id: projectId, icon: form.icon.trim() || null, label: form.label.trim(), value: form.value.trim() || null, url: form.url.trim() || null, highlight: form.highlight };
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
    <motion.div className={s.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className={s.modal} initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }}>
        <div className={s.modalHeader}>
          <h2 className={s.modalTitle}>{isNew ? "Ajouter une info" : "Modifier l'info"}</h2>
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
          <div className={s.field}>
            <label className={s.label}>Lien (optionnel)</label>
            <input value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://..." />
            <span className={s.hint}>Si renseigné, la carte devient cliquable</span>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: 'var(--c-muted)', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.highlight} onChange={e => set('highlight', e.target.checked)} style={{ width: 'auto' }} />
            Mettre en avant (highlight)
          </label>
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

export default function NextProject() {
  usePageTitle('Prochain event');
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

  const boxStyle = { background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-lg)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 };
  const titleStyle = { fontFamily: 'var(--f-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--c-text)' };

  return (
    <div>
      <PageHeader title="Prochain event" desc="Modifier les informations du prochain événement." />
      <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <motion.div style={boxStyle} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
          <h3 style={titleStyle}>Informations générales</h3>
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
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} className={s.btnPrimary} style={{ alignSelf: 'flex-start' }} onClick={handleSave} disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </motion.button>
        </motion.div>

        <motion.div style={boxStyle} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={titleStyle}>Infos affichées</h3>
            {project && <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} className={s.btnPrimary} onClick={() => setInfoModal({})}>+ Ajouter</motion.button>}
          </div>
          <motion.div className={s.list} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
            {infos.map(info => (
              <motion.div key={info.id} className={s.row} variants={{ hidden: { opacity: 0, x: -14 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{info.icon}</span>
                <div className={s.rowInfo}>
                  <span className={s.rowName}>{info.label}</span>
                  <span className={s.rowSub}>{info.value}</span>
                </div>
                {info.url && (
                  <a href={info.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--c-accent)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    Ouvrir <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                )}
                {info.highlight && <span className={`${s.badge} ${s.badgeSure}`}>Highlight</span>}
                <div className={s.rowActions}>
                  <button className={s.iconBtn} onClick={() => setInfoModal(info)} title="Modifier">✏️</button>
                  <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={() => handleDeleteInfo(info.id)} title="Supprimer">🗑️</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {infoModal && project && <InfoModal info={infoModal} projectId={project.id} onClose={() => setInfoModal(null)} onSave={() => { setInfoModal(null); load(); }} />}
      </AnimatePresence>
    </div>
  );
}