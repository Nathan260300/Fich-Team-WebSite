import { useEffect, useState } from 'react';
import { fetchSiteGate } from '../lib/siteGate';
import { reportSupabaseError } from '../lib/serviceStatus';
import Maintenance from '../pages/Maintenance';
import styles from './SiteGate.module.css';

const POLL_INTERVAL_MS = 60000;

export default function SiteGate({ children }) {
  const [gate, setGate] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let hasGate = false;

    const check = async () => {
      const result = await fetchSiteGate();
      if (cancelled) return;
      if (result.ok) {
        hasGate = true;
        setGate(result.gate);
        return;
      }
      if (!hasGate) {
        reportSupabaseError(result.error, {
          status: result.status,
          essential: true,
          forceGlobal: true,
          source: 'site_gate',
        });
      }
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') check();
    };

    check();
    const interval = setInterval(onVisible, POLL_INTERVAL_MS);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  if (!gate) return null;

  if (gate.maintenance.enabled && !gate.canView) {
    return <Maintenance message={gate.maintenance.message} />;
  }

  return (
    <>
      {gate.maintenance.enabled && (
        <div className={styles.banner} role="status">
          <span className={styles.dot} />
          Maintenance du site en cours — tu vois le site car tu fais partie de l’équipe.
        </div>
      )}
      {children}
    </>
  );
}
