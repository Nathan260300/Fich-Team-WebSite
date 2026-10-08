import { useEffect } from 'react';
import { motion } from 'framer-motion';
import s from '../pages/shared.module.css';

export default function FormModal({
  title,
  onClose,
  onSubmit,
  saving = false,
  error = null,
  submitLabel = 'Enregistrer',
  maxWidth,
  leftAction,
  children,
}) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className={s.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className={s.modal}
        style={maxWidth ? { maxWidth } : undefined}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={s.modalHeader}>
          <h2 className={s.modalTitle}>{title}</h2>
          <button type="button" className={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={s.modalBody}>
          {children}
          {error && (
            <motion.p className={s.error} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
              {error}
            </motion.p>
          )}
        </div>
        <div className={s.modalFooter}>
          {leftAction && <div style={{ marginRight: 'auto' }}>{leftAction}</div>}
          <button type="button" className={s.btnGhost} onClick={onClose}>Annuler</button>
          <button type="button" className={s.btnPrimary} onClick={onSubmit} disabled={saving}>
            {saving ? 'Enregistrement…' : submitLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
