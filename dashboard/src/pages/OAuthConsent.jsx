import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from './OAuthConsent.module.css';

export default function OAuthConsent() {
  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const params = new URLSearchParams(window.location.search);
      const authorizationId = params.get('authorization_id');

      if (!authorizationId) {
        setError('authorization_id manquant.');
        setStatus('error');
        return;
      }

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        setStatus('error');
        return;
      }

      if (!sessionData.session) {
        const redirectTo =
          `${window.location.origin}/oauth/consent?authorization_id=${encodeURIComponent(
            authorizationId
          )}`;

        const { error: loginError } =
          await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
              redirectTo,
            },
          });

        if (loginError) {
          setError(loginError.message);
          setStatus('error');
        }

        return;
      }

      const { data, error: detailsError } =
        await supabase.auth.oauth.getAuthorizationDetails(
          authorizationId
        );

      if (detailsError) {
        setError(detailsError.message);
        setStatus('error');
        return;
      }

      if (!('authorization_id' in data)) {
        window.location.href = data.redirect_url;
        return;
      }

      setDetails(data);
      setStatus('ready');
    };

    load();
  }, []);

  const respond = async (action) => {
    if (!details?.authorization_id || status === 'processing') {
      return;
    }

    setStatus('processing');

    const call =
      action === 'approve'
        ? supabase.auth.oauth.approveAuthorization
        : supabase.auth.oauth.denyAuthorization;

    const { data, error: respondError } =
      await call(details.authorization_id);

    if (respondError) {
      setError(respondError.message);
      setStatus('ready');
      return;
    }

    window.location.href = data.redirect_url;
  };

  const scopes = Array.isArray(details?.scope)
    ? details.scope
    : (details?.scope ?? '').split(/\s+/).filter(Boolean);

  return (
    <div className={styles.root}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <img
            src="/app/logo.png"
            alt="FICH"
            width="52"
            height="52"
            loading="lazy"
          />
        </div>

        <h1 className={styles.title}>Autorisation</h1>

        {status === 'loading' && (
          <div className={styles.loaderWrap}>
            <span
              className={styles.loaderDot}
              style={{ animationDelay: '0s' }}
            />
            <span
              className={styles.loaderDot}
              style={{ animationDelay: '0.15s' }}
            />
            <span
              className={styles.loaderDot}
              style={{ animationDelay: '0.3s' }}
            />
          </div>
        )}

        {status === 'error' && !details && (
          <p className={styles.errorText}>{error}</p>
        )}

        {details && (status === 'ready' || status === 'processing') && (
          <>
            <p className={styles.sub}>
              <strong className={styles.clientName}>
                {details.client_name}
              </strong>{' '}
              souhaite accéder à ton compte Nathan.
            </p>

            {scopes.length > 0 && (
              <div className={styles.scopeBox}>
                <div className={styles.sep}>
                  <span className={styles.sepLine} />
                  <span className={styles.sepText}>
                    permissions demandées
                  </span>
                  <span className={styles.sepLine} />
                </div>

                <ul className={styles.scopeList}>
                  {scopes.map((scope) => (
                    <li key={scope} className={styles.scopeItem}>
                      {scope}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <p className={styles.errorText}>{error}</p>
            )}

            <div className={styles.actions}>
              <button
                className={styles.denyBtn}
                onClick={() => respond('deny')}
                disabled={status === 'processing'}
              >
                Refuser
              </button>

              <button
                className={styles.approveBtn}
                onClick={() => respond('approve')}
                disabled={status === 'processing'}
              >
                {status === 'processing'
                  ? 'Patiente…'
                  : 'Autoriser'}
              </button>
            </div>

            <p className={styles.note}>
              Tu peux révoquer cet accès à tout moment.
            </p>
          </>
        )}
      </div>
    </div>
  );
}