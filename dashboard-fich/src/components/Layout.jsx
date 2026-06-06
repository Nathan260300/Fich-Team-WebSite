import { useState, useEffect } from 'react';
import { useSession } from '../hooks/useSession';
import { supabase } from '../lib/supabase';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const session = useSession();
  const [access, setAccess] = useState(undefined);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!session) { setAccess(session); return; }
    supabase.from('user_permissions').select('fich').eq('user_id', session.user.id).single()
      .then(({ data }) => setAccess(data?.fich === true ? true : false));
  }, [session]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/app/';
  };

  if (session === undefined || access === undefined) {
    return (
      <div className={styles.loader}>
        {[0,1,2].map(i => <span key={i} className={styles.loaderDot} style={{ animationDelay: `${i * 0.15}s` }} />)}
      </div>
    );
  }

  if (!session || access === false) {
    return (
      <div className={styles.unauth}>
        <p className={styles.unauthText}>
          {!session ? 'Tu n\'es pas connecté.' : 'Tu n\'as pas accès à cet espace.'}
        </p>
        <a href="/app/" className={styles.unauthBtn}>← Retour à la connexion</a>
      </div>
    );
  }

  const username = session.user.user_metadata?.custom_claims?.global_name ?? session.user.user_metadata?.full_name ?? 'Utilisateur';
  const avatar = session.user.user_metadata?.avatar_url;

  return (
    <div className={styles.root}>
      <Sidebar onClose={() => setSidebarOpen(false)} mobileOpen={sidebarOpen} />
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      <div className={styles.body}>
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
          <button className={styles.burger} aria-label="Menu" onClick={() => setSidebarOpen(v => !v)}>
            <span className={sidebarOpen ? styles.barOpen1 : styles.bar} />
            <span className={sidebarOpen ? styles.barOpen2 : styles.bar} />
            <span className={sidebarOpen ? styles.barOpen3 : styles.bar} />
          </button>
          <div className={styles.spacer} />
          <div className={styles.userRow}>
            {avatar && <img src={avatar} alt="" className={styles.avatar} width="32" height="32" loading="lazy" />}
            <span className={styles.username}>{username}</span>
            <button className={styles.logoutBtn} onClick={logout}>Déconnexion</button>
          </div>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}