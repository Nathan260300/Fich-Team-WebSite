import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePagesByCategory, useCategories } from '../hooks/useWikiData';
import s from './CategoryPage.module.css';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const categories = useCategories();
  const pages = usePagesByCategory(categorySlug);
  const cat = categories?.find(c => c.slug === categorySlug);

  useEffect(() => {
    if (cat) document.title = `${cat.name} · Civilisation Céleste II Wiki`;
    return () => { document.title = 'Civilisation Céleste II Wiki'; };
  }, [cat]);

  if (pages === null) return <div className={s.loading}>Chargement…</div>;

  if (!cat && categories !== null) return (
    <div className={s.nf}><h1>Catégorie introuvable</h1><Link to="/">← Retour</Link></div>
  );

  return (
    <div>
      <motion.div className={s.bc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
        <Link to="/" className={s.bcl}>Accueil</Link>
        <span className={s.bcs}>›</span>
        <span className={s.bcc}>{cat?.name}</span>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04, duration: 0.3 }}>
        <h1 className={s.title}><span>{cat?.icon}</span> {cat?.name}</h1>
        <div className={s.sep} />
      </motion.div>
      {pages.length === 0 ? (
        <p className={s.empty}>Aucune page dans cette catégorie pour l'instant.</p>
      ) : (
        <motion.div className={s.list} initial="h" animate="v" variants={{ v: { transition: { staggerChildren: 0.06 } } }}>
          {pages.map(page => (
            <motion.div key={page.id} variants={{ h: { opacity: 0, x: -10 }, v: { opacity: 1, x: 0 } }} transition={{ duration: 0.28, ease: [0.16,1,0.3,1] }}>
              <Link to={`/wiki/${page.slug}`} className={s.pc}>
                <div className={s.pl} />
                <div className={s.pi}>
                  <span className={s.pn}>{page.title}</span>
                  <span className={s.pd}>Mis à jour le {new Date(page.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <span className={s.pa}>→</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}