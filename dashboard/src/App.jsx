import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Home from './pages/Home';
import OAuthConsent from './pages/OAuthConsent';
import styles from './App.module.css';

const isOAuthConsentRoute = () =>
  window.location.pathname.replace(/\/+$/, '').endsWith('/oauth/consent');

export default function App() {
  const { session, permissions, logout } = useAuth();
  const oauthConsent = isOAuthConsentRoute();

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
    document.title = session ? 'Dashboard — FICH Team' : 'Connexion — FICH Team';
  }, [session, oauthConsent]);

  if (oauthConsent) {
    return <OAuthConsent />;
  }

  if (session === undefined) {
    return (
      <div className={styles.loader}>
        <span className={styles.loaderDot} style={{ animationDelay: '0s' }} />
        <span className={styles.loaderDot} style={{ animationDelay: '0.15s' }} />
        <span className={styles.loaderDot} style={{ animationDelay: '0.3s' }} />
      </div>
    );
  }

  if (!session) return <Login />;

  return <Home session={session} permissions={permissions} logout={logout} />;
}