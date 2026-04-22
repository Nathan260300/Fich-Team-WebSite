import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { PageHero } from '../components/UI';
import { staggerDelay } from '../utils/helpers';
import styles from './Rejoindre.module.css';

const DiscordIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
  </svg>
);

const SECTIONS = [
  {
    num: '01',
    tag: 'Communauté ouverte',
    title: 'FICH Family',
    badge: 'Serveur Discord communautaire',
    content: (
      <>
        <p className={styles.desc}>
          La <strong>FICH Family</strong> est notre serveur Discord ouvert à tous. C'est le point d'entrée de l'univers FICH — un espace pour échanger, jouer et faire partie de la communauté avant tout engagement.
        </p>
        <p className={styles.desc}>
          Ce serveur sert aussi de pont vers nos futurs projets. Rejoindre la FICH Family, c'est la première étape pour intégrer un jour la FICH Team.
        </p>
      </>
    ),
    cta: { label: "Rejoindre la FICH Family →", href: 'https://discord.gg/ACRZ4zK2uD', primary: true },
  },
  {
    num: '02',
    tag: 'Équipe principale — Accès restreint',
    title: 'FICH Team',
    badge: 'Serveur privé — sur candidature',
    requirements: [
      'Avoir rejoint la FICH Family au préalable',
      'Être actif et impliqué dans la communauté',
      'Être mature et savoir discuter de manière chill',
      'Partager les valeurs FICH : Force, Intelligence, Charisme, Honneur',
      'Être passionné de gaming et de création',
    ],
    info: "<strong>Comment postuler ?</strong> Un salon dédié aux candidatures est disponible sur le serveur de la FICH Family. Tu peux t'y présenter de manière originale — montre qui tu es vraiment. Nous lisons chaque candidature avec attention.",
    cta: { label: "Rejoindre la FICH Family d'abord →", href: 'https://discord.gg/ACRZ4zK2uD', primary: true },
  },
];

export default function Rejoindre() {
  return (
    <PageWrapper>
      <PageHero
        badge="Rejoins l'aventure"
        title="Nous"
        accentTitle="Rejoindre"
        desc="Deux façons d'intégrer l'univers FICH, selon ton niveau d'implication."
      />

      <div className={styles.sections}>
        {SECTIONS.map((section, i) => (
          <motion.article
            key={section.num}
            className={styles.section}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: staggerDelay(i, 0.12), duration: 0.5, ease: [0.16,1,0.3,1] }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <div className={styles.sectionAccent} />
            <div className={styles.sectionHeader}>
              <div className={styles.num}>{section.num}</div>
              <div className={styles.titles}>
                <span className={styles.tag}>{section.tag}</span>
                <h2 className={styles.title}>{section.title}</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <div className={styles.discordBadge}>
                <DiscordIcon />
                {section.badge}
              </div>

              {section.content}

              {section.requirements && (
                <>
                  <div className={styles.reqLabel}>PRÉREQUIS</div>
                  <div className={styles.requirements}>
                    {section.requirements.map((req, j) => (
                      <motion.div
                        key={j}
                        className={styles.req}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: staggerDelay(i, 0.12) + j * 0.06 + 0.2, duration: 0.4 }}
                      >
                        <span className={styles.reqDot} />
                        <span>{req}</span>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {section.info && (
                <div className={styles.infoBox} dangerouslySetInnerHTML={{ __html: section.info }} />
              )}

              <a
                href={section.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={section.cta.primary ? styles.btnPrimary : styles.btnGhost}
              >
                {section.cta.label}
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </PageWrapper>
  );
}
