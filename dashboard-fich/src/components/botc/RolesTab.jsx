import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAMS } from '../../lib/botc';
import RoleModal from './RoleModal';
import s from '../../pages/shared.module.css';
import styles from './Botc.module.css';

export default function RolesTab({ roles, gamePlayers, reload }) {
  const [modal, setModal] = useState(null);

  const usage = useMemo(() => {
    const map = new Map();
    gamePlayers.forEach(gp => map.set(gp.role_id, (map.get(gp.role_id) ?? 0) + 1));
    return map;
  }, [gamePlayers]);

  return (
    <div>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle} style={{ marginBottom: 0 }}>Rôles</h2>
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} className={s.btnPrimary} onClick={() => setModal({})}>
          + Ajouter
        </motion.button>
      </div>

      <div className={styles.teamColumns}>
        {TEAMS.map(team => {
          const list = roles.filter(r => r.team === team.id);
          return (
            <div key={team.id} className={styles.teamColumn} style={{ '--team': team.color }}>
              <div className={styles.teamHeader}>
                <span>{team.icon} {team.label}</span>
                <span className={styles.teamCount}>{list.length}</span>
              </div>
              {list.length === 0 && <p className={s.empty}>Aucun rôle.</p>}
              {list.map(role => (
                <button key={role.id} type="button" className={styles.roleItem} onClick={() => setModal(role)}>
                  <span>{role.name}</span>
                  <small>{usage.get(role.id) ?? 0} jouée(s)</small>
                </button>
              ))}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {modal && (
          <RoleModal
            role={modal}
            usage={usage.get(modal.id) ?? 0}
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
