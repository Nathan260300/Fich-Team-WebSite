import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { usePageTitle } from '../hooks/usePageTitle';
import PageHeader from '../components/PageHeader';
import RichEditor from '../components/RichEditor';
import s from './shared.module.css';
import css from './LegalPages.module.css';

const DEFAULT_PAGES = [
  { slug: 'mentions-legales',             title: 'Mentions légales',                sort_order: 1 },
  { slug: 'cgu',                          title: "Conditions générales d'utilisation", sort_order: 2 },
  { slug: 'politique-de-confidentialite', title: 'Politique de confidentialité',    sort_order: 3 },
  { slug: 'politique-de-cookies',         title: 'Politique de cookies',            sort_order: 4 },
];

const fmtDate = iso =>
  new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function LegalPages() {
  usePageTitle('Pages légales');

  const [rows, setRows] = useState([]);      
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [activeSlug, setActiveSlug] = useState(DEFAULT_PAGES[0].slug);
  const [editorRev, setEditorRev] = useState(0); 

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [baseline, setBaseline] = useState({ title: '', content: null });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const pages = useMemo(() => {
    const bySlug = new Map(rows.map(r => [r.slug, r]));
    const merged = DEFAULT_PAGES.map(d => ({ ...d, ...(bySlug.get(d.slug) ?? {}), exists: bySlug.has(d.slug) }));
    rows.filter(r => !DEFAULT_PAGES.some(d => d.slug === r.slug))
        .forEach(r => merged.push({ ...r, exists: true }));
    return merged.sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99));
  }, [rows]);

  const active = pages.find(p => p.slug === activeSlug) ?? pages[0];

  const dirty = baseline.content !== null && (content !== baseline.content || title !== baseline.title);

  const load = useCallback(async () => {
    setLoading(true); setLoadError(null);
    const { data, error } = await supabase
      .from('legal_pages')
      .select('slug, title, content, sort_order, updated_at')
      .order('sort_order');
    if (error) setLoadError(error.message);
    else setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadedKey = useRef('');
  useEffect(() => {
    if (loading || !active) return;
    const key = `${active.slug}:${editorRev}`;
    if (loadedKey.current === key) return;
    loadedKey.current = key;
    setTitle(active.title ?? '');
    setContent(active.content ?? '');
    setBaseline({ title: active.title ?? '', content: null }); 
    setSaveError(null);
  }, [loading, active, editorRev]);

  useEffect(() => {
    if (!dirty) return;
    const fn = e => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', fn);
    return () => window.removeEventListener('beforeunload', fn);
  }, [dirty]);

  const selectPage = slug => {
    if (slug === activeSlug) return;
    if (dirty && !confirm('Tu as des modifications non enregistrées. Les abandonner ?')) return;
    setActiveSlug(slug);
    setEditorRev(r => r + 1);
  };

  const revert = () => {
    if (!confirm('Annuler toutes les modifications non enregistrées ?')) return;
    loadedKey.current = '';
    setEditorRev(r => r + 1);
  };

  const save = useCallback(async () => {
    if (!active || saving || !dirty) return;
    if (!title.trim()) { setSaveError('Le titre est requis.'); return; }
    setSaving(true); setSaveError(null);

    const { data, error } = await supabase
      .from('legal_pages')
      .upsert(
        { slug: active.slug, title: title.trim(), content, sort_order: active.sort_order ?? 99 },
        { onConflict: 'slug' }
      )
      .select('slug, title, content, sort_order, updated_at')
      .single();

    setSaving(false);
    if (error) { setSaveError(error.message); return; }

    setRows(prev => [...prev.filter(r => r.slug !== data.slug), data]);
    setBaseline({ title: data.title, content });
    setTitle(data.title);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2600);
  }, [active, saving, dirty, title, content]);

  useEffect(() => {
    const fn = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [save]);

  return (
    <div>
      <PageHeader
        title="Pages légales"
        desc="Modifie les mentions légales, CGU, politique de confidentialité et de cookies affichées sur le site."
      />

      {loading && <div className={s.loading}>Chargement…</div>}

      {!loading && loadError && (
        <div className={s.error}>
          Impossible de charger les pages légales : {loadError}
          <div className={s.hint} style={{ marginTop: 6 }}>
            Vérifie que la table <code>legal_pages</code> existe (fichier <code>legal_pages.sql</code>).
          </div>
        </div>
      )}

      {!loading && !loadError && active && (
        <div className={css.layout}>
          <nav className={css.list} aria-label="Documents légaux">
            {pages.map(p => (
              <button
                key={p.slug}
                type="button"
                className={`${css.item} ${p.slug === active.slug ? css.itemActive : ''}`}
                onClick={() => selectPage(p.slug)}
              >
                <span className={css.itemTitle}>{p.title}</span>
                <span className={css.itemSub}>
                  {p.exists && p.updated_at ? `Modifié le ${new Date(p.updated_at).toLocaleDateString('fr-FR')}` : 'Pas encore créé'}
                </span>
              </button>
            ))}
          </nav>

          <motion.section
            key={active.slug}
            className={css.panel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={s.field}>
              <label className={s.label} htmlFor="legal-title">Titre du document</label>
              <input id="legal-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre" />
            </div>

            <div className={s.field}>
              <span className={s.label}>Contenu</span>
              <RichEditor
                key={`${active.slug}:${editorRev}`}
                initialMarkdown={active.content ?? ''}
                onChange={setContent}
                onReady={md => { setContent(md); setBaseline(b => ({ ...b, content: md })); }}
              />
              <span className={s.hint}>
                Le contenu est enregistré en Markdown. Les titres de section (Titre / Sous-titre) apparaissent dans le sommaire du document ; le titre principal vient du champ ci-dessus.
              </span>
            </div>

            {saveError && <p className={s.error}>{saveError}</p>}

            <div className={css.bar}>
              <div className={css.status}>
                {active.exists && active.updated_at ? (
                  <span>Dernière modification : <strong>{fmtDate(active.updated_at)}</strong></span>
                ) : (
                  <span>Document pas encore enregistré</span>
                )}
                <AnimatePresence mode="wait">
                  {savedFlash ? (
                    <motion.span key="ok" className={css.ok} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>✓ Enregistré</motion.span>
                  ) : dirty ? (
                    <motion.span key="dirty" className={css.dirty} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>● Modifications non enregistrées</motion.span>
                  ) : null}
                </AnimatePresence>
              </div>
              <div className={css.actions}>
                <button type="button" className={s.btnGhost} onClick={revert} disabled={!dirty || saving}>Annuler</button>
                <button type="button" className={s.btnPrimary} onClick={save} disabled={!dirty || saving}>
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      )}
    </div>
  );
}
