import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const NAV = [
  { to: '/', label: 'Vue d’ensemble', end: true },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/configuration', label: 'Configuration' },
  { to: '/utilisateurs', label: 'Utilisateurs' },
  { to: '/journaux', label: 'Journaux' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>
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
            onClick={onClose}
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
  );
}
