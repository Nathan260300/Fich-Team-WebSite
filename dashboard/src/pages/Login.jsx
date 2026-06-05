import { supabase } from '../lib/supabase';
import styles from './Login.module.css';

export default function Login() {
  const login = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: window.location.origin + '/app/',
        skipBrowserRedirect: true,
      },
    });

    if (error || !data?.url) return;

    const popup = window.open(
      data.url,
      'discord-login',
      'width=500,height=700,top=200,left=200'
    );

    const interval = setInterval(async () => {
      if (popup?.closed) {
        clearInterval(interval);
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          window.location.reload();
        }
      }
    }, 500);
  };

  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <img src="/app/logo.png" alt="FICH" width="52" height="52" loading="lazy" />
        </div>
        <h1 className={styles.title}>Dashboard FICH</h1>
        <p className={styles.sub}>Connecte-toi pour accéder<br />à ton espace.</p>
        <div className={styles.sep}>
          <span className={styles.sepLine} />
          <span className={styles.sepText}>connexion</span>
          <span className={styles.sepLine} />
        </div>
        <button className={styles.discordBtn} onClick={login}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
          </svg>
          Connexion avec Discord
        </button>
        <p className={styles.note}>Accès réservé aux membres autorisés.</p>
      </div>
    </div>
  );
}