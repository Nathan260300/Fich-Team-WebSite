import { usePageTitle } from '../hooks/usePageTitle';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import s from './shared.module.css';
import ps from './Projects.module.css';

const STORAGE_URL = 'https://unhfpfhsidmyxwcfdnek.supabase.co/storage/v1/object/public/media';

function ProjectModal({ project, onClose, onSave }) {
  const isNew = !project.id;
  const [form, setForm] = useState({ id: project.id ?? '', name: project.name ?? '', icon: project.icon ?? '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.id.trim()) { setError('L\'ID est requis.'); return; }
    if (!form.name.trim()) { setError('Le nom est requis.'); return; }
    setSaving(true); setError(null);
    const payload = { id: form.id.trim(), name: form.name.trim(), icon: form.icon.trim() || null };
    let err;
    if (isNew) {
      const { data: maxRow } = await supabase.from('projects').select('sort_order').order('sort_order', { ascending: false }).limit(1).single();
      payload.sort_order = (maxRow?.sort_order ?? -1) + 1;
      ({ error: err } = await supabase.from('projects').insert(payload));
    } else {
      ({ error: err } = await supabase.from('projects').update({ name: payload.name, icon: payload.icon }).eq('id', project.id));
    }
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSave();
  };

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.modalHeader}>
          <h2 className={s.modalTitle}>{isNew ? 'Ajouter un projet' : 'Modifier le projet'}</h2>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={s.modalBody}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 12 }}>
            <div className={s.field}>
              <label className={s.label}>ID *</label>
              <input value={form.id} onChange={e => set('id', e.target.value)} placeholder="ex: fich" disabled={!isNew} />
            </div>
            <div className={s.field}>
              <label className={s.label}>Icône</label>
              <input value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="⚔️" />
            </div>
          </div>
          <div className={s.field}>
            <label className={s.label}>Nom *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nom du projet" />
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

function PhotosPanel({ project, images, onRefresh }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const toWebp = (file) => new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Conversion webp échouée')), 'image/webp', 0.9);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image invalide')); };
    img.src = url;
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError(null);

    const { data: existing } = await supabase.from('project_images').select('path').eq('project_id', project.id).order('sort_order', { ascending: false });
    const nums = (existing ?? []).map(r => {
      const match = r.path.match(/img(\d+)\.webp$/);
      return match ? parseInt(match[1]) : -1;
    });
    const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 0;
    const finalPath = `data-img/projects/${project.id}/img${nextNum}.webp`;

    let webpBlob;
    try { webpBlob = await toWebp(file); }
    catch (err) { setError(err.message); setUploading(false); return; }

    const { error: upErr } = await supabase.storage.from('media').upload(finalPath, webpBlob, { upsert: false, contentType: 'image/webp' });
    if (upErr) { setError(upErr.message); setUploading(false); return; }

    const maxOrder = existing?.length ?? 0;
    await supabase.from('project_images').insert({ project_id: project.id, path: finalPath, sort_order: maxOrder });
    setUploading(false);
    onRefresh();
    fileRef.current.value = '';
  };

  const handleDelete = async (img) => {
    if (!confirm('Supprimer cette photo ?')) return;
    await supabase.storage.from('media').remove([img.path]);
    await supabase.from('project_images').delete().eq('id', img.id);
    onRefresh();
  };

  return (
    <div className={ps.photosPanel}>
      <div className={ps.uploadRow}>
        <label className={ps.uploadBtn}>
          {uploading ? 'Upload en cours…' : '+ Ajouter une photo'}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
        {error && <span className={s.error} style={{ flex: 1 }}>{error}</span>}
      </div>
      <div className={ps.photoGrid}>
        {images.map(img => (
          <div key={img.id} className={ps.photoItem}>
            <img src={`${STORAGE_URL}/${img.path}`} alt="" loading="lazy" />
            <button className={ps.photoDelete} onClick={() => handleDelete(img)} title="Supprimer">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  usePageTitle('Projets & Photos');
  const [projects, setProjects] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data: p } = await supabase.from('projects').select('*').order('sort_order');
    const { data: i } = await supabase.from('project_images').select('*').order('sort_order');
    setProjects(p ?? []);
    setImages(i ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce projet et toutes ses photos ?')) return;
    const imgs = images.filter(i => i.project_id === id);
    if (imgs.length > 0) await supabase.storage.from('media').remove(imgs.map(i => i.path));
    await supabase.from('project_images').delete().eq('project_id', id);
    await supabase.from('projects').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <PageHeader title="Projets & Photos" desc="Gérer les projets et leurs photos." action={<button className={s.btnPrimary} onClick={() => setModal({})}>+ Ajouter un projet</button>} />
      {loading ? <div className={s.loading}>Chargement…</div> : (
        <div className={s.list}>
          {projects.map(p => {
            const projectImages = images.filter(i => i.project_id === p.id);
            const isOpen = expanded === p.id;
            return (
              <div key={p.id} className={ps.projectBlock}>
                <div className={s.row} style={{ cursor: 'pointer' }} onClick={() => setExpanded(isOpen ? null : p.id)}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{p.icon}</span>
                  <div className={s.rowInfo}>
                    <span className={s.rowName}>{p.name}</span>
                    <span className={s.rowSub}>{projectImages.length} photo{projectImages.length !== 1 ? 's' : ''}</span>
                  </div>
                  <span style={{ color: 'var(--c-dim)', fontSize: '0.85rem' }}>{isOpen ? '▲' : '▼'}</span>
                  <div className={s.rowActions} onClick={e => e.stopPropagation()}>
                    <button className={s.iconBtn} onClick={() => setModal(p)} title="Modifier">✏️</button>
                    <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={() => handleDelete(p.id)} title="Supprimer">🗑️</button>
                  </div>
                </div>
                {isOpen && <PhotosPanel project={p} images={projectImages} onRefresh={load} />}
              </div>
            );
          })}
        </div>
      )}
      {modal && <ProjectModal project={modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
    </div>
  );
}