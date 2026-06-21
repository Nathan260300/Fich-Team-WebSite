import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import Modal, { ModalNav } from '../components/Modal';
import { PageHero } from '../components/UI';
import { useModal } from '../hooks/useModal';
import { useSupabase } from '../hooks/useSupabase';
import { storageUrl } from '../lib/supabase';
import { staggerDelay, getYouTubeThumbnail, getYouTubeEmbedUrl } from '../utils/helpers';
import styles from './Projets.module.css';

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: i => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  }),
};

function LoadingDots() {
  return (
    <div className={styles.loadingDots}>
      {[0,1,2].map(i => <span key={i} className={styles.loadingDot} style={{ animationDelay: `${i*0.15}s` }} />)}
    </div>
  );
}

function Countdown({ targetDate }) {
  function getTimeLeft(date) {
    const diff = new Date(date) - new Date();
    if (diff <= 0) return null;
    return {
      j: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  }
  const [time, setTime] = useState(() => getTimeLeft(targetDate));
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!time) return <span className={styles.cdDone}>DISPONIBLE</span>;

  return (
    <div className={styles.countdown}>
      {[['j', 'Jours'], ['h', 'Heures'], ['m', 'Min'], ['s', 'Sec']].map(([k, label], i) => (
        <motion.div
          key={k}
          className={styles.cdUnit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={time[k]}
              className={styles.cdNum}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              {String(time[k]).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
          <span className={styles.cdLabel}>{label}</span>
        </motion.div>
      ))}
    </div>
  );
}

function NextProjectSection({ onOpenForm }) {
  const { data: p } = useSupabase('next_project', { single: true, order: null });
  const { data: infos } = useSupabase('next_project_infos', { order: 'sort_order' });

  if (!p) return <LoadingDots />;

  const project = { ...p, infos: infos ?? [] };
  const formattedDate = new Date(project.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <motion.div
      className={styles.nextBox}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.nextGlow} />

      <motion.div
        className={styles.nextHeader}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <span className={styles.nextBadge}>
          <span className={styles.nextBadgeDot} />
          PROCHAIN PROJET
        </span>
        <span className={styles.nextDate}>📅 {formattedDate}</span>
      </motion.div>

      <motion.h2
        className={styles.nextTitle}
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {project.name}
      </motion.h2>

      <motion.p
        className={styles.nextDesc}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.28, duration: 0.45 }}
      >
        {project.description}
      </motion.p>

      <div className={styles.nextInfos}>
        {project.infos.map((info, i) => (
          <motion.div
            key={info.id}
            className={`${styles.nextInfoItem} ${info.highlight ? styles.nextInfoItemHighlight : ''} ${info.url ? styles.nextInfoItemLink : ''}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            transition={{ delay: 0.32 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => info.url && window.open(info.url, '_blank', 'noopener,noreferrer')}
          >
            <span className={styles.nextInfoIcon}>{info.icon}</span>
            <div>
              <p className={styles.nextInfoLabel}>{info.label}</p>
              <p className={styles.nextInfoValue}>{info.value}</p>
            </div>
            {info.url && (
              <svg className={styles.nextInfoArrow} width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        className={styles.nextFooter}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <div className={styles.nextCountdownBlock}>
          <p className={styles.nextCountdownLabel}>Lancement dans</p>
          <Countdown targetDate={project.date} />
        </div>
        <motion.button
          className={styles.nextFormBtn}
          onClick={onOpenForm}
          whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(61,158,255,.38)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12v9a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm4-2h4v2H6V2zM5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Remplir le formulaire
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function TimelineSection() {
  const { data: items } = useSupabase('future_projects');

  if (!items) return null;

  return (
    <motion.div
      className={styles.box}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className={styles.header}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        <span className={styles.badge}>FUTURS PROJETS</span>
        <span className={styles.headerLine} />
      </motion.div>

      <div className={styles.track}>
        <motion.div
          className={styles.vertLine}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />

        {items.map((item, i) => (
          <motion.div
            key={item.id}
            className={styles.item}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 + i * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className={`${styles.dot} ${item.uncertain ? styles.dotUncertain : styles.dotSure}`}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 320, damping: 18 }}
            />

            <motion.div
              className={styles.card}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
            >
              <div className={styles.cardTop}>
                <motion.span
                  className={styles.icon}
                  initial={{ scale: 0, rotate: -15 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.32 + i * 0.1, duration: 0.4, type: 'spring', stiffness: 280 }}
                >
                  {item.icon}
                </motion.span>
                <div className={styles.cardText}>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.sub}>{item.subtitle}</p>
                </div>
              </div>

              <span className={`${styles.dateTag} ${item.uncertain ? styles.dateTagUncertain : styles.dateTagSure}`}>
                {item.uncertain && <span className={styles.dateTilde}>~</span>}
                {item.date_label}
              </span>
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          className={styles.arrow}
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.35 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M4 10l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.arrowLabel}>Et plus encore…</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function OtherProjectsSection() {
  const { data: items } = useSupabase('other_projects');

  if (!items) return null;

  return (
    <motion.div
      className={styles.box}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className={styles.header}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        <span className={styles.badge}>AUTRES PROJETS</span>
        <span className={styles.headerLine} />
      </motion.div>

      <div className={styles.track}>
        <motion.div
          className={styles.vertLine}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />

        {items.map((item, i) => (
          <motion.div
            key={item.id}
            className={styles.item}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 + i * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className={`${styles.dot} ${item.uncertain ? styles.dotUncertain : styles.dotSure}`}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 320, damping: 18 }}
            />

            <motion.div
              className={styles.card}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
            >
              <div className={styles.cardTop}>
                <motion.span
                  className={styles.icon}
                  initial={{ scale: 0, rotate: -15 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.32 + i * 0.1, duration: 0.4, type: 'spring', stiffness: 280 }}
                >
                  {item.icon}
                </motion.span>
                <div className={styles.cardText}>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.sub}>{item.subtitle}</p>
                </div>
              </div>

              <span className={`${styles.dateTag} ${item.uncertain ? styles.dateTagUncertain : styles.dateTagSure}`}>
                {item.uncertain && <span className={styles.dateTilde}>~</span>}
                {item.date_label}
              </span>
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          className={styles.arrow}
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.35 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M4 10l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.arrowLabel}>Et plus encore…</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function PhotosPanel({ folders, openModal }) {
  if (!folders) return <LoadingDots />;
  return (
    <div className={styles.foldersGrid}>
      {folders.map((folder, i) => (
        <motion.div
          key={folder.id}
          className={styles.folderCard}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.22 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal(`folder_${folder.id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && openModal(`folder_${folder.id}`)}
        >
          <div className={styles.folderCover}>
            <img src={folder.images[0]} alt={folder.name} loading="lazy" />
            <div className={styles.folderOverlay}>
              <span className={styles.folderCount}>{folder.images.length} photos</span>
            </div>
          </div>
          <div className={styles.folderInfo}>
            <span className={styles.folderIcon}>{folder.icon}</span>
            <span className={styles.folderName}>{folder.name}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function VideosPanel({ openModal }) {
  const { data: videos } = useSupabase('videos', { select: '*, channel:channels!creator_id(name, avatar)' });

  if (!videos) return <LoadingDots />;

  return (
    <div className={styles.videoGrid}>
      {videos.map((video, i) => (
        <motion.div
          key={video.id}
          className={styles.videoCard}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.22 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal(`video_${video.id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && openModal(`video_${video.id}`)}
        >
          <div className={styles.videoThumb}>
            <img src={getYouTubeThumbnail(video.id)} alt={video.title} loading="lazy" />
            <div className={styles.videoPlay}>
              <motion.div
                className={styles.playBtn}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 360, damping: 20 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2.5l10 5.5-10 5.5V2.5z" fill="#070d1a" />
                </svg>
              </motion.div>
            </div>
          </div>
          <div className={styles.videoInfo}>
            <p className={styles.videoTitle}>{video.title}</p>
            <p className={styles.videoCreator}>{video.channel?.name ?? video.creator}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Projets() {
  const [tab, setTab] = useState('photos');
  const [formOpen, setFormOpen] = useState(false);
  const { activeModal, openModal, closeModal } = useModal();
  const { data: projectsRaw } = useSupabase('projects');
  const { data: projectImages } = useSupabase('project_images');
  const { data: nextProject } = useSupabase('next_project', { single: true, order: null });
  const { data: videos } = useSupabase('videos', { select: '*, channel:channels!creator_id(name, avatar)' });

  const folders = projectsRaw && projectImages
    ? projectsRaw.map(p => ({
        ...p,
        images: projectImages.filter(img => img.project_id === p.id).map(img => storageUrl(img.path)),
      }))
    : null;

  const isFolderModal = activeModal?.startsWith('folder_');
  const isPhotoModal  = activeModal?.startsWith('photo_');
  const isVideoModal  = activeModal?.startsWith('video_');

  const activeFolderId = isFolderModal ? activeModal.replace('folder_', '') : null;
  const activeFolder   = folders?.find(f => f.id === activeFolderId);

  let photoFolderId = null, photoIndex = -1;
  if (isPhotoModal) {
    const parts = activeModal.replace('photo_', '').split('_');
    photoFolderId = parts[0];
    photoIndex    = parseInt(parts[1], 10);
  }
  const photoFolder = folders?.find(f => f.id === photoFolderId);
  const activePhoto = photoFolder?.images[photoIndex];

  const activeVideoId = isVideoModal ? activeModal.replace('video_', '') : null;
  const activeVideo   = videos?.find(v => v.id === activeVideoId);

  const openPhoto = (folderId, idx) => openModal(`photo_${folderId}_${idx}`);
  const prevPhoto = () => photoIndex > 0 && openPhoto(photoFolderId, photoIndex - 1);
  const nextPhoto = () => photoFolder && photoIndex < photoFolder.images.length - 1 && openPhoto(photoFolderId, photoIndex + 1);

  return (
    <PageWrapper>
      <PageHero
        badge="Nos créations"
        title="Projets &"
        accentTitle="Médias"
        desc="Photos de nos events, vidéos de la communauté — retrace l'histoire de la FICH Team."
      />

      <NextProjectSection onOpenForm={() => setFormOpen(true)} />
      <TimelineSection />
      <OtherProjectsSection />

      <motion.div
        className={styles.tabs}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
      >
        {[{ id: 'photos', label: '📸 Photos' }, { id: 'videos', label: '🎬 Vidéos' }].map(t => (
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
                layoutId="tabIndicator"
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
          {tab === 'photos' ? (
            <PhotosPanel folders={folders} openModal={openModal} />
          ) : (
            <VideosPanel openModal={openModal} />
          )}
        </motion.div>
      </AnimatePresence>

      <Modal isOpen={!!activeFolder && isFolderModal} onClose={closeModal}>
        {activeFolder && (
          <div className={styles.folderModal}>
            <div className={styles.folderModalHeader}>
              <span>{activeFolder.icon}</span>
              <h2 className={styles.folderModalTitle}>{activeFolder.name}</h2>
              <span className={styles.folderCount2}>{activeFolder.images.length} photos</span>
            </div>
            <div className={styles.folderModalGrid}>
              {activeFolder.images.map((src, idx) => (
                <motion.div
                  key={idx}
                  className={styles.photoItem}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                  onClick={() => openPhoto(activeFolder.id, idx)}
                >
                  <img src={src} alt={`Photo ${idx + 1}`} loading="lazy" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!activePhoto && isPhotoModal} onClose={closeModal} maxWidth={900}>
        {activePhoto && photoFolder && (
          <>
            <div className={styles.photoWrap}>
              <motion.img
                key={activePhoto}
                src={activePhoto}
                alt=""
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className={styles.photoFooter}>
              <span className={styles.photoCategory}>{photoFolder.name}</span>
              <ModalNav
                current={photoIndex}
                total={photoFolder.images.length}
                onPrev={prevPhoto}
                onNext={nextPhoto}
              />
            </div>
          </>
        )}
      </Modal>

      <Modal isOpen={!!activeVideo && isVideoModal} onClose={closeModal}>
        {activeVideo && (
          <motion.div
            style={{ padding: '20px' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.videoWrap}>
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.id)}
                title={activeVideo.title}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
            <div className={styles.videoModalInfo}>
              <p className={styles.videoModalTitle}>{activeVideo.title}</p>
              <p className={styles.videoModalCreator}>{activeVideo.channel?.name ?? activeVideo.creator}</p>
            </div>
          </motion.div>
        )}
      </Modal>

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} maxWidth={740}>
        {nextProject && (
          <div className={styles.formModalWrap}>
            <div className={styles.formModalHeader}>
              <h3 className={styles.formModalTitle}>Inscription — {nextProject.name}</h3>
              <p className={styles.formModalSub}>Remplis le formulaire pour participer au prochain événement.</p>
            </div>
            <div className={styles.formIframeWrap}>
              <iframe
                src={nextProject.form_url}
                title="Formulaire d'inscription"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}