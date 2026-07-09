import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../hooks/useWikiData';
import s from './Header.module.css';

function Search() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const results = useSearch(q);
  const nav = useNavigate();
  const go = (slug) => { setQ(''); setOpen(false); nav(`/wiki/${slug}`); };
  return (
    <div className={s.sw}>
      <div className={s.sb}>
        <input className={s.si} placeholder="Rechercher dans le wiki" value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} />
        <span className={s.sico}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      </div>
      <AnimatePresence>
        {open && results && results.length > 0 && (
          <motion.div className={s.sd} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}>
            {results.map(r => (
              <div key={r.id} className={s.sr} onMouseDown={() => go(r.slug)}>
                <span className={s.src}>{r.wiki_categories?.icon} {r.wiki_categories?.name}</span>
                <span className={s.srt}>{r.title}</span>
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
    <header className={s.header}>
      <div className={s.top}>
        <div className={s.topLeft} />
        <Link to="/" className={s.brand}>
          <img src="/leratsolitaire/logo.png" alt="Civilisation Céleste II" className={s.logo} />
          <div className={s.wikiTag}>
            <span className={s.wikiLabel}>Wiki</span>
          </div>
        </Link>
        <div className={s.topRight}>
          <Search />
        </div>
      </div>
      <nav className={s.nav}>
        <Link to="/" className={s.nl}><span>🏠</span> Accueil</Link>
        {categories?.map(cat => (
          <Link key={cat.id} to={`/categorie/${cat.slug}`} className={s.nl}>
            <span>{cat.icon}</span> {cat.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
