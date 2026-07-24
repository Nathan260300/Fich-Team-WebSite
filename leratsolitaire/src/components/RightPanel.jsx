import { useEffect, useState } from 'react';
import { useToc } from '../context/TocContext';
import s from './RightPanel.module.css';

const LINKS = [
  { icon: '📦', label: 'Liste des objets', href: '#' },
  { icon: '🎬', label: 'Tutoriels vidéos', href: 'https://youtube.com' },
  { icon: '🎬', label: 'Site de la FICH Team', href: 'https://fich-team.netlify.app' },
  { icon: '💬', label: 'Discord de la FICH Team', href: 'https://discord.gg/ACRZ4zK2uD' },
];

export default function RightPanel() {
  const { toc } = useToc();
  const [activeSlug, setActiveSlug] = useState(null);

  useEffect(() => {
    if (!toc || toc.length === 0) return;
    const elements = toc.map(h => document.getElementById(h.slug)).filter(Boolean);
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveSlug(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  return (
    <aside className={s.panel}>
      {toc && toc.length > 0 && (
        <div className={s.block}>
          <div className={s.sh}><span className={s.st}>Sur cette page</span></div>
          <div className={s.toc}>
            {toc.map(h => (
              <a
                key={h.slug}
                href={`#${h.slug}`}
                className={`${s.tocLink} ${h.level === 3 ? s.tocSub : ''} ${activeSlug === h.slug ? s.active : ''}`}
              >
                {h.text}
              </a>
            ))}
          </div>
        </div>
      )}
      <div className={s.block}>
        <div className={s.sh}><span className={s.st}>Liens utiles</span></div>
        <div className={s.links}>
          {LINKS.map((l, i) => (
            <a key={i} href={l.href} className={s.li}><span>{l.icon}</span> {l.label}</a>
          ))}
        </div>
      </div>
    </aside>
  );
}
