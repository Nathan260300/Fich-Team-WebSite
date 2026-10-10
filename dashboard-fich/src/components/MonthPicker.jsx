import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MonthPicker.module.css';

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  short: capitalize(new Date(2000, i, 1).toLocaleDateString('fr-FR', { month: 'short' })),
  long: capitalize(new Date(2000, i, 1).toLocaleDateString('fr-FR', { month: 'long' })),
}));

export default function MonthPicker({ cursor, label, onChange }) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(cursor.getFullYear());
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = e => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const shift = delta => onChange(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));

  const toggle = () => {
    if (!open) setYear(cursor.getFullYear());
    setOpen(v => !v);
  };

  const pick = monthIndex => {
    onChange(new Date(year, monthIndex, 1));
    setOpen(false);
  };

  return (
    <div className={styles.nav} ref={rootRef}>
      <button type="button" className={styles.navBtn} onClick={() => shift(-1)} aria-label="Mois précédent">‹</button>

      <div className={styles.titleWrap}>
        <button
          type="button"
          className={`${styles.title} ${open ? styles.titleOpen : ''}`}
          onClick={toggle}
          aria-haspopup="true"
          aria-expanded={open}
          aria-live="polite"
        >
          <span className={styles.titleText}>{label}</span>
          <svg className={styles.caret} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              className={styles.panel}
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.yearRow}>
                <button type="button" className={styles.yearBtn} onClick={() => setYear(y => y - 1)} aria-label="Année précédente">‹</button>
                <span className={styles.year}>{year}</span>
                <button type="button" className={styles.yearBtn} onClick={() => setYear(y => y + 1)} aria-label="Année suivante">›</button>
              </div>
              <div className={styles.months}>
                {MONTHS.map((month, i) => {
                  const active = year === cursor.getFullYear() && i === cursor.getMonth();
                  return (
                    <button
                      key={month.long}
                      type="button"
                      className={`${styles.month} ${active ? styles.monthActive : ''}`}
                      onClick={() => pick(i)}
                      title={month.long}
                    >
                      {month.short}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button type="button" className={styles.navBtn} onClick={() => shift(1)} aria-label="Mois suivant">›</button>
    </div>
  );
}
