import { usePageTitle } from '../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import s from './shared.module.css';

function ChannelModal({ channel, onClose, onSave }) {
  const isNew = !channel.id;
  const [form, setForm] = useState({
    name: channel.name ?? '',
    description: channel.description ?? '',
    url: channel.url ?? '',
    avatar: channel.avatar ?? '',
    category: channel.category ?? 'partenaire',
    twitch_url: channel.twitch_url ?? '',
    discord_url: channel.discord_url ?? '',
    recommendation_text: channel.recommendation_text ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Le nom est requis.'); return; }
    setSaving(true); setError(null);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      url: form.url.trim() || null,
      avatar: form.avatar.trim() || null,
      category: form.category,
      twitch_url: form.twitch_url.trim() || null,
      discord_url: form.discord_url.trim() || null,
      recommendation_text: form.recommendation_text.trim() || null,
    };
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
    <motion.div className={s.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className={s.modal} initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }}>
        <div className={s.modalHeader}>
          <h2 className={s.modalTitle}>{isNew ? 'Ajouter une relation' : 'Modifier la relation'}</h2>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={s.modalBody}>
          <div className={s.field}>
            <label className={s.label}>Nom *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nom de la chaîne" />
          </div>
          <div className={s.field}>
            <label className={s.label}>Catégorie</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="partenaire">Partenaire</option>
              <option value="ancien">Ancien partenaire</option>
              <option value="recommandation">Recommandation</option>
            </select>
          </div>
          {form.category === 'recommandation' && (
            <div className={s.field}>
              <label className={s.label}>Texte de recommandation</label>
              <input value={form.recommendation_text} onChange={e => set('recommendation_text', e.target.value)} placeholder="Pourquoi recommandez-vous cette chaîne ?" />
            </div>
          )}
          <div className={s.field}>
            <label className={s.label}>Description</label>
            <input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Description courte" />
          </div>
          <div className={s.field}>
            <label className={s.label}>URL YouTube</label>
            <input value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://youtube.com/@..." />
          </div>
          <div className={s.field}>
            <label className={s.label}>URL Twitch</label>
            <input value={form.twitch_url} onChange={e => set('twitch_url', e.target.value)} placeholder="https://twitch.tv/..." />
          </div>
          <div className={s.field}>
            <label className={s.label}>Serveur Discord</label>
            <input value={form.discord_url} onChange={e => set('discord_url', e.target.value)} placeholder="https://discord.gg/..." />
          </div>
          <div className={s.field}>
            <label className={s.label}>Avatar (URL)</label>
            <input value={form.avatar} onChange={e => set('avatar', e.target.value)} placeholder="https://..." />
            {form.avatar && <img src={form.avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginTop: 4 }} />}
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

function ChannelRow({ c, onEdit, onDelete }) {
  return (
    <motion.div className={s.row} variants={{ hidden: { opacity: 0, x: -14 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}>
      {c.avatar && <img src={c.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />}
      <div className={s.rowInfo}>
        <span className={s.rowName}>{c.name}</span>
        <span className={s.rowSub}>{c.description}</span>
      </div>
      <span className={`${s.badge} ${c.category === 'ancien' ? s.badgeUncertain : c.category === 'recommandation' ? s.badgeReco : s.badgeSure}`}>
        {c.category === 'ancien' ? 'Ancien' : c.category === 'recommandation' ? 'Recommandation' : 'Partenaire'}
      </span>
      <div className={s.rowActions}>
        <button className={s.iconBtn} onClick={() => onEdit(c)} title="Modifier">✏️</button>
        <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={() => onDelete(c.id)} title="Supprimer">🗑️</button>
      </div>
    </motion.div>
  );
}

export default function Channels() {
  usePageTitle('Relations');
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

  const partners    = channels.filter(c => c.category === 'partenaire' || (!c.category || (c.category !== 'ancien' && c.category !== 'recommandation')));
  const formers     = channels.filter(c => c.category === 'ancien');
  const recommended = channels.filter(c => c.category === 'recommandation');

  return (
    <div>
      <PageHeader title="Relations" desc="Gérer les partenaires, anciens partenaires et recommandations." action={
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} className={s.btnPrimary} onClick={() => setModal({})}>+ Ajouter</motion.button>
      } />
      {loading ? <div className={s.loading}>Chargement…</div> : (
        <>
          <div className={s.label} style={{ margin: '0 0 8px' }}>Partenaires</div>
          <motion.div className={s.list} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
            {partners.map(c => (
              <ChannelRow key={c.id} c={c} onEdit={setModal} onDelete={handleDelete} />
            ))}
          </motion.div>

          {formers.length > 0 && (
            <>
              <div className={s.label} style={{ margin: '20px 0 8px' }}>Anciens partenaires</div>
              <motion.div className={s.list} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
                {formers.map(c => (
                  <ChannelRow key={c.id} c={c} onEdit={setModal} onDelete={handleDelete} />
                ))}
              </motion.div>
            </>
          )}

          {recommended.length > 0 && (
            <>
              <div className={s.label} style={{ margin: '20px 0 8px' }}>Recommandations</div>
              <motion.div className={s.list} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
                {recommended.map(c => (
                  <ChannelRow key={c.id} c={c} onEdit={setModal} onDelete={handleDelete} />
                ))}
              </motion.div>
            </>
          )}
        </>
      )}
      <AnimatePresence>
        {modal && <ChannelModal channel={modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
      </AnimatePresence>
    </div>
  );
}