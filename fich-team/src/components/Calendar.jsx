import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { useModal } from '../hooks/useModal';
import { useEvents } from '../hooks/useEvents';
import { tagColor, dayKey, formatTime, formatLongDate, formatMonth, buildGrid } from '../lib/events';
import styles from './Calendar.module.css';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MAX_VISIBLE = 3;

function EventDetails({ event }) {
  const color = tagColor(event.tag);
  const start = formatTime(event.starts_at);
  const end = event.ends_at ? formatTime(event.ends_at) : null;

  return (
    <div className={styles.details}>
      <span className={styles.detailTag} style={{ '--tag': color }}>{event.tag}</span>
      <h3 className={styles.detailTitle}>{event.title}</h3>
      <div className={styles.detailMeta}>
        <span>📅 {formatLongDate(event.starts_at)}</span>
        <span>🕐 {end ? `${start} – ${end}` : start}</span>
      </div>
      {event.description
        ? <p className={styles.detailDesc}>{event.description}</p>
        : <p className={styles.detailEmpty}>Aucune description.</p>}
    </div>
  );
}

export default function Calendar() {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const { gridStart, gridEnd, cells } = useMemo(() => buildGrid(cursor), [cursor]);
  const { events, status } = useEvents(gridStart, gridEnd);
  const { activeModal, openModal, closeModal } = useModal();

  const byDay = useMemo(() => {
    const map = new Map();
    events.forEach(ev => {
      const key = dayKey(new Date(ev.starts_at));
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    });
    return map;
  }, [events]);

  const todayKey = dayKey(new Date());
  const activeEvent = activeModal?.startsWith('event-')
    ? events.find(ev => `event-${ev.id}` === activeModal) ?? null
    : null;

  const shift = delta => setCursor(c => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  const goToday = () => {
    const now = new Date();
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.toolbar}>
        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={() => shift(-1)} aria-label="Mois précédent">‹</button>
          <h3 className={styles.month} aria-live="polite">{formatMonth(cursor)}</h3>
          <button className={styles.navBtn} onClick={() => shift(1)} aria-label="Mois suivant">›</button>
        </div>
        <div className={styles.toolbarActions}>
          <button className={styles.todayBtn} onClick={goToday}>Aujourd'hui</button>
        </div>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map(d => <span key={d}>{d}</span>)}
      </div>

      <div className={`${styles.grid} ${status === 'loading' ? styles.loading : ''}`}>
        {cells.map(date => {
          const key = dayKey(date);
          const list = byDay.get(key) ?? [];
          const outside = date.getMonth() !== cursor.getMonth();
          const visible = list.slice(0, MAX_VISIBLE);
          const extra = list.length - visible.length;

          return (
            <div
              key={key}
              className={`${styles.cell} ${outside ? styles.outside : ''} ${key === todayKey ? styles.today : ''}`}
            >
              <span className={styles.dayNum}>{date.getDate()}</span>
              <div className={styles.events}>
                {visible.map(ev => (
                  <button
                    key={ev.id}
                    className={styles.chip}
                    style={{ '--tag': tagColor(ev.tag) }}
                    onClick={() => openModal(`event-${ev.id}`)}
                    title={`${formatTime(ev.starts_at)} — ${ev.title}`}
                  >
                    <span className={styles.chipTime}>{formatTime(ev.starts_at)}</span>
                    <span className={styles.chipTitle}>{ev.title}</span>
                  </button>
                ))}
                {extra > 0 && (
                  <button className={styles.more} onClick={() => openModal(`event-${list[MAX_VISIBLE].id}`)}>+{extra}</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {status === 'error' && <p className={styles.error}>Impossible de charger le planning.</p>}
      {status === 'ok' && events.length === 0 && (
        <motion.p className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Aucun événement prévu ce mois-ci.
        </motion.p>
      )}

      <Modal isOpen={!!activeEvent} onClose={closeModal} maxWidth={520}>
        {activeEvent && <EventDetails event={activeEvent} />}
      </Modal>
    </div>
  );
}
