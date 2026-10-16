import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import StatusScreen from './components/StatusScreen';
import AdminApp from './admin/AdminApp';
import styles from './App.module.css';

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
  const { session, access, accessFailure, accessDenied, attempt, retry, logout } = useAuth();

  useEffect(() => {
    if (session && window.opener) {
      window.opener.location.reload();
      window.close();
    }
  }, [session]);

  useEffect(() => {
    if (session === undefined) return;
    document.title = session
      ? 'Administration — FICH Team'
      : 'Connexion administration — FICH Team';
  }, [session]);

  if (session === undefined) return <Loader />;

  if (!session) return <Login accessDenied={accessDenied} />;

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

  if (!access) return <Loader />;

  return <AdminApp session={session} logout={logout} />;
}
