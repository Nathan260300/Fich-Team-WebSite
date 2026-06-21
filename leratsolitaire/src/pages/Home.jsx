import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Home.module.css';

const INTRO_CARDS = [
  { icon: '⚒️', title: 'MISSION', desc: 'Développer votre civilisation' },
  { icon: '🛸', title: 'MISSION', desc: 'Construisez des vaisseaux' },
  { icon: '🧭', title: 'MISSION', desc: 'Explorez les îles' },
  { icon: '🤝', title: 'MISSION', desc: 'Formez des alliances' },
  { icon: '⚔️', title: 'MISSION', desc: 'Détruisez vos ennemis' },
  { icon: '👑', title: 'MISSION', desc: 'Dominez le ciel' },
];

export default function Home({ categories }) {
  return (
    <div>
      <motion.div className={styles.hero} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}>
        <h1 className={styles.heroTitle}>Bienvenue sur le wiki<br />de Civilisation Céleste II !</h1>
        <p className={styles.heroDesc}>
          Votre source complète d'informations sur l'événement <strong>Civilisation Céleste II</strong>.<br />
          Explorez les mécanismes, découvrez de nouvelles créations et rejoignez une communauté passionnée !
        </p>
      </motion.div>

      <motion.div className={styles.introGrid} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }}>
        {INTRO_CARDS.map((c, i) => (
          <motion.div key={c.title} className={styles.introCard} variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}>
            <div className={styles.introIconWrap}><span className={styles.introIcon}>{c.icon}</span></div>
            <div className={styles.introTitleBar}>{c.title}</div>
            <p className={styles.introDesc}>{c.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {categories && categories.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionDeco} />
            Catégories
            <span className={styles.sectionDeco} />
          </div>
          <div className={styles.grid}>
            {categories.map((cat, i) => (
              <motion.div key={cat.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.05, duration: 0.3, ease: [0.16,1,0.3,1] }}>
                <Link to={`/categorie/${cat.slug}`} className={styles.card}>
                  <div className={styles.cardCornerTL} /><div className={styles.cardCornerTR} />
                  <div className={styles.cardCornerBL} /><div className={styles.cardCornerBR} />
                  <span className={styles.cardIcon}>{cat.icon}</span>
                  <span className={styles.cardName}>{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <p className={styles.disclaimer}>
        Civilisation Céleste II Wiki · Cet événement n'est pas affilié à Mojang AB.
      </p>
    </div>
  );
}