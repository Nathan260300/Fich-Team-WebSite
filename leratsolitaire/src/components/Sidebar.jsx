import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Sidebar.module.css';

export default function Sidebar({ categories, onClose }) {
  const { categorySlug } = useParams();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.rivets}>
        <div className={styles.rivet}/><div className={styles.rivet}/>
        <div className={styles.rivet}/><div className={styles.rivet}/>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}><span className={styles.sectionTitle}>Navigation</span></div>
        <nav className={styles.nav}>
          <Link to="/" className={styles.link} onClick={onClose}><span>🏠</span> Page principale</Link>
        </nav>
      </div>
      {categories?.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}><span className={styles.sectionTitle}>Catégories</span></div>
          <nav className={styles.nav}>
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.25 }}>
                <Link to={`/categorie/${cat.slug}`} className={`${styles.link} ${categorySlug === cat.slug ? styles.active : ''}`} onClick={onClose}>
                  <span>{cat.icon}</span> {cat.name}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
      )}
      <div className={styles.footer}>
        <p className={styles.footerText}>Civilisation Céleste II</p>
        <p className={styles.footerSub}>Wiki de l'événement</p>
      </div>
    </aside>
  );
}
