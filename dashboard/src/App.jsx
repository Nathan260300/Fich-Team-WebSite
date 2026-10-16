import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Home from './pages/Home';
import OAuthConsent from './pages/OAuthConsent';
import StatusScreen from './components/StatusScreen';
import styles from './App.module.css';

const normalizedPath = () => window.location.pathname.replace(/\/+$/, '');

const isOAuthConsentRoute = () => normalizedPath().endsWith('/app/oauth/consent');

function Loader() {
  return (
    <div className={styles.loader}>
      <span className={styles.loaderDot} style={{ animationDelay: '0s' }} />
      <span className={styles.loaderDot} style={{ animationDelay: '0.15s' }} />
      <span className={styles.loaderDot} style={{ animationDelay: '0.3s' }} />
    </div>
  );
}

export default function App() {
  const oauthConsent = isOAuthConsentRoute();
  const {
    session,
    access,
    permissions,
    accessFailure,
    accessDenied,
    attempt,
    retry,
    logout,
  } = useAuth();

  useEffect(() => {
    if (session && window.opener) {
      window.opener.location.reload();
      window.close();
    }
  }, [session]);

  useEffect(() => {
    if (oauthConsent) {
      document.title = 'Autorisation — FICH Team';
      return;
    }

    if (session === undefined) return;

    document.title = session
      ? 'Portail — FICH Team'
      : 'Connexion — FICH Team';
  }, [session, oauthConsent]);

  if (oauthConsent) {
    return <OAuthConsent />;
  }

  if (session === undefined) {
    return <Loader />;
  }

  if (!session) {
    return <Login accessDenied={accessDenied} />;
  }

  if (accessFailure) {
    return (
      <StatusScreen
        kind="error"
        failure={accessFailure}
        retried={attempt > 0}
        onRetry={retry}
        onLogout={logout}
      />
    );
  }

  if (!access) {
    return <Loader />;
  }

  if (access.dashboards_blocked) {
    return (
      <StatusScreen
        kind="maintenance"
        message={access.dashboards_maintenance.message}
        onRetry={retry}
        onLogout={logout}
      />
    );
  }

  return (
    <Home
      session={session}
      permissions={permissions}
      logout={logout}
    />
  );
}
