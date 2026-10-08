import { useState } from 'react';
import { skinFace } from '../../lib/minecraft';
import styles from './Botc.module.css';

export default function Skin({ username, pseudo, size = 64 }) {
  const [failed, setFailed] = useState(false);
  const src = skinFace(username, size);

  if (!src || failed) {
    return <div className={styles.skinFallback}>{pseudo.charAt(0).toUpperCase()}</div>;
  }

  return <img src={src} alt={pseudo} className={styles.skin} loading="lazy" onError={() => setFailed(true)} />;
}
