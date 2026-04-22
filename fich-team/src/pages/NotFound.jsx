import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Background from '../components/Background';
import { Badge, Btn } from '../components/UI';
import styles from './NotFound.module.css';

export default function NotFound() {
  const location = useLocation();
  const [path, setPath] = useState('');

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  return (
    <>
      <Background variant="error" />
      <div className={styles.wrap}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
        >
          <div className={styles.glitchWrap} aria-hidden="true">
            <span className={styles.num}>404</span>
            <span className={`${styles.num} ${styles.glitch1}`}>404</span>
            <span className={`${styles.num} ${styles.glitch2}`}>404</span>
          </div>
          <div className={styles.scanlines} aria-hidden="true" />

          <div className={styles.inner}>
            <Badge color="red">Erreur système</Badge>
            <h1 className={styles.title}>Page introuvable</h1>
            <p className={styles.code}>
              <span className={styles.prompt}>$</span>
              <span>GET {path || '/???'}</span>
              <span className={styles.cursor}>█</span>
            </p>
            <p className={styles.desc}>
              Cette page n'existe pas ou a été déplacée.<br />
              Vérifie l'URL ou retourne à l'accueil.
            </p>
            <div className={styles.actions}>
              <Btn href="/" variant="primary">← Retour à l'accueil</Btn>
              <Btn href="/partenaires" variant="ghost">Partenaires</Btn>
            </div>
          </div>

          <div className={styles.grid} aria-hidden="true" />
        </motion.div>
      </div>
    </>
  );
}
