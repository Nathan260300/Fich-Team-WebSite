import { useState } from 'react';
import { skinFace, skinBody } from '../../lib/minecraft';

export default function Skin({ username, pseudo, variant = 'face', size = 96, className, fallbackClass }) {
  const [failed, setFailed] = useState(false);
  const src = variant === 'body' ? skinBody(username) : skinFace(username, size);

  if (!src || failed) {
    return <div className={fallbackClass}>{pseudo.charAt(0).toUpperCase()}</div>;
  }

  return (
    <img
      src={src}
      alt={pseudo}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
