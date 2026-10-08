import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import Calendar from '../components/Calendar';
import { PageHero, SectionTitle } from '../components/UI';
import { useSupabase } from '../hooks/useSupabase';
import { mediaUrl } from '../lib/supabase';
import { staggerDelay } from '../utils/helpers';
import styles from './Activites.module.css';

function ActivityCard({ activity, index }) {
  const image = mediaUrl(activity.image);
  const linked = !!activity.route;

  const content = (
    <>
      <div className={styles.cover}>
        {image
          ? <img src={image} alt="" className={styles.coverImg} loading="lazy" />
          : <span className={styles.coverIcon}>{activity.icon ?? '🎮'}</span>}
        {!linked && <span className={styles.soon}>Bientôt</span>}
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{activity.name}</h3>
        {activity.short_description && <p className={styles.desc}>{activity.short_description}</p>}
        {linked && <span className={styles.more}>Découvrir →</span>}
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: staggerDelay(index, 0.06), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={linked ? { y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } } : undefined}
    >
      {linked
        ? <Link to={activity.route} className={`${styles.card} ${styles.cardLink}`}>{content}</Link>
        : <div className={styles.card}>{content}</div>}
    </motion.div>
  );
}

export default function Activites() {
  const { data: activities, status } = useSupabase('activities');

  return (
    <PageWrapper>
      <PageHero
        badge="Planning & jeux"
        title="Nos"
        accentTitle="activités"
        desc="Retrouve le planning des prochaines sessions et découvre les jeux auxquels la communauté joue ensemble."
      />

      <section className={styles.section}>
        <SectionTitle>PLANNING</SectionTitle>
        <Calendar />
      </section>

      <section className={styles.section}>
        <SectionTitle>ACTIVITÉS</SectionTitle>
        {status === 'loading' && (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className={styles.skeleton} />)}
          </div>
        )}
        {status === 'error' && <p className={styles.error}>Impossible de charger les activités.</p>}
        {status === 'ok' && activities && (
          <div className={styles.grid}>
            {activities.map((a, i) => <ActivityCard key={a.id} activity={a} index={i} />)}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
