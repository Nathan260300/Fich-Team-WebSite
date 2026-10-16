import { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './ui';
import Overview from './pages/Overview';
import Maintenance from './pages/Maintenance';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Logs from './pages/Logs';
import styles from './AdminApp.module.css';

const NAV = [
  { to: '/', label: 'Vue d’ensemble', end: true },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/configuration', label: 'Configuration' },
  { to: '/utilisateurs', label: 'Utilisateurs' },
  { to: '/journaux', label: 'Journaux' },
];

export default function AdminApp({ session, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = session.user;
  const username = user.user_metadata?.custom_claims?.global_name ?? user.user_metadata?.full_name ?? 'Administrateur';
  const avatar = user.user_metadata?.avatar_url;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <BrowserRouter basename="/app/admin">
      <ToastProvider>
        <div className={styles.root}>
          <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
            <div className={styles.brand}>
              <img src="/app/admin/logo.png" alt="" className={styles.logo} width="38" height="38" />
              <div>
                <p className={styles.brandName}>FICH Team</p>
                <p className={styles.brandTag}>Administration</p>
              </div>
            </div>

            <nav className={styles.nav} aria-label="Administration">
              {NAV.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navActive : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className={styles.sideFoot}>
              <a href="/app/" className={styles.sideLink}>← Portail</a>
              <a href="/app/fich" className={styles.sideLink}>Dashboard FICH</a>
            </div>
          </aside>

          {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}

          <div className={styles.body}>
            <header className={styles.header}>
              <button
                type="button"
                className={styles.burger}
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(value => !value)}
              >
                <span className={styles.bar} />
                <span className={styles.bar} />
                <span className={styles.bar} />
              </button>

              <div className={styles.spacer} />

              <div className={styles.userRow}>
                {avatar && <img src={avatar} alt="" className={styles.avatar} width="32" height="32" />}
                <span className={styles.username}>{username}</span>
                <button type="button" className={styles.logoutBtn} onClick={logout}>Déconnexion</button>
              </div>
            </header>

            <main className={styles.main}>
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/configuration" element={<Settings />} />
                <Route path="/utilisateurs" element={<Users currentUserId={user.id} />} />
                <Route path="/journaux" element={<Logs />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
