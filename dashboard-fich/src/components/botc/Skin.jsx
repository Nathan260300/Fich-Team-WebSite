import { useEffect, useRef } from 'react';
import { useSkin } from '../../lib/skins';
import { loadImage, drawFace, FACE_SIZE, STEVE_URL } from '../../lib/skinRender';
import styles from './Botc.module.css';

export default function Skin({ username, pseudo }) {
  const canvasRef = useRef(null);
  const entry = useSkin(username);
  const hasName = Boolean(username?.trim());
  const pending = hasName && entry === undefined;
  const url = entry?.url ?? null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    let cancelled = false;

    const paint = img => {
      if (!cancelled) drawFace(ctx, img);
    };

    if (pending) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return () => {
        cancelled = true;
      };
    }

    const showSteve = () => loadImage(STEVE_URL).then(paint);

    if (!url) showSteve();
    else loadImage(url).then(paint, showSteve);

    return () => {
      cancelled = true;
    };
  }, [pending, url]);

  return (
    <canvas
      ref={canvasRef}
      width={FACE_SIZE.width}
      height={FACE_SIZE.height}
      className={styles.skin}
      role="img"
      aria-label={pseudo}
    />
  );
}