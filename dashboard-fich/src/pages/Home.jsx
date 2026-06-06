import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const SECTIONS = [
  { to: '/members',         icon: '👥', label: 'Membres',           desc: 'Ajouter, modifier, réordonner les membres.' },
  { to: '/projects',        icon: '📸', label: 'Projets & Photos',  desc: 'Gérer les projets et uploader des photos.' },
  { to: '/future-projects', icon: '🗓️', label: 'Futurs projets',    desc: 'Gérer la timeline des futurs projets.' },
  { to: '/other-projects',  icon: '📋', label: 'Autres projets',    desc: 'Gérer la timeline des autres projets.' },
  { to: '/next-project',    icon: '🎯', label: 'Prochain event',    desc: 'Modifier les infos du prochain événement.' },
  { to: '/videos',          icon: '🎬', label: 'Vidéos',            desc: 'Ajouter ou supprimer des vidéos YouTube.' },
  { to: '/channels',        icon: '🤝', label: 'Partenaires',       desc: 'Gérer les chaînes partenaires.' },
  { to: '/hero-slideshow',  icon: '🖼️', label: 'Page Accueil',      desc: 'Choisir les images du défilement.' },
];

export default function Home() {
  usePageTitle('Accueil');
  return (
    <div>
      <div className={styles.hero}>
        <p className={styles.eyebrow}><span className={styles.eyebrowDot} />Dashboard</p>
        <h1 className={styles.title}>FICH Team</h1>
        <p className={styles.sub}>Sélectionne une section pour gérer le contenu du site.</p>
      </div>
      <div className={styles.grid}>
        {SECTIONS.map(s => (
          <Link key={s.to} to={s.to} className={styles.card}>
            <div className={styles.cardAccent} />
            <div className={styles.cardIcon}>{s.icon}</div>
            <div className={styles.cardBody}>
              <p className={styles.cardLabel}>{s.label}</p>
              <p className={styles.cardDesc}>{s.desc}</p>
            </div>
            <svg className={styles.arrow} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M8.5 3.5L13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}