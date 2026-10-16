import { useState, useEffect, useRef } from 'react';
import { useSession } from '../hooks/useSession';
import { supabase } from '../lib/supabase';
import { supabaseCentral } from '../lib/supabaseCentral';
import { fetchMyAccess } from '../lib/access';
import Sidebar from './Sidebar';
import StatusScreen from './StatusScreen';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const session = useSession();

  const [access, setAccess] = useState(undefined);
  const [centralUser, setCentralUser] = useState(undefined);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [accessFailure, setAccessFailure] = useState(null);
  const [maintenance, setMaintenance] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const loginStarted = useRef(false);
  const checkedUserId = useRef(null);

  useEffect(() => {
    if (session === undefined) {
      return;
    }

    if (!session) {
      setAccess(false);
      setCentralUser(null);

      const manualLogout =
        sessionStorage.getItem('fich_dashboard_logout') === 'true';

      if (manualLogout) {
        return;
      }

      if (loginStarted.current) {
        return;
      }

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

    const userId = session.user.id;

    if (checkedUserId.current === userId) {
      return;
    }

    checkedUserId.current = userId;
    setAccess(undefined);
    setCentralUser(undefined);

    const checkAccess = async () => {
      const {
        data: { session: centralSession },
        error: centralSessionError,
      } = await supabaseCentral.auth.getSession();

      if (centralSessionError) {
        console.error(
          'Erreur lors de la récupération de la session centrale :',
          centralSessionError
        );
        setCentralUser(null);
        setAccess(false);
        return;
      }

      if (!centralSession) {
        console.error('Aucune session trouvée dans SUPABASE #1.');
        setCentralUser(null);
        setAccess(false);
        return;
      }

      setCentralUser(centralSession.user);

      const result = await fetchMyAccess();

      if (!result.ok) {
        console.error(
          'Erreur lors de la récupération des permissions :',
          result.failure
        );
        setAccessFailure(result.failure);
        setAccess(false);
        return;
      }

      setAccessFailure(null);

      if (!result.access.fich) {
        setAccess(false);
        return;
      }

      if (result.access.dashboards_blocked) {
        setMaintenance({ message: result.access.dashboards_maintenance.message });
        setAccess(false);
        return;
      }

      setMaintenance(null);
      setAccess(true);
    };

    checkAccess();
  }, [session?.user?.id, session, attempt]);

  useEffect(() => {
    if (access !== true) return undefined;

    const poll = async () => {
      if (document.visibilityState !== 'visible') return;
      const result = await fetchMyAccess();
      if (!result.ok) return;
      if (!result.access.fich) {
        setAccess(false);
        return;
      }
      if (result.access.dashboards_blocked) {
        setMaintenance({ message: result.access.dashboards_maintenance.message });
        setAccess(false);
      }
    };

    const interval = setInterval(poll, 60000);
    document.addEventListener('visibilitychange', poll);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', poll);
    };
  }, [access]);

  const retryAccess = () => {
    checkedUserId.current = null;
    setAccessFailure(null);
    setMaintenance(null);
    setAccess(undefined);
    setAttempt((value) => value + 1);
  };

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', fn, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', fn);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const logout = async () => {
    sessionStorage.setItem(
      'fich_dashboard_logout',
      'true'
    );

    await supabase.auth.signOut();

    checkedUserId.current = null;
    loginStarted.current = false;

    window.location.href = '/app/';
  };

  if (
    session === undefined ||
    (session && (access === undefined || centralUser === undefined))
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

    if (
      sessionStorage.getItem(
        'fich_dashboard_logout'
      ) === 'true'
    ) {
      return (
        <div className={styles.unauth}>
          <p className={styles.unauthText}>
            Tu es déconnecté de FICH Dashboard.
          </p>

          <a
            href="/app/"
            className={styles.unauthBtn}
          >
            ← Retour au portail
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

  if (accessFailure) {
    return (
      <StatusScreen
        kind="error"
        failure={accessFailure}
        retried={attempt > 0}
        onRetry={retryAccess}
        onLogout={logout}
      />
    );
  }

  if (maintenance) {
    return (
      <StatusScreen
        kind="maintenance"
        message={maintenance.message}
        onRetry={retryAccess}
        onLogout={logout}
      />
    );
  }

  if (access === false || !centralUser) {
    return (
      <div className={styles.unauth}>
        <p className={styles.unauthText}>
          Tu n'as pas accès à cet espace.
        </p>

        <a
          href="/app/"
          className={styles.unauthBtn}
        >
          ← Retour au portail
        </a>
      </div>
    );
  }

  const centralMetadata = centralUser.user_metadata ?? {};

  const username =
    centralMetadata.custom_claims?.global_name ??
    centralMetadata.global_name ??
    'Utilisateur';

  const avatar =
    centralMetadata.avatar_url ??
    centralMetadata.picture;

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