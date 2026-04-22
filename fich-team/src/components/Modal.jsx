import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Modal.module.css';

function ModalContent({ onClose, children, maxWidth }) {
  const overlayRef = useRef(null);
  return (
    <motion.div
      ref={overlayRef}
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.18 } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      onClick={e => e.target === overlayRef.current && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        className={styles.box}
        style={{ maxWidth }}
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } }}
        exit={{ scale: 0.92, opacity: 0, y: 20, transition: { duration: 0.15 } }}
      >
        <button className={styles.close} onClick={onClose} aria-label="Fermer">✕</button>
        <div className={styles.scroll}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Modal({ isOpen, onClose, children, maxWidth = 820 }) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ModalContent onClose={onClose} maxWidth={maxWidth}>
          {children}
        </ModalContent>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function ModalNav({ current, total, onPrev, onNext }) {
  return (
    <div className={styles.nav}>
      <button className={styles.navBtn} onClick={onPrev} disabled={current === 0} aria-label="Précédent">‹</button>
      <span className={styles.navCounter}>{current + 1} / {total}</span>
      <button className={styles.navBtn} onClick={onNext} disabled={current === total - 1} aria-label="Suivant">›</button>
    </div>
  );
}
