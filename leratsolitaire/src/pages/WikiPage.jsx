import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePage } from '../hooks/useWikiData';
import { useToc } from '../context/TocContext';
import { extractHeadings } from '../lib/toc';
import WikiContent from '../components/WikiContent';
import s from './WikiPage.module.css';

export default function WikiPage() {
  const { pageSlug } = useParams();
  const { data: page, error } = usePage(pageSlug);
  const { setToc } = useToc();
  const toc = useMemo(() => extractHeadings(page?.content_md), [page]);

  useEffect(() => {
    if (page) document.title = `${page.title} – Civilisation Céleste II`;
    else if (page === null) document.title = 'Page introuvable – Civilisation Céleste II';
  }, [page]);

  useEffect(() => {
    setToc(toc);
    return () => setToc([]);
  }, [toc, setToc]);

  if (page === undefined) return (
    <div className={s.loading}>
      <div className={s.dots}>
        {[0,1,2].map(i => <span key={i} className={s.dot} style={{ animationDelay: `${i * 0.2}s` }} />)}
      </div>
    </div>
  );

  if (error) return (
    <div className={s.nf}>
      <h1 className={s.nft}>Erreur de chargement</h1>
      <p className={s.nfs}>Impossible de charger cette page pour le moment.</p>
      <Link to="/" className={s.back}>← Retour à l'accueil</Link>
    </div>
  );

  if (page === null) return (
    <div className={s.nf}>
      <h1 className={s.nft}>Page introuvable</h1>
      <p className={s.nfs}>Cette page n'existe pas ou a été déplacée.</p>
      <Link to="/" className={s.back}>← Retour à l'accueil</Link>
    </div>
  );

  const cat = page.wiki_categories;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: [0.16,1,0.3,1] }}>
      <div className={s.bc}>
        <Link to="/" className={s.bcl}>Accueil</Link>
        {cat && <><span className={s.bcs}>›</span><Link to={`/categorie/${cat.slug}`} className={s.bcl}>{cat.icon} {cat.name}</Link></>}
        <span className={s.bcs}>›</span>
        <span className={s.bcc}>{page.title}</span>
      </div>
      <WikiContent content={page.content_md} toc={toc} />
      <div className={s.foot}>
        <span className={s.fd}>Dernière modification : {new Date(page.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        {cat && <Link to={`/categorie/${cat.slug}`} className={s.fb}>← Retour à {cat.name}</Link>}
      </div>
    </motion.div>
  );
}
