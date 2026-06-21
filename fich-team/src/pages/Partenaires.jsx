import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { PageHero } from '../components/UI';
import { useSupabase } from '../hooks/useSupabase';
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

function ChannelCard({ ch, i }) {
  return (
    <motion.div
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
      <div className={styles.links}>
        {ch.url && (
          <a href={ch.url} target="_blank" rel="noopener noreferrer" className={styles.btn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.5 6.2a3.03 3.03 0 00-2.13-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.37.56A3.03 3.03 0 00.5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.03 3.03 0 002.13 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.37-.56a3.03 3.03 0 002.13-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
            </svg>
            Voir la chaîne
          </a>
        )}
        {ch.twitch_url && (
          <a href={ch.twitch_url} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.btnTwitch}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.3 1.7L1.7 7.3v14h5v2.7l2.7-2.7H13l5.7-5.7V1.7H4.3zm17 12.3l-3.3 3.3h-5l-2.7 2.7v-2.7H5.7V3.7h15.6v10.3z" />
              <rect x="14.7" y="7" width="2" height="5" />
              <rect x="9.7" y="7" width="2" height="5" />
            </svg>
            Twitch
          </a>
        )}
        {ch.discord_url && (
          <a href={ch.discord_url} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.btnDiscord}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.3 4.4A18 18 0 0015.7 3c-.2.4-.5.9-.7 1.3a16.6 16.6 0 00-6 0A13 13 0 008.3 3a18 18 0 00-4.6 1.4C1.1 9 .4 13.5.7 18a18 18 0 005.5 2.8c.4-.6.8-1.3 1.1-2a11 11 0 01-1.8-.9l.4-.3a13 13 0 0011.9 0l.4.3c-.6.3-1.2.6-1.8.9.3.7.7 1.4 1.1 2A18 18 0 0023.3 18c.4-5.2-.9-9.7-3-13.6zM8.8 15.3c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2zm6.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2z" />
            </svg>
            Discord
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Partenaires() {
  const { data: channels, status } = useSupabase('channels');

  const partners = channels ? channels.filter(c => c.category !== 'ancien') : [];
  const formers  = channels ? channels.filter(c => c.category === 'ancien') : [];

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
        <>
          <div className={styles.grid}>
            {partners.map((ch, i) => (
              <ChannelCard key={ch.id} ch={ch} i={i} />
            ))}
          </div>

          {formers.length > 0 && (
            <>
              <motion.div
                className={styles.sectionHeader}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <span className={styles.sectionBadge}>ANCIENS PARTENAIRES</span>
                <span className={styles.sectionLine} />
              </motion.div>
              <div className={styles.grid}>
                {formers.map((ch, i) => (
                  <ChannelCard key={ch.id} ch={ch} i={i} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </PageWrapper>
  );
}