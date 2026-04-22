import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppReady } from '../App';
import styles from './Header.module.css';

const NAV_LINKS = [
  { to: '/',            label: 'Accueil',     code: '01' },
  { to: '/membres',     label: 'Membres',     code: '02' },
  { to: '/projets',     label: 'Projets',     code: '03' },
  { to: '/partenaires', label: 'Partenaires', code: '04' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const ready = useAppReady();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>

        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
          transition={{ delay: 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
            <div className={styles.logoWrap}>
              <img src="/logo.png" alt="FICH Team" className={styles.logo} width="42" height="42" />
              <div className={styles.logoGlow} />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>FICH Team</span>
              <span className={styles.brandTag}>Force · Intelligence · Charisme · Honneur</span>
            </div>
          </Link>
        </motion.div>

        <button
          className={styles.burger}
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span className={open ? styles.barOpen1 : styles.bar} />
          <span className={open ? styles.barOpen2 : styles.bar} />
          <span className={open ? styles.barOpen3 : styles.bar} />
        </button>

        <nav className={styles.nav} aria-label="Navigation principale">
          {NAV_LINKS.map(({ to, label, code }, i) => (
            <motion.div
              key={to}
              style={{ display: 'flex' }}
              initial={{ opacity: 0, y: -10 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                data-code={code}
              >
                {label}
              </NavLink>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ delay: 0.36, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Link to="/rejoindre" className={styles.cta}>Rejoindre</Link>
          </motion.div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
              <Link to="/rejoindre" className={styles.mobileCta} onClick={() => setOpen(false)}>
                Rejoindre
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
}
