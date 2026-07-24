import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useWikiTree } from '../hooks/useWikiData';
import s from './Sidebar.module.css';

const STORAGE_KEY = 'cc2wiki_sidebar_expanded';

function loadExpanded() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveExpanded(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    return;
  }
}

export default function Sidebar({ onClose }) {
  const { data: tree, error } = useWikiTree();
  const { pageSlug } = useParams();
  const loc = useLocation();
  const [expanded, setExpanded] = useState(() => loadExpanded() ?? []);
  const [initialised, setInitialised] = useState(false);

  const activeCategoryId = useMemo(() => {
    if (!tree || !pageSlug) return null;
    for (const cat of tree) {
      if (cat.wiki_pages?.some(p => p.slug === pageSlug)) return cat.id;
    }
    return null;
  }, [tree, pageSlug]);

  useEffect(() => {
    if (initialised || !tree) return;
    const stored = loadExpanded();
    if (stored) {
      setExpanded(stored);
    } else {
      setExpanded(tree.map(c => c.id));
    }
    setInitialised(true);
  }, [tree, initialised]);

  useEffect(() => {
    if (activeCategoryId != null && !expanded.includes(activeCategoryId)) {
      setExpanded(v => [...v, activeCategoryId]);
    }
  }, [activeCategoryId]);

  const toggle = (id) => {
    setExpanded(v => {
      const next = v.includes(id) ? v.filter(x => x !== id) : [...v, id];
      saveExpanded(next);
      return next;
    });
  };

  return (
    <nav className={s.side}>
      <div className={s.head}>Sommaire</div>
      <Link to="/" className={`${s.home} ${loc.pathname === '/' ? s.active : ''}`} onClick={onClose}>
        <span className={s.icon}>🏠</span> Accueil
      </Link>
      {error && <div className={s.err}>Erreur de chargement</div>}
      <ul className={s.tree}>
        {tree?.map(cat => {
          const isOpen = expanded.includes(cat.id);
          const isActiveCat = loc.pathname === `/categorie/${cat.slug}`;
          return (
            <li key={cat.id} className={s.catItem}>
              <div className={s.catRow}>
                <button className={s.toggle} onClick={() => toggle(cat.id)} aria-label={isOpen ? 'Réduire' : 'Développer'}>
                  {isOpen ? '▾' : '▸'}
                </button>
                <Link to={`/categorie/${cat.slug}`} className={`${s.catLink} ${isActiveCat ? s.active : ''}`} onClick={onClose}>
                  <span className={s.icon}>{cat.icon}</span> {cat.name}
                </Link>
              </div>
              {isOpen && cat.wiki_pages?.length > 0 && (
                <ul className={s.pages}>
                  {cat.wiki_pages.map(p => (
                    <li key={p.id}>
                      <Link to={`/wiki/${p.slug}`} className={`${s.pageLink} ${p.slug === pageSlug ? s.active : ''}`} onClick={onClose}>
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
