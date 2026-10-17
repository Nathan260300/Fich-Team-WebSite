export function BatIcon() {
  return (
    <svg viewBox="0 0 64 28" fill="currentColor" aria-hidden="true">
      <path d="M32 8c-1.6 0-2.6 1.6-3.2 3.4C26.6 8 22 5 12 4c3 2.4 4 5 3.6 7.6C11 10.6 5 11.6 0 16c5-1.6 8.6-.8 11 2.6 2.6-1.8 5-1.6 7.4.4 1.6-2.6 4-3.4 6.8-2.2L28 24l1.8-5.2c.6-1.4 1.4-2 2.2-2s1.6.6 2.2 2L36 24l2.8-7.2c2.8-1.2 5.2-.4 6.8 2.2 2.4-2 4.8-2.2 7.4-.4 2.4-3.4 6-4.2 11-2.6-5-4.4-11-5.4-15.6-4.4-.4-2.6.6-5.2 3.6-7.6-10 1-14.6 4-16.8 7.4C34.6 9.6 33.6 8 32 8z" />
    </svg>
  );
}

export function GhostIcon() {
  return (
    <svg viewBox="0 0 24 28" fill="currentColor" aria-hidden="true">
      <path d="M12 1C6 1 2.5 5.6 2.5 11.5V27l3.2-2.6L9 27l3-2.6L15 27l3.3-2.6 3.2 2.6V11.5C21.5 5.6 18 1 12 1z" />
      <circle cx="8.6" cy="11" r="2" fill="#1a0a24" />
      <circle cx="15.4" cy="11" r="2" fill="#1a0a24" />
      <ellipse cx="12" cy="17" rx="2.2" ry="2.8" fill="#1a0a24" />
    </svg>
  );
}

export function SpiderIcon() {
  return (
    <svg viewBox="0 0 48 40" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M18 18C10 12 6 12 2 6" />
        <path d="M17 22C8 20 4 24 1 30" />
        <path d="M18 26C10 28 8 34 6 39" />
        <path d="M20 29C16 32 16 36 15 39" />
        <path d="M30 18c8-6 12-6 16-12" />
        <path d="M31 22c9-2 13 2 16 8" />
        <path d="M30 26c8 2 10 8 12 13" />
        <path d="M28 29c4 3 4 7 5 10" />
      </g>
      <ellipse cx="24" cy="26" rx="8" ry="9.5" fill="currentColor" />
      <circle cx="24" cy="14" r="5.5" fill="currentColor" />
      <circle cx="22" cy="13" r="1.4" fill="#ff3b3b" />
      <circle cx="26" cy="13" r="1.4" fill="#ff3b3b" />
    </svg>
  );
}

export function WebIcon() {
  const rays = [0, 22, 45, 67, 90];
  const rings = [38, 72, 106, 140];
  const toPoint = (angle, radius) => {
    const rad = (angle * Math.PI) / 180;
    return [Math.cos(rad) * radius, Math.sin(rad) * radius];
  };
  return (
    <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      {rays.map((angle) => {
        const [x, y] = toPoint(angle, 158);
        return <path key={angle} d={`M0 0L${x.toFixed(1)} ${y.toFixed(1)}`} />;
      })}
      {rings.map((radius) => {
        let d = '';
        for (let i = 0; i < rays.length - 1; i += 1) {
          const [x1, y1] = toPoint(rays[i], radius);
          const [x2, y2] = toPoint(rays[i + 1], radius);
          const [cx, cy] = toPoint((rays[i] + rays[i + 1]) / 2, radius * 0.82);
          d += `${i === 0 ? `M${x1.toFixed(1)} ${y1.toFixed(1)}` : ''}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
        }
        return <path key={radius} d={d} />;
      })}
    </svg>
  );
}

export function PumpkinIcon() {
  return (
    <svg viewBox="0 0 120 110" aria-hidden="true">
      <defs>
        <radialGradient id="pkBody" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#ffa24d" />
          <stop offset="70%" stopColor="#ff7a1a" />
          <stop offset="100%" stopColor="#c2480a" />
        </radialGradient>
      </defs>
      <path d="M58 24c0-9 3-16 10-21l5 5c-5 3-6 9-5 16z" fill="#3f8a2c" />
      <ellipse cx="34" cy="66" rx="27" ry="37" fill="url(#pkBody)" />
      <ellipse cx="86" cy="66" rx="27" ry="37" fill="url(#pkBody)" />
      <ellipse cx="60" cy="66" rx="30" ry="40" fill="url(#pkBody)" />
      <g className="pumpkinFace" fill="#2a0a00">
        <path d="M34 56l11-15 11 15z" />
        <path d="M64 56l11-15 11 15z" />
        <path d="M60 66l-5 9h10z" />
        <path d="M30 80l6 8 7-6 7 8 7-8 7 8 7-8 7 6 6-8c-4 14-14 22-27 22S34 94 30 80z" />
      </g>
    </svg>
  );
}

export function TreeIcon() {
  const bulbs = [
    [60, 52, '#ff5a5f'], [44, 84, '#ffd86b'], [76, 80, '#5ec8ff'],
    [30, 116, '#ffd86b'], [60, 108, '#ff5a5f'], [90, 118, '#5ec8ff'],
  ];
  return (
    <svg viewBox="0 0 120 156" aria-hidden="true">
      <polygon points="60,18 92,66 28,66" fill="#1f7a4a" />
      <polygon points="60,42 100,100 20,100" fill="#27925a" />
      <polygon points="60,72 110,138 10,138" fill="#2fae6c" />
      <rect x="52" y="138" width="16" height="14" rx="2" fill="#7a4a24" />
      <polygon className="treeStar" points="60,2 64,13 76,13 66,20 70,32 60,25 50,32 54,20 44,13 56,13" fill="#ffd86b" />
      {bulbs.map(([cx, cy, fill], index) => (
        <circle key={index} className="treeBulb" style={{ animationDelay: `${index * 0.25}s` }} cx={cx} cy={cy} r="4.5" fill={fill} />
      ))}
    </svg>
  );
}

export function FishIcon({ body = '#ff7ab8', fin = '#ffd23f' }) {
  return (
    <svg viewBox="0 0 120 64" aria-hidden="true">
      <path d="M112 32l-6 -22c-8 2-14 8-18 14l-20-16c-6-4-24-2-40 10C16 24 8 30 4 32c4 2 12 8 26 16 16 12 34 14 40 10l18-14c4 6 10 12 18 14z" fill={body} />
      <path d="M50 10c6-4 14-4 20 2l-8 8z" fill={fin} />
      <path d="M46 54c8 6 16 4 20-2l-10-6z" fill={fin} />
      <circle cx="26" cy="28" r="5.5" fill="#fff" />
      <circle cx="25" cy="28" r="2.6" fill="#10202c" />
      <path d="M52 18c4 8 4 20 0 28" stroke="rgba(255,255,255,.55)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M68 16c4 8 4 24 0 32" stroke="rgba(255,255,255,.35)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function BulbIcon() {
  return (
    <svg viewBox="0 0 10 18" aria-hidden="true">
      <rect x="2.5" y="0" width="5" height="5" rx="1" fill="#2a3a30" />
      <path d="M5 4c3 0 5 2.4 5 5.4S8 17 5 17 0 12.4 0 9.4 2 4 5 4z" fill="currentColor" />
    </svg>
  );
}
