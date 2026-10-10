import { motion } from 'framer-motion';
import { TEAMS } from '../../lib/botc';
import { staggerDelay } from '../../utils/helpers';
import styles from '../../pages/Botc.module.css';

export default function RolesCatalog({ roles, onSelect }) {
  if (roles.length === 0) {
    return <p className={styles.empty}>Les rôles seront bientôt disponibles.</p>;
  }

  return (
    <div className={styles.rolesCatalog}>
      {TEAMS.map(team => {
        const list = roles
          .filter(r => r.team === team.id)
          .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        if (list.length === 0) return null;

        return (
          <section key={team.id} className={styles.roleGroup} style={{ '--team': team.color }}>
            <header className={styles.roleGroupHead}>
              <span className={styles.roleGroupTitle}>{team.icon} {team.label}</span>
              <span className={styles.roleGroupCount}>{list.length} rôle{list.length > 1 ? 's' : ''}</span>
            </header>
            <div className={styles.roleGrid}>
              {list.map((role, i) => (
                <motion.button
                  key={role.id}
                  type="button"
                  className={styles.roleCard}
                  onClick={() => onSelect(role.id)}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: staggerDelay(Math.min(i, 8), 0.04), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -3 }}
                >
                  <span className={styles.roleCardName}>{role.name}</span>
                  <span className={styles.roleCardMore}>Voir →</span>
                </motion.button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}