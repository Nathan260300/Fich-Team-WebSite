import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, mediaUrl } from '../../lib/supabase';
import { persistOrder } from '../../lib/order';
import SortableList from '../SortableList';
import RowActions from '../RowActions';
import ActivityModal from './ActivityModal';
import s from '../../pages/shared.module.css';
import styles from './Activities.module.css';

export default function ActivitiesManager() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    const { data, error: loadError } = await supabase.from('activities').select('*').order('sort_order');
    if (loadError) setError(loadError.message);
    else {
      setError(null);
      setActivities(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reorder = async list => {
    setActivities(list);
    const orderError = await persistOrder('activities', list);
    if (orderError) {
      setError(orderError.message);
      load();
    }
  };

  const remove = async activity => {
    if (!confirm(`Supprimer « ${activity.name} » ?`)) return;
    const { error: deleteError } = await supabase.from('activities').delete().eq('id', activity.id);
    if (deleteError) setError(deleteError.message);
    else load();
  };

  return (
    <div>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle} style={{ marginBottom: 0 }}>Cartes d’activités</h2>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          className={s.btnPrimary}
          onClick={() => setModal({})}
        >
          + Ajouter
        </motion.button>
      </div>

      {error && <p className={s.error} style={{ marginBottom: 12 }}>{error}</p>}

      {loading ? (
        <div className={s.loading}>Chargement…</div>
      ) : activities.length === 0 ? (
        <p className={s.empty}>Aucune activité pour le moment.</p>
      ) : (
        <SortableList
          items={activities}
          onReorder={reorder}
          renderItem={(activity, ctx) => {
            const image = mediaUrl(activity.image);
            return (
              <div className={s.row}>
                {ctx.handle}
                <div className={styles.thumb}>
                  {image ? <img src={image} alt="" /> : <span>{activity.icon || '🎮'}</span>}
                </div>
                <div className={s.rowInfo}>
                  <span className={s.rowName}>{activity.name}</span>
                  <span className={s.rowSub}>
                    {activity.slug} · {activity.route || 'Bientôt'}
                  </span>
                </div>
                <span className={`${s.badge} ${activity.route ? s.badgeSure : s.badgeUncertain}`}>
                  {activity.route ? 'Actif' : 'Bientôt'}
                </span>
                <RowActions
                  onUp={ctx.moveUp}
                  onDown={ctx.moveDown}
                  isFirst={ctx.isFirst}
                  isLast={ctx.isLast}
                  onEdit={() => setModal(activity)}
                  onDelete={() => remove(activity)}
                />
              </div>
            );
          }}
        />
      )}

      <AnimatePresence>
        {modal && (
          <ActivityModal
            activity={modal}
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
