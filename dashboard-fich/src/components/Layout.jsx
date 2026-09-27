import { useState, useEffect } from 'react';
import { useSession } from '../hooks/useSession';
import { supabase } from '../lib/supabase';
import { supabaseCentral } from '../lib/supabaseCentral';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  // Session du Dashboard → #2
  const session = useSession();

  // Autorisation centrale → #1
  const [access, setAccess] = useState(undefined);

  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      // On attend que la session #2 soit chargée
      if (session === undefined) return;

      // Pas de session #2
      if (!session) {
        setAccess(false);
        return;
      }

      // Récupère la session centrale #1
      const {
        data: { session: centralSession },
        error: centralSessionError,
      } = await supabaseCentral.auth.getSession();

      if (centralSessionError) {
        console.error(
          'Erreur session centrale :',
          centralSessionError
        );

        setAccess(false);
        return;
      }

      // Pas de session centrale
      if (!centralSession) {
        setAccess(false);
        return;
      }

      // Vérifie les permissions dans #1
      const { data, error } = await supabaseCentral
        .from('user_permissions')
        .select('fich')
        .eq('user_id', centralSession.user.id)
        .single();

      if (error) {
        console.error(
          'Erreur permissions centrales :',
          error
        );

        setAccess(false);
        return;
      }

      setAccess(data?.fich === true);
    };

    checkAccess();
  }, [session]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);

    window.addEventListener('scroll', fn, { passive: true });

    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const logout = async () => {
    // Déconnexion du Dashboard #2
    await supabase.auth.signOut();

    window.location.href = '/app/';
  };

  if (session === undefined || access === undefined) {
    return (
      <div className={styles.loader}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className={styles.loaderDot}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }

  if (!session) {
    return (
      <div className={styles.unauth}>
        <p className={styles.unauthText}>
          Tu n'es pas connecté.
        </p>

        <a href="/app/" className={styles.unauthBtn}>
          ← Retour à la centrale
        </a>
      </div>
    );
  }

  if (access === false) {
    return (
      <div className={styles.unauth}>
        <p className={styles.unauthText}>
          Tu n'as pas accès à cet espace.
        </p>

        <a href="/app/" className={styles.unauthBtn}>
          ← Retour à la centrale
        </a>
      </div>
    );
  }

  const username =
    session.user.user_metadata?.custom_claims?.global_name ??
    session.user.user_metadata?.full_name ??
    'Utilisateur';

  const avatar = session.user.user_metadata?.avatar_url;

  return (
    <div className={styles.root}>
      <Sidebar
        onClose={() => setSidebarOpen(false)}
        mobileOpen={sidebarOpen}
      />

      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={styles.body}>
        <header
          className={`${styles.header} ${
            scrolled ? styles.scrolled : ''
          }`}
        >
          <button
            className={styles.burger}
            aria-label="Menu"
            onClick={() => setSidebarOpen(v => !v)}
          >
            <span
              className={
                sidebarOpen ? styles.barOpen1 : styles.bar
              }
            />
            <span
              className={
                sidebarOpen ? styles.barOpen2 : styles.bar
              }
            />
            <span
              className={
                sidebarOpen ? styles.barOpen3 : styles.bar
              }
            />
          </button>

          <div className={styles.spacer} />

          <div className={styles.userRow}>
            {avatar && (
              <img
                src={avatar}
                alt=""
                className={styles.avatar}
                width="32"
                height="32"
                loading="lazy"
              />
            )}

            <span className={styles.username}>
              {username}
            </span>

            <button
              className={styles.logoutBtn}
              onClick={logout}
            >
              Déconnexion
            </button>
          </div>
        </header>

        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}