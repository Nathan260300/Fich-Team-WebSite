import { useState } from 'react';
import styles from './RightPanel.module.css';

const PLACEHOLDER_LINKS = [
  { icon: '📘', label: 'Guide de démarrage', href: '#' },
  { icon: '❓', label: 'FAQ', href: '#' },
  { icon: '📦', label: 'Liste des objets', href: '#' },
  { icon: '🎬', label: 'Tutoriels vidéos', href: '#' },
  { icon: '💬', label: 'Discord de la communauté', href: '#' },
];

export default function RightPanel({ galleryImages = [] }) {
  const [index, setIndex] = useState(0);
  const hasImages = galleryImages.length > 0;

  return (
    <aside className={styles.panel}>
      <div className={styles.block}>
        <div className={styles.rivets}>
          <div className={styles.rivet}/><div className={styles.rivet}/>
          <div className={styles.rivet}/><div className={styles.rivet}/>
        </div>
        <div className={styles.sectionHeader}><span className={styles.sectionTitle}>Galerie</span></div>
        <div className={styles.galleryFrame}>
          {hasImages ? (
            <img src={galleryImages[index]} alt="" className={styles.galleryImg} />
          ) : (
            <div className={styles.galleryPlaceholder}>🏰</div>
          )}
        </div>
        {hasImages && galleryImages.length > 1 && (
          <div className={styles.dots}>
            {galleryImages.map((_, i) => (
              <button key={i} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} onClick={() => setIndex(i)} aria-label={`Image ${i + 1}`} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.block}>
        <div className={styles.rivets}>
          <div className={styles.rivet}/><div className={styles.rivet}/>
          <div className={styles.rivet}/><div className={styles.rivet}/>
        </div>
        <div className={styles.sectionHeader}><span className={styles.sectionTitle}>Liens utiles</span></div>
        <div className={styles.linksList}>
          {PLACEHOLDER_LINKS.map((l, i) => (
            <a key={i} href={l.href} className={styles.linkItem}>
              <span>{l.icon}</span> {l.label}
            </a>
          ))}
        </div>
      </div>

      <div className={styles.quoteBlock}>
        <div className={styles.rivets}>
          <div className={styles.rivet}/><div className={styles.rivet}/>
          <div className={styles.rivet}/><div className={styles.rivet}/>
        </div>
        <p className={styles.quote}>« L'innovation est le moteur du progrès, et l'ingéniosité notre meilleur allié. »</p>
        <p className={styles.quoteAuthor}>— Guide Céleste</p>
      </div>
    </aside>
  );
}
