import { useState } from 'react';
import { motion } from 'framer-motion';
import Skin from '../Skin';
import { plural } from './format';
import styles from './Player.module.css';

export default function Hero({ entry, total, tone }) {
  const { player } = entry;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.section
      className={styles.hero}
      style={{ '--tone': tone }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.heroStage}>
        <div className={styles.heroGlow} />
        <motion.div
          className={styles.heroSkin}
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Skin
            username={player.minecraft_username}
            pseudo={player.pseudo}
            variant="body"
            className={styles.heroBody}
          />
        </motion.div>
        <div className={styles.heroFloor} />
      </div>

      <div className={styles.heroInfo}>
        <div className={styles.heroBadges}>
          <span className={styles.rankBadge}>
            <span className={styles.rankHash}>#</span>{entry.rank}
            <span className={styles.rankOf}>sur {plural(total, 'joueur', 'joueurs')}</span>
          </span>
          {entry.mjGames > 0 && <span className={styles.mjBadge}>🎙 MJ · {entry.mjGames}</span>}
        </div>

        <h1 className={styles.heroName}>{player.pseudo}</h1>
        <span className={styles.heroMc}>⛏ {player.minecraft_username}</span>

        {player.highlight && <p className={styles.heroQuote}>« {player.highlight} »</p>}

        <button type="button" className={styles.copyBtn} onClick={copy}>
          {copied ? '✓ Lien copié' : '🔗 Copier le lien'}
        </button>
      </div>
    </motion.section>
  );
}