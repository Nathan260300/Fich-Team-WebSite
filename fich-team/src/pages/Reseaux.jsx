import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { PageHero } from '../components/UI';
import styles from './Reseaux.module.css';

const NETWORKS = [
  {
    id: 'kofi',
    label: 'Ko-fi',
    handle: 'fichteam',
    desc: 'Soutenez la FICH Team en nous offrant un café ☕ ! Chaque soutien compte !',
    url: 'https://ko-fi.com/fichteam',
    color: '#ff5e5b',
    btnLabel: 'Soutenir sur Ko-fi',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.881 8.948c-.773-4.085-4.859-4.586-4.859-4.586H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.923zM5.51 16.35a.873.873 0 01-.862-.874.87.87 0 01.862-.871.87.87 0 01.862.871.873.873 0 01-.862.874zm5.535.262c-2.301.058-3.671-1.611-3.671-3.617V7.224h1.751v5.769c0 1.226.556 2.135 1.92 2.135 1.367 0 1.923-.909 1.923-2.135V7.224h1.751v5.771c0 2.006-1.373 3.617-3.674 3.617zm7.947-10.166h-.005v5.936c0 .567-.461 1.027-1.027 1.027h-1.26V7.224h1.265c.566 0 1.027.46 1.027 1.027v-.805z"/>
      </svg>
    ),
    featured: true,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    handle: 'FICH_team',
    desc: 'Vidéos, vlogs, highlights et contenu exclusif de la team.',
    url: 'https://www.youtube.com/@FICH_team',
    color: '#ff0000',
    btnLabel: 'Voir la chaîne',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.2a3.03 3.03 0 00-2.13-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.37.56A3.03 3.03 0 00.5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.03 3.03 0 002.13 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.37-.56a3.03 3.03 0 002.13-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/>
      </svg>
    ),
  },
  {
    id: 'twitch',
    label: 'Twitch',
    handle: 'fich_team',
    desc: 'Lives, streams et sessions de jeu en direct.',
    url: 'https://www.twitch.tv/fich_team',
    color: '#9146ff',
    btnLabel: 'Regarder en live',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: 'fich_team_',
    desc: 'Photos, stories et coulisses de la communauté.',
    url: 'https://www.instagram.com/fich_team_',
    color: '#e1306c',
    btnLabel: 'Suivre sur Instagram',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    handle: 'fich_team',
    desc: 'Shorts, highlights et moments épiques en format court.',
    url: 'https://www.tiktok.com/@fich_team',
    color: '#ee1d52',
    btnLabel: 'Voir sur TikTok',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    handle: 'fich_team',
    desc: 'Actus, annonces et échanges avec la communauté.',
    url: 'https://www.x.com/fich_team',
    color: '#e7e9ea',
    btnLabel: 'Suivre sur X',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 28, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const labelVariants = {
  hidden:  { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const btnVariants = {
  rest:  { scale: 1 },
  hover: { scale: 1.06, transition: { type: 'spring', stiffness: 380, damping: 16 } },
  tap:   { scale: 0.96 },
};

function FeaturedCard({ net }) {
  return (
    <motion.div
      className={styles.featuredCard}
      style={{ '--net-color': net.color }}
      variants={itemVariants}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 240, damping: 20 } }}
    >
      <div className={styles.featuredBg} />
      <motion.div
        className={styles.featuredIcon}
        style={{ color: net.color }}
        whileHover={{ scale: 1.18, rotate: -8, transition: { type: 'spring', stiffness: 320, damping: 14 } }}
      >
        {net.icon}
      </motion.div>
      <div className={styles.featuredInfo}>
        <div className={styles.featuredTop}>
          <h3 className={styles.featuredName}>{net.label}</h3>
          <span className={styles.featuredHandle}>{net.handle}</span>
        </div>
        <p className={styles.featuredDesc}>{net.desc}</p>
      </div>
      <div className={styles.featuredActions}>
        <motion.a
          href={net.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.featuredBtn}
          variants={btnVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          {net.btnLabel} →
        </motion.a>
        <motion.div variants={btnVariants} initial="rest" whileHover="hover" whileTap="tap">
          <Link to="/rejoindre" className={styles.joinBtn}>
            Rejoindre la team →
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

function NetworkCard({ net }) {
  return (
    <motion.a
      href={net.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      style={{ '--net-color': net.color }}
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 280, damping: 18 } }}
      whileTap={{ scale: 0.97 }}
    >
      <div className={styles.cardBg} />
      <motion.div
        className={styles.cardIcon}
        style={{ color: net.color }}
        whileHover={{ scale: 1.18, rotate: -8, transition: { type: 'spring', stiffness: 320, damping: 14 } }}
      >
        {net.icon}
      </motion.div>
      <div className={styles.cardInfo}>
        <h3 className={styles.cardName}>{net.label}</h3>
        <span className={styles.cardHandle}>{net.handle}</span>
        <p className={styles.cardDesc}>{net.desc}</p>
      </div>
      <motion.span
        className={styles.cardBtn}
        whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      >
        {net.btnLabel} →
      </motion.span>
    </motion.a>
  );
}

function AnimatedSection({ label, children, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className={styles.section} ref={ref}>
      <motion.p
        className={styles.sectionLabel}
        variants={labelVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {label}
      </motion.p>
      <motion.div
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {children}
      </motion.div>
    </section>
  );
}

export default function Reseaux() {
  const featured = NETWORKS.filter(n => n.featured);
  const others   = NETWORKS.filter(n => !n.featured);

  return (
    <PageWrapper>
      <PageHero
        badge="Réseaux"
        title="Retrouvez-nous"
        accentTitle="partout"
        desc="Suivez la FICH Team sur toutes les plateformes et soutenez la communauté."
      />

      <AnimatedSection label="SOUTIEN" className={styles.featuredGrid}>
        {featured.map(net => <FeaturedCard key={net.id} net={net} />)}
      </AnimatedSection>

      <AnimatedSection label="PLATEFORMES" className={styles.grid}>
        {others.map(net => <NetworkCard key={net.id} net={net} />)}
      </AnimatedSection>
    </PageWrapper>
  );
}