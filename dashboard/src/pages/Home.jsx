import { useState, useEffect } from 'react';
import styles from './Home.module.css';

const APPS = [
  {
    id: 'fich',
    label: 'FICH Team',
    href: '/app/fich',
    desc: 'Gestion de la communauté FICH Team',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    id: 'leratsolitaire',
    label: 'LeRatSolitaire',
    href: '/app/leratsolitaire',
    desc: 'Espace LeRatSolitaire',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4"/>
        <path d="M9 9h6M9 12h6M9 15h4"/>
      </svg>
    ),
  },
];

export default function Home({ session, permissions, logout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = session.user;
  const username = user.user_metadata?.custom_claims?.global_name ?? user.user_metadata?.full_name ?? 'Utilisateur';
  const avatar = user.user_metadata?.avatar_url;
  const visible = APPS.filter(app => permissions?.[app.id]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <div className={styles.root}>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <div className={styles.brand}>
            <div className={styles.logoWrap}>
              <img src="/app/logo.png" alt="FICH" className={styles.logo} width="42" height="42" loading="lazy" />
              <div className={styles.logoGlow} />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>FICH Team</span>
              <span className={styles.brandTag}>Dashboard</span>
            </div>
          </div>

          <div className={styles.userRow}>
            {avatar && <img src={avatar} alt="" className={styles.avatar} width="32" height="32" loading="lazy" />}
            <span className={styles.username}>{username}</span>
            <button className={styles.logoutBtn} onClick={logout}>Déconnexion</button>
          </div>

          <button
            className={styles.burger}
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            <span className={menuOpen ? styles.barOpen1 : styles.bar} />
            <span className={menuOpen ? styles.barOpen2 : styles.bar} />
            <span className={menuOpen ? styles.barOpen3 : styles.bar} />
          </button>
        </div>

        {menuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileUser}>
              {avatar && <img src={avatar} alt="" className={styles.mobileAvatar} width="36" height="36" loading="lazy" />}
              <span className={styles.mobileUsername}>{username}</span>
            </div>
            <div className={styles.mobileDivider} />
            <button className={styles.mobileLogout} onClick={() => { setMenuOpen(false); logout(); }}>
              Déconnexion
            </button>
          </div>
        )}
      </header>

      <main className={styles.main}>
        <div className={styles.welcome}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Espace personnel
          </p>
          <h1 className={styles.title}>
            Bonjour, <span className={styles.accent}>{username}</span> 👋
          </h1>
          <p className={styles.sub}>Sélectionne un espace pour continuer.</p>
        </div>

        {!permissions ? (
          <div className={styles.loading}>
            {[0,1,2].map(i => (
              <span key={i} className={styles.loadingDot} style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className={styles.empty}>
            <span>🔒</span>
            <p>Tu n'as accès à aucun espace pour l'instant.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {visible.map(app => (
              <a key={app.id} href={app.href} className={styles.card}>
                <div className={styles.cardAccent} />
                <div className={styles.cardIcon}>{app.icon}</div>
                <div className={styles.cardBody}>
                  <p className={styles.cardLabel}>{app.label}</p>
                  <p className={styles.cardDesc}>{app.desc}</p>
                </div>
                <svg className={styles.arrow} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M8.5 3.5L13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}