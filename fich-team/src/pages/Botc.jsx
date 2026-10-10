import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageWrapper from '../components/PageWrapper';
import Modal from '../components/Modal';
import { PageHero, SectionTitle } from '../components/UI';
import Leaderboard from '../components/botc/Leaderboard';
import PlayerProfile from '../components/botc/PlayerProfile';
import RulesBook from '../components/botc/RulesBook';
import MasterRanking from '../components/botc/MasterRanking';
import RolesCatalog from '../components/botc/RolesCatalog';
import RoleDetails from '../components/botc/RoleDetails';
import { mdComponents } from '../components/botc/Markdown';
import { useModal } from '../hooks/useModal';
import { useBotc } from '../hooks/useBotc';
import styles from './Botc.module.css';

function Presentation({ description }) {
  const hasDescription = description.trim().length > 0;

  return (
    <div className={styles.description}>
      {hasDescription
        ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{description}</ReactMarkdown>
        : <p className={styles.muted}>La description du jeu sera bientôt disponible.</p>}
    </div>
  );
}

function GeneralStats({ summary }) {
  const { total, demons, citadins } = summary;
  const demonPct = total ? Math.round((demons / total) * 100) : 50;
  const citadinPct = total ? 100 - demonPct : 50;

  return (
    <div className={styles.versus}>
      <div className={styles.versusSide}>
        <span className={styles.versusLabel}>🟥 Victoires des Démons</span>
        <motion.strong
          className={styles.versusNum}
          style={{ color: 'var(--c-red)' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {demons}
        </motion.strong>
        <span className={styles.versusPct}>{total ? `${demonPct}%` : '—'}</span>
      </div>

      <div className={styles.versusBarWrap}>
        <div className={styles.versusBar} role="img" aria-label={`Démons ${demons}, Citadins ${citadins}`}>
          <motion.span
            className={styles.versusDemons}
            initial={{ width: '50%' }}
            whileInView={{ width: `${demonPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            className={styles.versusCitadins}
            initial={{ width: '50%' }}
            whileInView={{ width: `${citadinPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <span className={styles.versusTotal}>{total} partie{total > 1 ? 's' : ''} jouée{total > 1 ? 's' : ''}</span>
      </div>

      <div className={`${styles.versusSide} ${styles.versusRight}`}>
        <span className={styles.versusLabel}>🟦 Victoires des Citadins</span>
        <motion.strong
          className={styles.versusNum}
          style={{ color: 'var(--c-accent)' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {citadins}
        </motion.strong>
        <span className={styles.versusPct}>{total ? `${citadinPct}%` : '—'}</span>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'presentation', label: '🩸 Présentation' },
  { id: 'regles', label: '📖 Règles' },
  { id: 'roles', label: '🎭 Rôles' },
  { id: 'stats', label: '📊 Statistiques' },
];

export default function Botc() {
  const [tab, setTab] = useState('presentation');
  const { status, data } = useBotc();
  const { activeModal, openModal, closeModal } = useModal();

  const activeEntry = data && activeModal?.startsWith('joueur-')
    ? data.ranking.find(r => `joueur-${r.player.id}` === activeModal) ?? null
    : null;

  const activeRole = data && activeModal?.startsWith('role-')
    ? data.roles.find(r => `role-${r.id}` === activeModal) ?? null
    : null;

  return (
    <PageWrapper>
      <Link to="/activites" className={styles.back}>← Activités</Link>

      <PageHero
        badge="Blood on the Clocktower"
        badgeColor="red"
        title="Le"
        accentTitle="BOTC"
        desc="Parties, règles, classement et statistiques de chaque joueur de la FICH Family."
      />

      {status === 'loading' && <div className={styles.loading}><span /><span /><span /></div>}
      {status === 'error' && <p className={styles.error}>Impossible de charger les données du BOTC.</p>}

      {status === 'ok' && data && (
        <>
          <motion.div
            className={styles.tabs}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            {TABS.map(t => (
              <motion.button
                key={t.id}
                className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
                onClick={() => setTab(t.id)}
                whileTap={{ scale: 0.95 }}
              >
                {t.label}
                {tab === t.id && (
                  <motion.span
                    className={styles.tabIndicator}
                    layoutId="tabIndicatorBotc"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {tab === 'presentation' && (
                <section className={styles.section}>
                  <Presentation description={data.description} />
                </section>
              )}

              {tab === 'regles' && (
                <section className={styles.section}>
                  <RulesBook rules={data.rules} />
                </section>
              )}

              {tab === 'roles' && (
                <section className={styles.section}>
                  <RolesCatalog roles={data.roles} onSelect={id => openModal(`role-${id}`)} />
                </section>
              )}

              {tab === 'stats' && (
                <>
                  <section className={styles.section}>
                    <SectionTitle>STATISTIQUES GÉNÉRALES</SectionTitle>
                    <GeneralStats summary={data.summary} />
                  </section>

                  <section className={styles.section}>
                    <SectionTitle>CLASSEMENT DES JOUEURS</SectionTitle>
                    <Leaderboard ranking={data.ranking} onSelect={id => openModal(`joueur-${id}`)} />
                  </section>

                  <section className={styles.section}>
                    <SectionTitle>CLASSEMENT DES MJ</SectionTitle>
                    <MasterRanking ranking={data.storytellerRanking} onSelect={id => openModal(`joueur-${id}`)} />
                  </section>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      <Modal isOpen={!!activeEntry} onClose={closeModal} maxWidth={1080}>
        {activeEntry && <PlayerProfile entry={activeEntry} />}
      </Modal>

      <Modal isOpen={!!activeRole} onClose={closeModal} maxWidth={720}>
        {activeRole && <RoleDetails role={activeRole} />}
      </Modal>
    </PageWrapper>
  );
}