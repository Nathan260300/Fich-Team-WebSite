import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import Modal, { ModalNav } from '../components/Modal';
import { PageHero } from '../components/UI';
import { useModal } from '../hooks/useModal';
import { useFetch } from '../hooks/useFetch';
import { staggerDelay } from '../utils/helpers';
import styles from './Membres.module.css';

function fixPath(src) {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  return '/' + src.replace(/^assets\//, '');
}

function AvatarImg({ src, pseudo, className, fallbackClass }) {
  if (src) return <img src={src} alt={pseudo} className={className} loading="lazy" />;
  return (
    <div className={fallbackClass}>
      {pseudo.charAt(0).toUpperCase()}
    </div>
  );
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

export default function Membres() {
  const { data: members, status } = useFetch('/members.json');
  const { activeModal, openModal, closeModal } = useModal();

  const activeIndex = members ? members.findIndex((_, i) => String(i) === activeModal) : -1;
  const activeMember = activeIndex >= 0 ? members[activeIndex] : null;

  const goTo = (idx) => openModal(String(idx));

  return (
    <PageWrapper>
      <PageHero
        badge="Notre équipe"
        title="Les membres"
        accentTitle="FICH"
        desc="Découvre les joueurs qui composent la FICH Team. Chaque membre apporte sa pierre à l'édifice."
      />

      {status === 'loading' && <LoadingGrid />}
      {status === 'error' && <p className={styles.error}>Impossible de charger les membres.</p>}
      {status === 'ok' && members && (
        <section className={styles.section}>
          <div className={styles.grid}>
            {members.map((member, i) => (
              <motion.div
                key={i}
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
                    src={fixPath(member.avatar)}
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

      <Modal isOpen={!!activeMember} onClose={closeModal}>
        {activeMember && (
          <>
            <div className={styles.modalBanner}>
              <img src={fixPath(activeMember.banner)} alt="" loading="lazy" />
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalAvatarWrap}>
                <AvatarImg
                  src={fixPath(activeMember.avatar)}
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
