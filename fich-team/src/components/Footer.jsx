import { Link } from 'react-router-dom';
import { LEGAL_PAGES } from '../data/legalPages';
import styles from './Footer.module.css';

const SOCIALS = [
  {
    id: 'discord', label: 'Discord', url: 'https://discord.gg/ACRZ4zK2uD',
    path: 'M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z',
  },
  {
    id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@FICH_team',
    path: 'M23.5 6.2a3.03 3.03 0 00-2.13-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.37.56A3.03 3.03 0 00.5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.03 3.03 0 002.13 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.37-.56a3.03 3.03 0 002.13-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z',
  },
  {
    id: 'twitch', label: 'Twitch', url: 'https://www.twitch.tv/fich_team',
    path: 'M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z',
  },
  {
    id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/fich_team_',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@fich_team',
    path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
  {
    id: 'x', label: 'X (Twitter)', url: 'https://www.x.com/fich_team',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
];

const EXPLORE = [
  { to: '/',          label: 'Accueil' },
  { to: '/qui',       label: 'Qui' },
  { to: '/projets',   label: 'Projets & Médias' },
  { to: '/activites', label: 'Activités' },
  { to: '/reseaux',   label: 'Réseaux' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>

        <div className={styles.brandCol}>
          <Link to="/" className={styles.brand} aria-label="FICH Team — Accueil">
            <img src="/logo.png" alt="" width="38" height="38" className={styles.logoImg} />
            <span className={styles.brandText}>
              <span className={styles.brandName}>FICH <em>Team</em></span>
              <span className={styles.brandTag}>Force · Intelligence · Charisme · Honneur</span>
            </span>
          </Link>
          <p className={styles.about}>
            Communauté de joueurs passionnés : build, redstone, RP et minijeux.
          </p>
          <ul className={styles.socials} aria-label="Réseaux sociaux">
            {SOCIALS.map(({ id, label, url, path }) => (
              <li key={id}>
                <a href={url} target="_blank" rel="noopener noreferrer" className={styles.social} aria-label={label} title={label}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className={styles.col} aria-label="Navigation du pied de page">
          <h2 className={styles.colTitle}>Explorer</h2>
          <ul>
            {EXPLORE.map(({ to, label }) => (
              <li key={to}><Link to={to}>{label}</Link></li>
            ))}
          </ul>
        </nav>

        <nav className={styles.col} aria-label="Communauté">
          <h2 className={styles.colTitle}>Communauté</h2>
          <ul>
            <li><Link to="/rejoindre">Nous rejoindre</Link></li>
            <li><a href="https://discord.gg/ACRZ4zK2uD" target="_blank" rel="noopener noreferrer">Serveur Discord</a></li>
            <li><a href="https://ko-fi.com/fichteam" target="_blank" rel="noopener noreferrer">Nous soutenir</a></li>
          </ul>
        </nav>

        <nav className={styles.col} aria-label="Informations légales">
          <h2 className={styles.colTitle}>Légal</h2>
          <ul>
            {LEGAL_PAGES.map(({ path, label, slug }) => (
              <li key={slug}><Link to={path}>{label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p className={styles.copy}>
            &copy; {year} <strong>FICH Team.</strong> Tous droits réservés.
          </p>
          <p className={styles.credit}>
            Made with 🕑 and 💖 by{' '}
            <a href="https://nathan-the-coder.netlify.app" target="_blank" rel="noopener noreferrer">
              Nathan The Coder
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
