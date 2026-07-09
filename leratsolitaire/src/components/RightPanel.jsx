import { useState } from 'react';
import s from './RightPanel.module.css';

const LINKS = [
  { icon: '📘', label: 'Guide de démarrage', href: '#' },
  { icon: '❓', label: 'FAQ', href: '#' },
  { icon: '📦', label: 'Liste des objets', href: '#' },
  { icon: '🎬', label: 'Tutoriels vidéos', href: '#' },
  { icon: '💬', label: 'Discord de la communauté', href: '#' },
];

export default function RightPanel({ galleryImages = [] }) {
  const [idx, setIdx] = useState(0);
  return (
    <aside className={s.panel}>
      <div className={s.block}>
        <div className={s.rivets}><div className={s.r}/><div className={s.r}/><div className={s.r}/><div className={s.r}/></div>
        <div className={s.sh}><span className={s.st}>Galerie</span></div>
        <div className={s.gframe}>
          {galleryImages.length > 0
            ? <img src={galleryImages[idx]} alt="" className={s.gimg} />
            : <div className={s.gph}><img src="/leratsolitaire/bg.png" alt="" className={s.gimg} style={{objectPosition:'center 20%'}}/></div>
          }
        </div>
        <div className={s.dots}>
          {[0,1,2,3].map(i => <button key={i} className={`${s.dot}${idx===i?` ${s.da}`:''}`} onClick={() => setIdx(i)} />)}
        </div>
      </div>

      <div className={s.block}>
        <div className={s.rivets}><div className={s.r}/><div className={s.r}/><div className={s.r}/><div className={s.r}/></div>
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
