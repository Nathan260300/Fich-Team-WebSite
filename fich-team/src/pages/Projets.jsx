import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import Modal, { ModalNav } from '../components/Modal';
import { PageHero } from '../components/UI';
import { useModal } from '../hooks/useModal';
import { useFetch } from '../hooks/useFetch';
import { staggerDelay, getYouTubeThumbnail, getYouTubeEmbedUrl } from '../utils/helpers';
import styles from './Projets.module.css';

const VIDEOS = [
  {
    id: 'NG3GXSUPC9k',
    title: "S'échapper de la Prison la plus Sécurisée de Minecraft",
    creator: 'Ylianyan',
  },
];

function LoadingDots() {
  return (
    <div className={styles.loadingDots}>
      {[0,1,2].map(i => <span key={i} className={styles.dot} style={{ animationDelay: `${i*0.15}s` }} />)}
    </div>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: staggerDelay(i, 0.07), duration: 0.45 }}
          whileHover={{ y: -4, transition: { duration: 0.22 } }}
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
  return (
    <div className={styles.videoGrid}>
      {VIDEOS.map((video, i) => (
        <motion.div
          key={video.id}
          className={styles.videoCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: staggerDelay(i, 0.09), duration: 0.45 }}
          whileHover={{ y: -4, transition: { duration: 0.22 } }}
          onClick={() => openModal(`video_${video.id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && openModal(`video_${video.id}`)}
        >
          <div className={styles.videoThumb}>
            <img src={getYouTubeThumbnail(video.id)} alt={video.title} loading="lazy" />
            <div className={styles.videoPlay}>
              <div className={styles.playBtn}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2.5l10 5.5-10 5.5V2.5z" fill="#070d1a" />
                </svg>
              </div>
            </div>
          </div>
          <div className={styles.videoInfo}>
            <p className={styles.videoTitle}>{video.title}</p>
            <p className={styles.videoCreator}>{video.creator}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Projets() {
  const [tab, setTab] = useState('photos');
  const { activeModal, openModal, closeModal } = useModal();
  const { data: folders } = useFetch('/projects.json');

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
  const activeVideo   = VIDEOS.find(v => v.id === activeVideoId);

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

      <div className={styles.tabs}>
        {[{ id: 'photos', label: '📸 Photos' }, { id: 'videos', label: '🎬 Vidéos' }].map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
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
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
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
          <div style={{ padding: '20px' }}>
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
              <p className={styles.videoModalCreator}>{activeVideo.creator}</p>
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
