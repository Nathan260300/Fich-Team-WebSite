import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import Modal, { ModalNav } from '../components/Modal';
import { PageHero } from '../components/UI';
import { useModal } from '../hooks/useModal';
import { useSupabase } from '../hooks/useSupabase';
import { useAvatar } from '../hooks/useAvatar';
import { storageUrl } from '../lib/supabase';
import { staggerDelay } from '../utils/helpers';
import styles from './Qui.module.css';

function AvatarImg({ avatarRaw, pseudo, className, fallbackClass }) {
  const url = useAvatar(avatarRaw);
  if (url) return <img src={url} alt={pseudo} className={className} loading="lazy" />;
  return <div className={fallbackClass}>{pseudo.charAt(0).toUpperCase()}</div>;
}

function LoadingGrid() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  );
}

function MembresPanel({ members, status, openModal }) {
  return (
    <>
      {status === 'loading' && <LoadingGrid />}
      {status === 'error' && <p className={styles.error}>Impossible de charger les membres.</p>}
      {status === 'ok' && members && (
        <section className={styles.section}>
          <div className={styles.grid}>
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                className={styles.card}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: staggerDelay(i, 0.07), duration: 0.5, ease: [0.16,1,0.3,1] }}
                whileHover={{ y: -6, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openModal(String(i))}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && openModal(String(i))}
              >
                <div className={styles.accentBar} />
                <motion.div
                  className={styles.avatarWrap}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                  <AvatarImg
                    avatarRaw={member.avatar}
                    pseudo={member.pseudo}
                    className={styles.avatar}
                    fallbackClass={styles.avatarFallback}
                  />
                </motion.div>
                <span className={styles.pseudo}>{member.pseudo}</span>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function PartnerCard({ ch, i }) {
  return (
    <motion.div
      className={styles.partnerCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: staggerDelay(i, 0.09), duration: 0.5, ease: [0.16,1,0.3,1] }}
      whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      whileTap={{ scale: 0.97 }}
    >
      <div className={styles.partnerCardBg} />
      <div className={styles.partnerAccentBar} />
      <div className={styles.partnerAvatarWrap}>
        {ch.avatar && <img src={ch.avatar} alt={ch.name} className={styles.partnerAvatar} loading="lazy" />}
        <div className={styles.partnerRing} />
      </div>
      <p className={styles.partnerName}>{ch.name}</p>
      {ch.description && <p className={styles.partnerDesc}>{ch.description}</p>}
      <div className={styles.partnerLinks}>
        {ch.url && (
          <a href={ch.url} target="_blank" rel="noopener noreferrer" className={styles.partnerBtn}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3.03 3.03 0 00-2.13-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.37.56A3.03 3.03 0 00.5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.03 3.03 0 002.13 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.37-.56a3.03 3.03 0 002.13-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" /></svg>
            YouTube
          </a>
        )}
        {ch.twitch_url && (
          <a href={ch.twitch_url} target="_blank" rel="noopener noreferrer" className={`${styles.partnerBtn} ${styles.partnerBtnTwitch}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M4.3 1.7L1.7 7.3v14h5v2.7l2.7-2.7H13l5.7-5.7V1.7H4.3zm17 12.3l-3.3 3.3h-5l-2.7 2.7v-2.7H5.7V3.7h15.6v10.3z" /><rect x="14.7" y="7" width="2" height="5" /><rect x="9.7" y="7" width="2" height="5" /></svg>
            Twitch
          </a>
        )}
        {ch.discord_url && (
          <a href={ch.discord_url} target="_blank" rel="noopener noreferrer" className={`${styles.partnerBtn} ${styles.partnerBtnDiscord}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A18 18 0 0015.7 3c-.2.4-.5.9-.7 1.3a16.6 16.6 0 00-6 0A13 13 0 008.3 3a18 18 0 00-4.6 1.4C1.1 9 .4 13.5.7 18a18 18 0 005.5 2.8c.4-.6.8-1.3 1.1-2a11 11 0 01-1.8-.9l.4-.3a13 13 0 0011.9 0l.4.3c-.6.3-1.2.6-1.8.9.3.7.7 1.4 1.1 2A18 18 0 0023.3 18c.4-5.2-.9-9.7-3-13.6zM8.8 15.3c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2zm6.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2z" /></svg>
            Discord
          </a>
        )}
      </div>
    </motion.div>
  );
}

function PartenairesPanel({ channels, status }) {
  const partners = channels ? channels.filter(c => c.category === 'partenaire' || (!c.category || (c.category !== 'ancien' && c.category !== 'recommandation'))) : [];
  const formers  = channels ? channels.filter(c => c.category === 'ancien') : [];
  const recommended = channels ? channels.filter(c => c.category === 'recommandation') : [];
  return (
    <>
      {status === 'loading' && <LoadingGrid />}
      {status === 'error' && <p className={styles.error}>Impossible de charger les partenaires.</p>}
      {status === 'ok' && (
        <>
          <div className={styles.partnerGrid}>
            {partners.map((ch, i) => <PartnerCard key={ch.id} ch={ch} i={i} />)}
          </div>
          {formers.length > 0 && (
            <>
              <motion.div className={styles.partnerSectionHeader} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <span className={styles.partnerSectionBadge}>ANCIENS PARTENAIRES</span>
                <span className={styles.partnerSectionLine} />
              </motion.div>
              <div className={styles.partnerGrid}>
                {formers.map((ch, i) => <PartnerCard key={ch.id} ch={ch} i={i} />)}
              </div>
            </>
          )}
          {recommended.length > 0 && (
            <>
              <motion.div className={styles.partnerSectionHeader} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <span className={styles.partnerSectionBadge}>RECOMMANDATIONS</span>
                <span className={styles.partnerSectionLine} />
              </motion.div>
              <div className={styles.partnerGrid}>
                {recommended.map((ch, i) => <PartnerCard key={ch.id} ch={ch} i={i} />)}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default function Qui() {
  const [tab, setTab] = useState('membres');
  const { data: members, status: membersStatus } = useSupabase('members');
  const { data: channels, status: channelsStatus } = useSupabase('channels');
  const { activeModal, openModal, closeModal } = useModal();

  const activeIndex  = members ? members.findIndex((_, i) => String(i) === activeModal) : -1;
  const activeMember = activeIndex >= 0 ? members[activeIndex] : null;
  const goTo = (idx) => openModal(String(idx));

  return (
    <PageWrapper>
      <PageHero
        badge="Qui"
        title="Qui"
        accentTitle="sommes-nous ?"
        desc="Membres de la FICH Team et ses relations — toutes les personnes qui font vivre la communauté."
      />

      <motion.div
        className={styles.tabs}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
      >
        {[{ id: 'membres', label: '👥 Membres' }, { id: 'partenaires', label: '🤝 Relations' }].map(t => (
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
                layoutId="tabIndicatorQui"
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
          {tab === 'membres' ? (
            <MembresPanel members={members} status={membersStatus} openModal={openModal} />
          ) : (
            <PartenairesPanel channels={channels} status={channelsStatus} />
          )}
        </motion.div>
      </AnimatePresence>

      <Modal isOpen={!!activeMember} onClose={closeModal}>
        {activeMember && (
          <>
            <div className={styles.modalBanner}>
              <img src={storageUrl(activeMember.banner)} alt="" loading="lazy" />
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalAvatarWrap}>
                <AvatarImg
                  avatarRaw={activeMember.avatar}
                  pseudo={activeMember.pseudo}
                  className={styles.modalAvatar}
                  fallbackClass={styles.modalAvatarFallback}
                />
              </div>
              <h2 className={styles.modalName}>{activeMember.pseudo}</h2>
              <p className={styles.modalDesc} style={{ whiteSpace: 'pre-line' }}>{activeMember.description}</p>
            </div>
            <div className={styles.modalFooter}>
              <ModalNav
                current={activeIndex}
                total={members.length}
                onPrev={() => goTo(activeIndex - 1)}
                onNext={() => goTo(activeIndex + 1)}
              />
            </div>
          </>
        )}
      </Modal>
    </PageWrapper>
  );
}