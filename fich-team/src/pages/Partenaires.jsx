import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { PageHero } from '../components/UI';
import { staggerDelay } from '../utils/helpers';
import styles from './Partenaires.module.css';

function LoadingDots() {
  return (
    <div className={styles.loading}>
      {[0,1,2].map(i => (
        <span key={i} className={styles.dot} style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

export default function Partenaires() {
  const [channels, setChannels] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    fetch('/channels.json')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setChannels(data); setStatus('ok'); })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <PageWrapper>
      <PageHero
        badge="Partenaires"
        title="Nos créateurs"
        accentTitle="partenaires"
        desc="Des créateurs de contenu qui partagent nos valeurs et font partie de la famille FICH."
      />

      {status === 'loading' && <LoadingDots />}
      {status === 'error' && (
        <div className={styles.error}>
          <span>😕</span>
          <p>Impossible de charger les partenaires.</p>
        </div>
      )}
      {status === 'ok' && (
        <div className={styles.grid}>
          {channels.map((ch, i) => (
            <motion.div
              key={ch.name}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: staggerDelay(i, 0.09), duration: 0.5, ease: [0.16,1,0.3,1] }}
              whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 280, damping: 18 } }}
          whileTap={{ scale: 0.97 }}
            >
              <div className={styles.cardBg} />
              <div className={styles.avatarWrap}>
                <img src={ch.avatar} alt={ch.name} className={styles.avatar} loading="lazy" />
                <div className={styles.ring} />
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{ch.name}</h3>
                <p className={styles.desc}>{ch.description}</p>
              </div>
              <a
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btn}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3.03 3.03 0 00-2.13-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.37.56A3.03 3.03 0 00.5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.03 3.03 0 002.13 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.37-.56a3.03 3.03 0 002.13-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
                </svg>
                Voir la chaîne
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
