import { usePageTitle } from '../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import s from './shared.module.css';
import hs from './HeroSlideshow.module.css';

const STORAGE_URL = 'https://unhfpfhsidmyxwcfdnek.supabase.co/storage/v1/object/public/media';

export default function HeroSlideshow() {
  usePageTitle('Page Accueil');
  const [slides, setSlides] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: slideData } = await supabase.from('hero_slideshow').select('*').order('sort_order');
    const { data: imgData } = await supabase.from('project_images').select('*').order('sort_order');
    setSlides(slideData ?? []);
    setAllImages(imgData ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const isInSlideshow = (path) => slides.some(sl => sl.path === path);

  const addSlide = async (path) => {
    if (isInSlideshow(path)) return;
    const { data: maxRow } = await supabase.from('hero_slideshow').select('sort_order').order('sort_order', { ascending: false }).limit(1).single();
    await supabase.from('hero_slideshow').insert({ path, sort_order: (maxRow?.sort_order ?? -1) + 1 });
    setPickerOpen(false);
    load();
  };

  const removeSlide = async (id) => {
    await supabase.from('hero_slideshow').delete().eq('id', id);
    load();
  };

  const moveSlide = async (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= slides.length) return;
    const reordered = [...slides];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    setSlides(reordered);
    await Promise.all(reordered.map((sl, i) => supabase.from('hero_slideshow').update({ sort_order: i }).eq('id', sl.id)));
  };

  return (
    <div>
      <PageHeader
        title="Page Accueil"
        desc="Sélectionne les images qui défilent sur la page d'accueil du site."
        action={<motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} className={s.btnPrimary} onClick={() => setPickerOpen(true)}>+ Ajouter une image</motion.button>}
      />

      {loading ? <div className={s.loading}>Chargement…</div> : (
        <motion.div className={s.list} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
          {slides.length === 0 && <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>Aucune image dans le slideshow.</p>}
          {slides.map((slide, i) => (
            <motion.div key={slide.id} className={s.row} variants={{ hidden: { opacity: 0, x: -14 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}>
              <img src={`${STORAGE_URL}/${slide.path}`} alt="" style={{ width: 96, height: 54, objectFit: 'cover', borderRadius: 'var(--r-xs)', flexShrink: 0 }} />
              <div className={s.rowInfo}>
                <span className={s.rowName} style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem' }}>{slide.path}</span>
              </div>
              <div className={s.rowActions}>
                <button className={s.iconBtn} onClick={() => moveSlide(i, -1)} disabled={i === 0} title="Monter">↑</button>
                <button className={s.iconBtn} onClick={() => moveSlide(i, 1)} disabled={i === slides.length - 1} title="Descendre">↓</button>
                <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={() => removeSlide(slide.id)} title="Retirer">✕</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {pickerOpen && (
          <motion.div className={s.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => e.target === e.currentTarget && setPickerOpen(false)}>
            <motion.div className={s.modal} style={{ maxWidth: 720 }} initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }}>
              <div className={s.modalHeader}>
                <h2 className={s.modalTitle}>Choisir une image</h2>
                <button className={s.closeBtn} onClick={() => setPickerOpen(false)}>✕</button>
              </div>
              <div className={s.modalBody}>
                {allImages.length === 0 ? (
                  <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>Aucune photo de projet disponible.</p>
                ) : (
                  <motion.div className={hs.pickerGrid} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.03 } } }}>
                    {allImages.map(img => {
                      const already = isInSlideshow(img.path);
                      return (
                        <motion.div key={img.id} className={`${hs.pickerItem} ${already ? hs.pickerItemActive : ''}`} variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }} onClick={() => !already && addSlide(img.path)}>
                          <img src={`${STORAGE_URL}/${img.path}`} alt="" loading="lazy" />
                          {already && <div className={hs.pickerBadge}>✓ Déjà ajouté</div>}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}