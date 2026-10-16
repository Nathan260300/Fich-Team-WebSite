import { useEffect, useRef, useState } from 'react';
import { useSession } from '../hooks/useSession';
import { supabase } from '../lib/supabase';
import { supabaseCentral } from '../lib/supabaseCentral';
import { fetchMyAccess } from '../lib/access';
import StatusScreen from './StatusScreen';
import Sidebar from './Sidebar';
import { ToastProvider } from './UI';
import { CurrentUserContext } from '../hooks/useCurrentUser';
import styles from './Layout.module.css';

const LOGOUT_FLAG = 'fich_dashboard_logout';
const POLL_INTERVAL_MS = 60000;

function Loader() {
  return (
    <div className={styles.loader}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={styles.loaderDot} style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

function Unauthorized({ children }) {
  return (
    <div className={styles.unauth}>
      {children}
      <a href="/app/" className={styles.unauthBtn}>← Retour au portail</a>
    </div>
  );
}

export default function Layout({ children }) {
  const session = useSession();

  const [status, setStatus] = useState('checking');
  const [centralUser, setCentralUser] = useState(null);
  const [failure, setFailure] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loginStarted = useRef(false);
  const checkedUserId = useRef(null);
  const denied = useRef(false);

  useEffect(() => {
    document.title = 'Administration — FICH Team';
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  useEffect(() => {
    if (session === undefined) return;

    if (!session) {
      if (sessionStorage.getItem(LOGOUT_FLAG) === 'true') return;
      if (denied.current) return;
      if (loginStarted.current) return;

      loginStarted.current = true;
      setAuthError(null);

      supabase.auth
        .signInWithOAuth({
          provider: 'custom:fich-auth',
          options: {
            redirectTo: `${window.location.origin}/app/admin`,
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

    if (checkedUserId.current === userId) return;

    checkedUserId.current = userId;
    setStatus('checking');
    setFailure(null);

    const deny = async () => {
      denied.current = true;
      setCentralUser(null);
      setStatus('denied');
      await supabase.auth.signOut();
    };

    const checkAccess = async () => {
      const {
        data: { session: centralSession },
        error: centralSessionError,
      } = await supabaseCentral.auth.getSession();

      if (centralSessionError || !centralSession) {
        console.error('Aucune session valide dans SUPABASE #1.', centralSessionError);
        await deny();
        return;
      }

      const result = await fetchMyAccess();

      if (!result.ok) {
        console.error('Erreur lors de la récupération des permissions :', result.failure);
        setFailure(result.failure);
        setStatus('failure');
        return;
      }

      if (!result.access.admin) {
        await deny();
        return;
      }

      setCentralUser(centralSession.user);
      setStatus('ready');
    };

    checkAccess();
  }, [session?.user?.id, session, attempt]);

  useEffect(() => {
    if (status !== 'ready') return undefined;

    const poll = async () => {
      if (document.visibilityState !== 'visible') return;
      const result = await fetchMyAccess();
      if (!result.ok) return;
      if (!result.access.admin) {
        denied.current = true;
        setCentralUser(null);
        setStatus('denied');
        await supabase.auth.signOut();
      }
    };

    const interval = setInterval(poll, POLL_INTERVAL_MS);
    document.addEventListener('visibilitychange', poll);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', poll);
    };
  }, [status]);

  const retry = () => {
    checkedUserId.current = null;
    setFailure(null);
    setStatus('checking');
    setAttempt((value) => value + 1);
  };

  const logout = async () => {
    sessionStorage.setItem(LOGOUT_FLAG, 'true');
    await supabase.auth.signOut();
    checkedUserId.current = null;
    loginStarted.current = false;
    window.location.href = '/app/';
  };

  if (status === 'denied') {
    return (
      <Unauthorized>
        <p className={styles.unauthError} role="alert">
          Tu n’es pas autorisé à accéder à cet espace. Il est réservé aux administrateurs de FICH Team.
        </p>
      </Unauthorized>
    );
  }

  if (session === undefined || (session && status === 'checking')) {
    return <Loader />;
  }

  if (!session) {
    if (authError) {
      return (
        <Unauthorized>
          <p className={styles.unauthText}>Impossible de te connecter.</p>
          <p className={styles.unauthText}>{authError}</p>
        </Unauthorized>
      );
    }

    if (sessionStorage.getItem(LOGOUT_FLAG) === 'true') {
      return (
        <Unauthorized>
          <p className={styles.unauthText}>Tu es déconnecté de l’administration FICH.</p>
        </Unauthorized>
      );
    }

    return <Loader />;
  }

  if (status === 'failure' && failure) {
    return (
      <StatusScreen
        kind="error"
        failure={failure}
        retried={attempt > 0}
        onRetry={retry}
        onLogout={logout}
      />
    );
  }

  const metadata = centralUser.user_metadata ?? {};
  const username = metadata.custom_claims?.global_name ?? metadata.global_name ?? 'Administrateur';
  const avatar = metadata.avatar_url ?? metadata.picture;

  return (
    <CurrentUserContext.Provider value={centralUser.id}>
      <ToastProvider>
        <div className={styles.root}>
          <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

          <div className={styles.body}>
            <header className={styles.header}>
              <button
                type="button"
                className={styles.burger}
                aria-label="Menu"
                aria-expanded={sidebarOpen}
                onClick={() => setSidebarOpen(value => !value)}
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

            <main className={styles.main}>{children}</main>
          </div>
        </div>
      </ToastProvider>
    </CurrentUserContext.Provider>
  );
}
