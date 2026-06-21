import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePagesByCategory, useCategories } from '../hooks/useWikiData';
import styles from './CategoryPage.module.css';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const categories = useCategories();
  const pages = usePagesByCategory(categorySlug);
  const cat = categories?.find(c => c.slug === categorySlug);

  if (pages === null) return <div className={styles.loading}>Chargement…</div>;

  if (!cat && categories !== null) {
    return (
      <div className={styles.notFound}>
        <h1>Catégorie introuvable</h1>
        <Link to="/">← Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div>
      <motion.div className={styles.header} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Link to="/" className={styles.breadcrumb}>Accueil</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{cat?.name}</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.35 }}>
        <h1 className={styles.title}><span>{cat?.icon}</span> {cat?.name}</h1>
        <div className={styles.titleSep} />
      </motion.div>

      {pages.length === 0 ? (
        <motion.p className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          Aucune page dans cette catégorie pour l'instant.
        </motion.p>
      ) : (
        <motion.div className={styles.list} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
          {pages.map(page => (
            <motion.div key={page.id} variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}>
              <Link to={`/wiki/${page.slug}`} className={styles.pageCard}>
                <div className={styles.pageCardLeft} />
                <div className={styles.pageInfo}>
                  <span className={styles.pageTitle}>{page.title}</span>
                  <span className={styles.pageDate}>
                    Mis à jour le {new Date(page.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <span className={styles.pageArrow}>→</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
