import { useState, useEffect, useRef } from 'react';
import { useSession } from '../hooks/useSession';
import { supabase } from '../lib/supabase';
import { supabaseCentral } from '../lib/supabaseCentral';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const session = useSession();
  const [access, setAccess] = useState(undefined);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authError, setAuthError] = useState(null);

  const loginStarted = useRef(false);

  useEffect(() => {
    if (session === undefined) return;

    if (!session) {
      setAccess(false);

      if (loginStarted.current) return;

      loginStarted.current = true;
      setAuthError(null);

      supabase.auth
        .signInWithOAuth({
          provider: 'custom:fich-auth',
          options: {
            redirectTo: `${window.location.origin}/app/fich`,
          },
        })
        .then(({ error }) => {
          if (error) {
            console.error('Erreur FICH Auth :', error);

            setAuthError(error.message);
            loginStarted.current = false;
          }
        });

      return;
    }

    loginStarted.current = false;
    setAuthError(null);

    const checkAccess = async () => {
      setAccess(undefined);

      const {
        data: { session: centralSession },
        error: centralSessionError,
      } = await supabaseCentral.auth.getSession();

      if (centralSessionError) {
        console.error(
          'Erreur lors de la récupération de la session centrale :',
          centralSessionError
        );

        setAccess(false);
        return;
      }

      if (!centralSession) {
        console.error('Aucune session trouvée dans SUPABASE #1.');

        setAccess(false);
        return;
      }

      const { data, error } = await supabaseCentral
        .from('user_permissions')
        .select('fich')
        .eq('user_id', centralSession.user.id)
        .single();

      if (error) {
        console.error(
          'Erreur lors de la récupération des permissions :',
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

    window.addEventListener('scroll', fn, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', fn);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen
      ? 'hidden'
      : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const logout = async () => {
    await supabase.auth.signOut();

    window.location.href = '/app/';
  };

  if (
    session === undefined ||
    (session && access === undefined)
  ) {
    return (
      <div className={styles.loader}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={styles.loaderDot}
            style={{
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (!session) {
    if (authError) {
      return (
        <div className={styles.unauth}>
          <p className={styles.unauthText}>
            Impossible de te connecter.
          </p>

          <p className={styles.unauthText}>
            {authError}
          </p>

          <a
            href="/app/"
            className={styles.unauthBtn}
          >
            ← Retour à la centrale
          </a>
        </div>
      );
    }

    return (
      <div className={styles.loader}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={styles.loaderDot}
            style={{
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (access === false) {
    return (
      <div className={styles.unauth}>
        <p className={styles.unauthText}>
          Tu n'as pas accès à cet espace.
        </p>

        <a
          href="/app/"
          className={styles.unauthBtn}
        >
          ← Retour à la centrale
        </a>
      </div>
    );
  }

  const username =
    session.user.user_metadata?.custom_claims?.global_name ??
    session.user.user_metadata?.full_name ??
    'Utilisateur';

  const avatar =
    session.user.user_metadata?.avatar_url;

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
            aria-expanded={sidebarOpen}
            onClick={() =>
              setSidebarOpen((v) => !v)
            }
          >
            <span
              className={
                sidebarOpen
                  ? styles.barOpen1
                  : styles.bar
              }
            />

            <span
              className={
                sidebarOpen
                  ? styles.barOpen2
                  : styles.bar
              }
            />

            <span
              className={
                sidebarOpen
                  ? styles.barOpen3
                  : styles.bar
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