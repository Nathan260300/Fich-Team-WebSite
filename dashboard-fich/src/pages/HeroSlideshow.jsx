import { usePageTitle } from '../hooks/usePageTitle';
import { useState, useEffect } from 'react';
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
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: slideData } = await supabase.from('hero_slideshow').select('*').order('sort_order');
    const { data: imgData } = await supabase.from('project_images').select('*').order('sort_order');
    setSlides(slideData ?? []);
    setAllImages(imgData ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const isInSlideshow = (path) => slides.some(s => s.path === path);

  const addSlide = async (path) => {
    if (isInSlideshow(path)) return;
    setSaving(true);
    const { data: maxRow } = await supabase.from('hero_slideshow').select('sort_order').order('sort_order', { ascending: false }).limit(1).single();
    await supabase.from('hero_slideshow').insert({ path, sort_order: (maxRow?.sort_order ?? -1) + 1 });
    setSaving(false);
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
        action={<button className={s.btnPrimary} onClick={() => setPickerOpen(true)}>+ Ajouter une image</button>}
      />

      {loading ? <div className={s.loading}>Chargement…</div> : (
        <div className={s.list}>
          {slides.length === 0 && <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>Aucune image dans le slideshow.</p>}
          {slides.map((slide, i) => (
            <div key={slide.id} className={s.row}>
              <img src={`${STORAGE_URL}/${slide.path}`} alt="" style={{ width: 96, height: 54, objectFit: 'cover', borderRadius: 'var(--r-xs)', flexShrink: 0 }} />
              <div className={s.rowInfo}>
                <span className={s.rowName} style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem' }}>{slide.path}</span>
              </div>
              <div className={s.rowActions}>
                <button className={s.iconBtn} onClick={() => moveSlide(i, -1)} disabled={i === 0} title="Monter">↑</button>
                <button className={s.iconBtn} onClick={() => moveSlide(i, 1)} disabled={i === slides.length - 1} title="Descendre">↓</button>
                <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={() => removeSlide(slide.id)} title="Retirer">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pickerOpen && (
        <div className={s.overlay} onClick={e => e.target === e.currentTarget && setPickerOpen(false)}>
          <div className={s.modal} style={{ maxWidth: 720 }}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>Choisir une image</h2>
              <button className={s.closeBtn} onClick={() => setPickerOpen(false)}>✕</button>
            </div>
            <div className={s.modalBody}>
              {allImages.length === 0 ? (
                <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>Aucune photo de projet disponible.</p>
              ) : (
                <div className={hs.pickerGrid}>
                  {allImages.map(img => {
                    const already = isInSlideshow(img.path);
                    return (
                      <div
                        key={img.id}
                        className={`${hs.pickerItem} ${already ? hs.pickerItemActive : ''}`}
                        onClick={() => { if (!already) { addSlide(img.path); setPickerOpen(false); } }}
                      >
                        <img src={`${STORAGE_URL}/${img.path}`} alt="" loading="lazy" />
                        {already && <div className={hs.pickerBadge}>✓ Déjà dans le slideshow</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}