import { motion } from 'framer-motion';
import styles from './Tabs.module.css';

export default function Tabs({ tabs, value, onChange, group }) {
  return (
    <div className={styles.tabs} role="tablist">
      {tabs.map(tab => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`${styles.tab} ${active ? styles.active : ''}`}
            onClick={() => onChange(tab.id)}
          >
            <span className={styles.label}>{tab.label}</span>
            {tab.count !== undefined && <span className={styles.count}>{tab.count}</span>}
            {active && (
              <motion.span
                className={styles.indicator}
                layoutId={`tab-indicator-${group}`}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
