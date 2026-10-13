import { useEffect, useRef } from 'react';
import { useSkin } from '../../lib/skins';
import { loadImage, drawFace, drawBody, FACE_SIZE, BODY_SIZE, STEVE_URL } from '../../lib/skinRender';

export default function Skin({ username, pseudo, variant = 'face', className }) {
  const canvasRef = useRef(null);
  const entry = useSkin(username);
  const hasName = Boolean(username?.trim());
  const pending = hasName && entry === undefined;
  const url = entry?.url ?? null;
  const model = entry?.model ?? 'classic';
  const size = variant === 'body' ? BODY_SIZE : FACE_SIZE;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    let cancelled = false;

    const paint = (img, skinModel) => {
      if (cancelled) return;
      if (variant === 'body') drawBody(ctx, img, skinModel);
      else drawFace(ctx, img);
    };

    if (pending) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return () => {
        cancelled = true;
      };
    }

    const showSteve = () => loadImage(STEVE_URL).then(img => paint(img, 'classic'));

    if (!url) {
      showSteve();
    } else {
      loadImage(url).then(img => paint(img, model), showSteve);
    }

    return () => {
      cancelled = true;
    };
  }, [pending, url, model, variant]);

  return (
    <canvas
      ref={canvasRef}
      width={size.width}
      height={size.height}
      className={className}
      role="img"
      aria-label={pseudo}
    />
  );
}
