import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { season, today, daysUntil, isNewYearPhase } from './season';
import { BatIcon, GhostIcon, SpiderIcon, WebIcon, BulbIcon, FishIcon } from './icons';
import styles from './SeasonLayer.module.css';

const PILL_KEY = 'fich-season-pill';
const BULB_COLORS = ['#ff5a5f', '#ffd86b', '#5ec8ff', '#7be38f'];
const FISH_COLORS = [
  ['#ff7ab8', '#ffd23f'],
  ['#4be3a6', '#fff27a'],
  ['#ffb347', '#ff6b6b'],
  ['#6ec8ff', '#ffffff'],
  ['#b18cff', '#ffd23f'],
];

const rand = (min, max) => min + Math.random() * (max - min);

function readPillHidden() {
  try {
    return window.sessionStorage.getItem(PILL_KEY) === 'hidden';
  } catch {
    return false;
  }
}

function writePillHidden() {
  try {
    window.sessionStorage.setItem(PILL_KEY, 'hidden');
  } catch {
    return;
  }
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function burstEmoji(glyphs, count, x, y) {
  if (prefersReducedMotion()) return;
  for (let i = 0; i < count; i += 1) {
    const node = document.createElement('span');
    node.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    node.className = styles.pop;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    document.body.appendChild(node);
    const dx = rand(-140, 140);
    const dy = -rand(90, 260);
    const animation = node.animate(
      [
        { transform: 'translate(-50%, -50%) scale(.6)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.3) rotate(${rand(-90, 90)}deg)`, opacity: 0 },
      ],
      { duration: rand(800, 1500), easing: 'cubic-bezier(.2,.8,.3,1)' },
    );
    animation.onfinish = () => node.remove();
  }
}

function pillContent() {
  const { m, d } = today;
  if (season === 'halloween') {
    if (m === 10 && d === 31) return { icon: '👻', text: 'C’est ce soir… Joyeux Halloween !' };
    if (m === 11) return { icon: '🕯️', text: 'Les esprits regagnent leur tombe…' };
    const n = daysUntil(10, 31);
    return { icon: '🎃', text: n === 1 ? 'Halloween, c’est demain…' : `Halloween dans ${n} jours` };
  }
  if (season === 'noel') {
    if (m === 12 && d === 25) return { icon: '🎅', text: 'Joyeux Noël à tous !' };
    if (m === 12 && d === 24) return { icon: '🎁', text: 'Réveillon de Noël : c’est ce soir !' };
    if (m === 12 && d < 24) return { icon: '🎄', text: `Noël dans ${daysUntil(12, 25)} jours` };
    if (m === 12 && d === 31) return { icon: '🥂', text: `Dernières heures de ${today.y}…` };
    if (m === 12) {
      const n = daysUntil(1, 1);
      return { icon: '✨', text: n === 1 ? 'Nouvel An demain !' : `Nouvel An dans ${n} jours` };
    }
    return { icon: '🎆', text: `Bonne année ${today.y} !` };
  }
  return { icon: '🐟', text: 'Poisson d’avril ! Clique pour pêcher.' };
}

function SeasonPill() {
  const [hidden, setHidden] = useState(readPillHidden);
  const content = useMemo(() => pillContent(), []);

  if (hidden) return null;

  const onActivate = (event) => {
    if (season === 'avril') {
      const rect = event.currentTarget.getBoundingClientRect();
      burstEmoji(['🐟', '🐠', '🐡', '🎣'], 14, rect.left + rect.width / 2, rect.top);
    }
    if (season === 'halloween') {
      const rect = event.currentTarget.getBoundingClientRect();
      burstEmoji(['🦇', '🎃', '👻'], 8, rect.left + rect.width / 2, rect.top);
    }
    if (season === 'noel') {
      const rect = event.currentTarget.getBoundingClientRect();
      burstEmoji(['❄️', '⭐', '🎁'], 10, rect.left + rect.width / 2, rect.top);
    }
  };

  return (
    <div className={styles.pill} role="status">
      <button type="button" className={styles.pillMain} onClick={onActivate}>
        <span className={styles.pillIcon} aria-hidden="true">{content.icon}</span>
        <span>{content.text}</span>
      </button>
      <button
        type="button"
        className={styles.pillClose}
        aria-label="Masquer"
        onClick={() => {
          writePillHidden();
          setHidden(true);
        }}
      >
        ×
      </button>
    </div>
  );
}

function Sky({ snow, fireworks, light }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion()) return undefined;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = performance.now();
    let nextBurst = 600;
    let flakes = [];
    const sparks = [];

    const makeFlake = (spread) => ({
      x: rand(0, width),
      y: spread ? rand(0, height) : -10,
      r: rand(1, 3.4),
      speed: rand(22, 60),
      drift: rand(8, 26),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.45, 0.95),
    });

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const target = snow ? Math.round(Math.min(130, width / 12) * (light ? 0.35 : 1)) : 0;
      flakes = Array.from({ length: target }, () => makeFlake(true));
    };

    const burst = () => {
      const cx = rand(width * 0.15, width * 0.85);
      const cy = rand(height * 0.12, height * 0.45);
      const hue = rand(0, 360);
      const count = 54;
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = rand(90, 190);
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: rand(0.5, 0.9),
          hue: hue + rand(-25, 25),
        });
      }
    };

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);

      if (snow) {
        for (const flake of flakes) {
          flake.y += flake.speed * dt;
          flake.phase += dt * 0.9;
          flake.x += Math.sin(flake.phase) * flake.drift * dt;
          if (flake.y > height + 10) Object.assign(flake, makeFlake(false), { x: rand(0, width) });
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,255,255,${flake.alpha})`;
          ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (fireworks) {
        nextBurst -= dt * 1000;
        if (nextBurst <= 0) {
          burst();
          nextBurst = rand(900, 2000);
        }
        ctx.globalCompositeOperation = 'lighter';
        for (let i = sparks.length - 1; i >= 0; i -= 1) {
          const spark = sparks[i];
          spark.vy += 120 * dt;
          spark.vx *= 0.985;
          spark.x += spark.vx * dt;
          spark.y += spark.vy * dt;
          spark.life -= spark.decay * dt;
          if (spark.life <= 0) {
            sparks.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.fillStyle = `hsla(${spark.hue},100%,62%,${spark.life})`;
          ctx.arc(spark.x, spark.y, 2.2 * spark.life + 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      frame = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [snow, fireworks, light]);

  return <canvas ref={ref} className={styles.sky} />;
}

function Garland() {
  const [count, setCount] = useState(() => Math.ceil(window.innerWidth / 120) + 1);

  useEffect(() => {
    const onResize = () => setCount(Math.ceil(window.innerWidth / 120) + 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const swags = Array.from({ length: count }, (_, index) => index);

  return (
    <div className={styles.garland}>
      {swags.map((index) => (
        <div key={index} className={styles.swag}>
          <svg viewBox="0 0 120 30" className={styles.wire} aria-hidden="true">
            <path d="M0 2Q60 26 120 2" fill="none" stroke="#1d3b2b" strokeWidth="2" />
          </svg>
          {[0, 1, 2].map((slot) => {
            const bulbIndex = index * 3 + slot;
            return (
              <span
                key={slot}
                className={`${styles.bulb} ${styles[`bulb${slot}`]}`}
                style={{ color: BULB_COLORS[bulbIndex % BULB_COLORS.length], animationDelay: `${(bulbIndex % 7) * 0.35}s` }}
              >
                <BulbIcon />
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function HalloweenFx({ light }) {
  const bats = useMemo(
    () => Array.from({ length: light ? 3 : 7 }, (_, i) => ({
      id: i,
      y: rand(6, 62),
      size: rand(26, 54),
      duration: rand(14, 28),
      delay: -rand(0, 26),
      drop: rand(-60, 160),
    })),
    [light],
  );
  const ghosts = useMemo(
    () => Array.from({ length: light ? 2 : 4 }, (_, i) => ({
      id: i,
      x: rand(6, 90),
      size: rand(34, 58),
      duration: rand(20, 34),
      delay: -rand(0, 30),
    })),
    [light],
  );

  return (
    <>
      {bats.map((bat) => (
        <div
          key={bat.id}
          className={styles.bat}
          style={{ top: `${bat.y}vh`, width: bat.size, animationDuration: `${bat.duration}s`, animationDelay: `${bat.delay}s`, '--drop': `${bat.drop}px` }}
        >
          <div className={styles.batBody}><BatIcon /></div>
        </div>
      ))}
      {ghosts.map((ghost) => (
        <div
          key={ghost.id}
          className={styles.ghost}
          style={{ left: `${ghost.x}%`, width: ghost.size, animationDuration: `${ghost.duration}s`, animationDelay: `${ghost.delay}s` }}
        >
          <GhostIcon />
        </div>
      ))}
      <div className={styles.spider}>
        <span className={styles.thread} />
        <SpiderIcon />
      </div>
      {!light && (
        <>
          <div className={`${styles.web} ${styles.webLeft}`}><WebIcon /></div>
          <div className={`${styles.web} ${styles.webRight}`}><WebIcon /></div>
        </>
      )}
    </>
  );
}

function NoelFx({ light }) {
  return (
    <>
      <Sky snow fireworks={isNewYearPhase()} light={light} />
      <Garland />
      {!light && (
        <svg className={styles.ridge} viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40V22C60 8 120 8 180 20s120 12 180 0 120-14 180-2 120 14 180 2 120-12 180 0 120 10 180 0 120-10 120-10V40z" fill="rgba(255,255,255,.92)" />
        </svg>
      )}
    </>
  );
}

function AvrilFx({ light }) {
  const swimmers = useMemo(
    () => Array.from({ length: light ? 3 : 8 }, (_, i) => ({
      id: i,
      y: rand(8, 88),
      size: rand(40, 96),
      duration: rand(16, 34),
      delay: -rand(0, 30),
      reverse: i % 2 === 1,
      colors: FISH_COLORS[i % FISH_COLORS.length],
    })),
    [light],
  );
  const bubbles = useMemo(
    () => Array.from({ length: light ? 6 : 16 }, (_, i) => ({
      id: i,
      x: rand(2, 98),
      size: rand(6, 20),
      duration: rand(9, 20),
      delay: -rand(0, 18),
    })),
    [light],
  );

  useEffect(() => {
    const onClick = (event) => {
      if (event.target.closest('button, a, input, textarea, select')) return;
      burstEmoji(['🐟', '🐠', '🫧'], 3, event.clientX, event.clientY);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          className={styles.bubble}
          style={{ left: `${bubble.x}%`, width: bubble.size, height: bubble.size, animationDuration: `${bubble.duration}s`, animationDelay: `${bubble.delay}s` }}
        />
      ))}
      {swimmers.map((fish) => (
        <div
          key={fish.id}
          className={`${styles.swimmer} ${fish.reverse ? styles.swimBack : styles.swimForward}`}
          style={{ top: `${fish.y}vh`, width: fish.size, animationDuration: `${fish.duration}s`, animationDelay: `${fish.delay}s` }}
        >
          <div className={`${styles.fish} ${fish.reverse ? '' : styles.fishFlip}`}>
            <FishIcon body={fish.colors[0]} fin={fish.colors[1]} />
          </div>
        </div>
      ))}
    </>
  );
}

function Backdrop() {
  if (season === 'halloween') {
    return (
      <>
        <div className={styles.stars} />
        <div className={styles.moon} />
        <div className={styles.fogA} />
        <div className={styles.fogB} />
        <div className={styles.vignette} />
      </>
    );
  }
  if (season === 'noel') {
    return (
      <>
        <div className={styles.stars} />
        <div className={styles.auroraA} />
        <div className={styles.auroraB} />
        <div className={styles.vignette} />
      </>
    );
  }
  return (
    <>
      <div className={styles.rays} />
      <div className={styles.waveBack} />
      <div className={styles.waveFront} />
    </>
  );
}

export default function SeasonLayer({ intensity = 'full' }) {
  if (!season) return null;
  const light = intensity === 'light';

  return createPortal(
    <>
      <div className={`${styles.backdrop} ${light ? styles.backdropLight : ''}`} data-season={season} aria-hidden="true">
        <Backdrop />
      </div>
      <div className={`${styles.fx} ${light ? styles.fxLight : ''}`} data-season={season} aria-hidden="true">
        {season === 'halloween' && <HalloweenFx light={light} />}
        {season === 'noel' && <NoelFx light={light} />}
        {season === 'avril' && <AvrilFx light={light} />}
      </div>
      {!light && <SeasonPill />}
    </>,
    document.body,
  );
}
