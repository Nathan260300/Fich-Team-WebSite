import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../hooks/useWikiData';
import s from './Header.module.css';

function Search() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const { data: results } = useSearch(q);
  const nav = useNavigate();
  const inputRef = useRef(null);

  const go = (slug) => {
    setQ('');
    setOpen(false);
    setActive(-1);
    inputRef.current?.blur();
    nav(`/wiki/${slug}`);
  };

  const onKeyDown = (e) => {
    if (!open || !results || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(v => (v + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(v => (v <= 0 ? results.length - 1 : v - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = results[active] ?? results[0];
      if (pick) go(pick.slug);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={s.sw}>
      <div className={s.sb}>
        <input
          ref={inputRef}
          className={s.si}
          placeholder="Rechercher dans le wiki"
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
        />
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
            {results.map((r, i) => (
              <div key={r.id} className={`${s.sr} ${i === active ? s.sra : ''}`} onMouseDown={() => go(r.slug)} onMouseEnter={() => setActive(i)}>
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

export default function Header({ onBurger }) {
  const base = import.meta.env.BASE_URL;
  return (
    <header className={s.header} style={{ backgroundImage: `linear-gradient(180deg, rgba(20,26,42,.35) 0%, rgba(20,26,42,.82) 100%), url('${base}bg.png')` }}>
      <button className={s.burger} onClick={onBurger} aria-label="Menu">
        <span className={s.bar}/><span className={s.bar}/><span className={s.bar}/>
      </button>
      <Link to="/" className={s.brand}>
        <div className={s.logoFrame}>
          <img src={`${base}logo.png`} alt="Civilisation Céleste II" className={s.logo} />
        </div>
        <div className={s.wikiTag}>
          <span className={s.wikiLabel}>Wiki</span>
        </div>
      </Link>
      <div className={s.spacer} />
      <Search />
    </header>
  );
}