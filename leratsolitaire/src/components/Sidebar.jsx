import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import s from './Sidebar.module.css';

export default function Sidebar({ categories, onClose }) {
  const { categorySlug } = useParams();
  return (
    <aside className={s.aside}>
      <div className={s.rivets}><div className={s.r}/><div className={s.r}/><div className={s.r}/><div className={s.r}/></div>
      <div className={s.sec}>
        <div className={s.sh}><span className={s.st}>Navigation</span></div>
        <nav className={s.nav}>
          <Link to="/" className={s.link} onClick={onClose}><span>🏠</span> Page principale</Link>
        </nav>
      </div>
      {categories?.length > 0 && (
        <div className={s.sec}>
          <div className={s.sh}><span className={s.st}>Catégories</span></div>
          <nav className={s.nav}>
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.22 }}>
                <Link to={`/categorie/${cat.slug}`} className={`${s.link} ${categorySlug === cat.slug ? s.active : ''}`} onClick={onClose}>
                  <span>{cat.icon}</span> {cat.name}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
      )}
      <div className={s.foot}>
        <p className={s.ft}>Civilisation Céleste II</p>
        <p className={s.fs}>Wiki de l'événement</p>
      </div>
    </aside>
  );
}
