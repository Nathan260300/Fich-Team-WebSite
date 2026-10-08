import { motion } from 'framer-motion';
import Skin from './Skin';
import styles from '../../pages/Botc.module.css';

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };
const DELAYS = { 1: 0.25, 2: 0.1, 3: 0.15 };

export default function Podium({ entries, onSelect }) {
  const order = [entries[1], entries[0], entries[2]].filter(Boolean);

  return (
    <div className={styles.podium} style={{ '--n': order.length }}>
      {order.map(entry => {
        const Tag = onSelect ? motion.button : motion.div;
        const extra = onSelect ? { type: 'button', onClick: () => onSelect(entry.id), whileHover: { y: -6 } } : {};

        return (
          <Tag
            key={entry.id}
            className={`${styles.podiumSlot} ${onSelect ? styles.podiumClickable : ''} ${styles[`podium${entry.rank}`]}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: DELAYS[entry.rank], duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            {...extra}
          >
            <span className={styles.podiumMedal}>{MEDALS[entry.rank]}</span>
            <Skin
              username={entry.username}
              pseudo={entry.pseudo}
              size={128}
              className={styles.podiumSkin}
              fallbackClass={styles.podiumSkinFallback}
            />
            <span className={styles.podiumName}>{entry.pseudo}</span>
            <span className={styles.podiumPoints}>{entry.label}</span>
            <span className={styles.podiumStep}>{entry.rank}</span>
          </Tag>
        );
      })}
    </div>
  );
}
