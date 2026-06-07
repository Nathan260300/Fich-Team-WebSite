import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const NAV = [
  { to: '/',                label: 'Accueil',            icon: '🏠', end: true },
  { to: '/members',         label: 'Membres',            icon: '👥' },
  { to: '/projects',        label: 'Projets & Photos',   icon: '📸' },
  { to: '/future-projects', label: 'Futurs projets',     icon: '🗓️' },
  { to: '/other-projects',  label: 'Autres projets',     icon: '📋' },
  { to: '/next-project',    label: 'Prochain event',     icon: '🎯' },
  { to: '/videos',          label: 'Vidéos',             icon: '🎬' },
  { to: '/channels',        label: 'Partenaires',        icon: '🤝' },
  { to: '/hero-slideshow',  label: 'Page Accueil',  icon: '🖼️' },
];

export default function Sidebar({ onClose, mobileOpen }) {
  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
      <div className={styles.brand}>
        <img src="/app/fich/logo.png" alt="FICH" className={styles.logo} width="36" height="36" loading="lazy" />
        <div className={styles.brandText}>
          <span className={styles.brandName}>FICH Team</span>
          <span className={styles.brandTag}>Dashboard</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV.map(({ to, label, icon, end }, i) => (
          <motion.div key={to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16,1,0.3,1] }}>
          <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            onClick={onClose}
          >
            <span className={styles.linkIcon}>{icon}</span>
            <span className={styles.linkLabel}>{label}</span>
          </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className={styles.footer}>
        <a href="/app/" className={styles.backBtn}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour au portail
        </a>
      </div>
    </aside>
  );
}