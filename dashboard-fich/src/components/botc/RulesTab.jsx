import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { persistOrder } from '../../lib/order';
import SortableList from '../SortableList';
import RowActions from '../RowActions';
import RuleModal from './RuleModal';
import s from '../../pages/shared.module.css';
import styles from './Botc.module.css';

function excerpt(markdown) {
  const text = markdown.replace(/[#>*_`|\-]/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > 90 ? `${text.slice(0, 90)}…` : text;
}

export default function RulesTab({ rules, reload }) {
  const [list, setList] = useState(rules);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setList(rules);
  }, [rules]);

  const reorder = async next => {
    setList(next);
    const orderError = await persistOrder('botc_rules', next);
    if (orderError) {
      setError(orderError.message);
      reload();
    }
  };

  const remove = async rule => {
    if (!confirm(`Supprimer la règle « ${rule.title} » ?`)) return;
    const { error: deleteError } = await supabase.from('botc_rules').delete().eq('id', rule.id);
    if (deleteError) setError(deleteError.message);
    else reload();
  };

  return (
    <div>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle} style={{ marginBottom: 0 }}>Livre des règles</h2>
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} className={s.btnPrimary} onClick={() => setModal({})}>
          + Ajouter
        </motion.button>
      </div>

      {error && <p className={s.error} style={{ marginBottom: 12 }}>{error}</p>}

      {list.length === 0 ? (
        <p className={s.empty}>Aucune règle pour le moment.</p>
      ) : (
        <SortableList
          items={list}
          onReorder={reorder}
          renderItem={(rule, ctx) => (
            <div className={s.row}>
              {ctx.handle}
              <span className={styles.ruleNum}>{String(ctx.index + 1).padStart(2, '0')}</span>
              <div className={s.rowInfo}>
                <span className={s.rowName}>{rule.title}</span>
                <span className={s.rowSub}>{excerpt(rule.content) || 'Sans contenu'}</span>
              </div>
              {rule.points !== null && (
                <span className={`${s.badge} ${rule.points < 0 ? styles.badgeNeg : s.badgeSure}`}>
                  {rule.points > 0 ? `+${rule.points}` : rule.points} pts
                </span>
              )}
              <RowActions
                onUp={ctx.moveUp}
                onDown={ctx.moveDown}
                isFirst={ctx.isFirst}
                isLast={ctx.isLast}
                onEdit={() => setModal(rule)}
                onDelete={() => remove(rule)}
              />
            </div>
          )}
        />
      )}

      <AnimatePresence>
        {modal && (
          <RuleModal
            rule={modal}
            onClose={() => setModal(null)}
            onSave={() => {
              setModal(null);
              reload();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
