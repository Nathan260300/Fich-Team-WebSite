import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePage } from '../hooks/useWikiData';
import WikiContent from '../components/WikiContent';
import styles from './WikiPage.module.css';

export default function WikiPage() {
  const { pageSlug } = useParams();
  const page = usePage(pageSlug);

  if (page === undefined) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingDots}>
          {[0,1,2].map(i => <span key={i} className={styles.dot} style={{ animationDelay: `${i * 0.2}s` }} />)}
        </div>
      </div>
    );
  }

  if (page === null) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>Page introuvable</h1>
        <p className={styles.notFoundSub}>Cette page n'existe pas ou a été déplacée.</p>
        <Link to="/" className={styles.backBtn}>← Retour à l'accueil</Link>
      </div>
    );
  }

  const cat = page.wiki_categories;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}>
      <div className={styles.breadcrumb}>
        <Link to="/" className={styles.bcLink}>Accueil</Link>
        {cat && <>
          <span className={styles.bcSep}>›</span>
          <Link to={`/categorie/${cat.slug}`} className={styles.bcLink}>{cat.icon} {cat.name}</Link>
        </>}
        <span className={styles.bcSep}>›</span>
        <span className={styles.bcCurrent}>{page.title}</span>
      </div>

      <WikiContent content={page.content_md} />

      <div className={styles.footer}>
        <span className={styles.footerDate}>
          Dernière modification : {new Date(page.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
        {cat && <Link to={`/categorie/${cat.slug}`} className={styles.footerBack}>← Retour à {cat.name}</Link>}
      </div>
    </motion.div>
  );
}
