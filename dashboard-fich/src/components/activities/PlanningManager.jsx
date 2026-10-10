import { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { tagColor, dayKey, formatTime, formatMonth, buildGrid } from '../../lib/events';
import { dayInputValue } from '../../lib/dates';
import EventModal from './EventModal';
import MonthPicker from '../MonthPicker';
import s from '../../pages/shared.module.css';
import styles from './Activities.module.css';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MAX_VISIBLE = 3;

export default function PlanningManager() {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [events, setEvents] = useState([]);
  const [tags, setTags] = useState(['Général']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const { gridStart, gridEnd, cells } = useMemo(() => buildGrid(cursor), [cursor]);
  const from = gridStart.toISOString();
  const to = gridEnd.toISOString();

  const load = useCallback(async () => {
    setLoading(true);
    const [month, allTags] = await Promise.all([
      supabase.from('events').select('*').gte('starts_at', from).lt('starts_at', to).order('starts_at'),
      supabase.from('events').select('tag'),
    ]);
    if (month.error) setError(month.error.message);
    else {
      setError(null);
      setEvents(month.data ?? []);
    }
    const unique = new Set(['Général', ...(allTags.data ?? []).map(row => row.tag)]);
    setTags([...unique].sort((a, b) => a.localeCompare(b, 'fr')));
    setLoading(false);
  }, [from, to]);

  useEffect(() => {
    load();
  }, [load]);

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
  const changeMonth = date => {
    setExpanded(null);
    setCursor(date);
  };
  const goToday = () => {
    const now = new Date();
    setExpanded(null);
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  return (
    <div>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle} style={{ marginBottom: 0 }}>Planning</h2>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          className={s.btnPrimary}
          onClick={() => setModal({ defaultStart: dayInputValue(new Date()) })}
        >
          + Ajouter un événement
        </motion.button>
      </div>

      {error && <p className={s.error} style={{ marginBottom: 12 }}>{error}</p>}

      <div className={styles.calendar}>
        <div className={styles.toolbar}>
          <MonthPicker cursor={cursor} label={formatMonth(cursor)} onChange={changeMonth} />
          <button type="button" className={s.btnGhost} onClick={goToday}>Aujourd’hui</button>
        </div>

        <div className={styles.weekdays}>
          {WEEKDAYS.map(d => <span key={d}>{d}</span>)}
        </div>

        <div className={`${styles.grid} ${loading ? styles.gridLoading : ''}`}>
          {cells.map(date => {
            const key = dayKey(date);
            const list = byDay.get(key) ?? [];
            const outside = date.getMonth() !== cursor.getMonth();
            const showAll = expanded === key;
            const visible = showAll ? list : list.slice(0, MAX_VISIBLE);
            const extra = list.length - visible.length;

            return (
              <div
                key={key}
                className={`${styles.cell} ${outside ? styles.outside : ''} ${key === todayKey ? styles.today : ''}`}
              >
                <div className={styles.cellHead}>
                  <span className={styles.dayNum}>{date.getDate()}</span>
                  <button
                    type="button"
                    className={styles.addDay}
                    title="Ajouter un événement ce jour"
                    onClick={() => setModal({ defaultStart: dayInputValue(date) })}
                  >
                    +
                  </button>
                </div>
                <div className={styles.events}>
                  {visible.map(ev => (
                    <button
                      key={ev.id}
                      type="button"
                      className={styles.chip}
                      style={{ '--tag': tagColor(ev.tag) }}
                      onClick={() => setModal({ event: ev })}
                      title={`${formatTime(ev.starts_at)} — ${ev.title}`}
                    >
                      <span className={styles.chipTime}>{formatTime(ev.starts_at)}</span>
                      <span className={styles.chipTitle}>{ev.title}</span>
                    </button>
                  ))}
                  {extra > 0 && (
                    <button type="button" className={styles.more} onClick={() => setExpanded(key)}>+{extra}</button>
                  )}
                  {showAll && list.length > MAX_VISIBLE && (
                    <button type="button" className={styles.more} onClick={() => setExpanded(null)}>Réduire</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!loading && events.length === 0 && <p className={s.empty}>Aucun événement ce mois-ci.</p>}
      </div>

      <AnimatePresence>
        {modal && (
          <EventModal
            event={modal.event ?? {}}
            defaultStart={modal.defaultStart}
            tags={tags}
            onClose={() => setModal(null)}
            onSave={() => {
              setModal(null);
              load();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
