import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../hooks/useWikiData';
import styles from './Header.module.css';

function SearchBar() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const results = useSearch(q);
  const navigate = useNavigate();
  const go = (slug) => { setQ(''); setOpen(false); navigate(`/wiki/${slug}`); };
  return (
    <div className={styles.searchWrap}>
      <div className={styles.searchBox}>
        <input className={styles.searchInput} placeholder="Rechercher dans le wiki"
          value={q} onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} />
        <span className={styles.searchIcon}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </span>
      </div>
      <AnimatePresence>
        {open && results && results.length > 0 && (
          <motion.div className={styles.searchDropdown}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}>
            {results.map(r => (
              <div key={r.id} className={styles.searchResult} onMouseDown={() => go(r.slug)}>
                <span className={styles.searchResultCat}>{r.wiki_categories?.icon} {r.wiki_categories?.name}</span>
                <span className={styles.searchResultTitle}>{r.title}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header({ categories }) {
  return (
    <header className={styles.header}>
      <div className={styles.banner}>
        <div className={styles.bannerInner}>
          <Link to="/" className={styles.brand}>
            <img src="/leratsolitaire/logo.png" alt="Civilisation Céleste II" className={styles.logo} />
            <span className={styles.wikiLabel}>Wiki</span>
          </Link>
          <SearchBar />
        </div>
      </div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}><span>🏠</span> Accueil</Link>
        {categories?.map(cat => (
          <Link key={cat.id} to={`/categorie/${cat.slug}`} className={styles.navLink}>
            <span>{cat.icon}</span> {cat.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
