import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import Modal from '../components/Modal';
import { Badge, Btn, SectionLabel } from '../components/UI';
import { useModal } from '../hooks/useModal';
import { useFetch } from '../hooks/useFetch';
import { staggerDelay } from '../utils/helpers';
import { useAppReady } from '../App';
import styles from './Home.module.css';

function fixPath(src) {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  return '/' + src.replace(/^assets\//, '');
}

function FichLetters() {
  const letters = [
    { l: 'F', w: 'Force' },
    { l: 'I', w: 'Intelligence' },
    { l: 'C', w: 'Charisme' },
    { l: 'H', w: 'Honneur' },
  ];
  return (
    <div className={styles.fichLetters}>
      {letters.map(({ l, w }, i) => (
        <motion.span
          key={l}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ x: 6 }}
        >
          <strong>{l}</strong> {w}
        </motion.span>
      ))}
    </div>
  );
}

function CardWide({ card, ready }) {
  return (
    <motion.div
      className={`${styles.card} ${styles.cardWide}`}
      initial={{ opacity: 0, y: 20 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: 0.62, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.cardAccentBar} />
      <div className={styles.cardInnerRow}>
        <motion.img
          src="/logo.png"
          alt="FICH Team"
          className={styles.cardLogo}
          whileHover={{ scale: 1.08, rotate: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        />
        <div>
          <h3 className={styles.cardTitle}>{card.title}</h3>
          <p className={styles.cardText}>{card.short}</p>
        </div>
      </div>
    </motion.div>
  );
}

function CardNormal({ card, index, openModal, ready }) {
  if (card.special === 'fich-letters') {
    return (
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: staggerDelay(index, 0.08), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.cardAccentBar} />
        <div className={styles.cardInner}><FichLetters /></div>
      </motion.div>
    );
  }

  const clickable = !!card.full;
  return (
    <motion.div
      className={`${styles.card} ${clickable ? styles.cardClickable : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: 0.6 + staggerDelay(index, 0.09), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={clickable ? { y: -5, transition: { duration: 0.22 } } : {}}
      onClick={clickable ? () => openModal(card.id) : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e => e.key === 'Enter' && openModal(card.id)) : undefined}
    >
      <div className={styles.cardAccentBar} />
      <div className={styles.cardInner}>
        {card.emoji && <span className={styles.cardEmoji}>{card.emoji}</span>}
        <h3 className={styles.cardTitle}>{card.title}</h3>
        <p className={styles.cardText}>{card.short}</p>
      </div>
      {clickable && (
        <div className={styles.cardHint}>
          <span className={styles.readMore}>En savoir plus →</span>
        </div>
      )}
    </motion.div>
  );
}

export default function Home() {
  const ready = useAppReady();
  const { activeModal, openModal, closeModal } = useModal();
  const { data: homeData } = useFetch('/home.json');

  const cards = homeData?.cards ?? [];
  const wideCard  = cards.find(c => c.wide);
  const normCards = cards.filter(c => !c.wide);
  const activeCard = cards.find(c => c.id === activeModal);

  return (
    <PageWrapper>
      <section className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
        >
          <Badge color="blue">Communauté active</Badge>
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 32 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ delay: 0.55, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className={styles.titleLine}
            initial={{ opacity: 0, x: -20 }}
            animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            FICH
          </motion.span>
          <motion.span
            className={`${styles.titleLine} ${styles.titleAccent}`}
            initial={{ opacity: 0, x: 20 }}
            animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            TEAM
          </motion.span>
        </motion.h1>

        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, letterSpacing: '0.3em' }}
          animate={ready ? { opacity: 1, letterSpacing: '0.12em' } : { opacity: 0, letterSpacing: '0.3em' }}
          transition={{ delay: 0.22, duration: 0.45 }}
        >
          Force · Intelligence · Charisme · Honneur
        </motion.p>

        <motion.p
          className={styles.desc}
          initial={{ opacity: 0, y: 8 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 0.3, duration: 0.45 }}
        >
          Communauté de joueurs passionnés, matures et créatifs.<br />Build, redstone, RP et minijeux.
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.4, duration: 0.45 }}
        >
          <Btn href="/rejoindre"   variant="primary" size="lg">Nous rejoindre →</Btn>
          <Btn href="/membres"     variant="ghost"   size="lg">Les membres</Btn>
          <Btn href="/partenaires" variant="ghost"   size="lg">Nos partenaires</Btn>
          <Btn href="/projets"     variant="ghost"   size="lg">Nos projets</Btn>
        </motion.div>
      </section>

      <motion.section
        className={styles.cardsSection}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <SectionLabel>À PROPOS</SectionLabel>
        <div className={styles.grid}>
          {wideCard && <CardWide card={wideCard} ready={ready} />}
          {normCards.map((card, i) => (
            <CardNormal key={card.id} card={card} index={i + 1} openModal={openModal} ready={ready} />
          ))}
        </div>
      </motion.section>

      <Modal isOpen={!!activeCard} onClose={closeModal}>
        {activeCard?.full && (
          <div className={styles.modalBody}>
            <div className={styles.modalHeader}>
              {activeCard.emoji && <span className={styles.modalEmoji}>{activeCard.emoji}</span>}
              <h2 className={styles.modalTitle}>{activeCard.title}</h2>
            </div>
            <div className={styles.modalContent}>
              {activeCard.full.split('\n').map((line, i) =>
                line.trim()
                  ? <p key={i} dangerouslySetInnerHTML={{ __html: line }} />
                  : <br key={i} />
              )}
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
