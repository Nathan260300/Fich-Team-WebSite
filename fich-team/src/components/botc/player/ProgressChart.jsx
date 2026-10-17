import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MJ_POINTS } from '../../../lib/botc';
import { formatDate, signed } from './format';
import styles from './Player.module.css';

const W = 800;
const H = 280;
const PAD = { left: 48, right: 18, top: 18, bottom: 34 };

function buildEvents(entry) {
  const games = entry.history.map(e => ({
    date: e.playedAt,
    label: e.role.name,
    delta: e.points,
    kind: e.won ? 'win' : 'loss',
  }));
  const master = entry.mjRecorded.map(g => ({
    date: g.played_at,
    label: 'Maître du jeu',
    delta: MJ_POINTS,
    kind: 'mj',
  }));
  const sorted = [...games, ...master].sort((a, b) => new Date(a.date) - new Date(b.date));
  let running = entry.basePoints;
  const points = [{ date: null, label: 'Avant le site', delta: null, total: running, kind: 'start' }];
  sorted.forEach(item => {
    running += item.delta;
    points.push({ ...item, total: running });
  });
  return points;
}

function niceBounds(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return { lo: min - 5, hi: max + 5 };
  const pad = (max - min) * 0.12;
  return { lo: Math.floor(min - pad), hi: Math.ceil(max + pad) };
}

export default function ProgressChart({ entry }) {
  const events = useMemo(() => buildEvents(entry), [entry]);
  const [hover, setHover] = useState(null);

  if (events.length < 2) {
    return (
      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Progression</h2>
        <p className={styles.empty}>Pas encore assez de parties enregistrées pour tracer une courbe.</p>
      </section>
    );
  }

  const { lo, hi } = niceBounds(events.map(p => p.total));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = i => PAD.left + (i / (events.length - 1)) * innerW;
  const y = v => PAD.top + (1 - (v - lo) / (hi - lo)) * innerH;

  const line = events.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.total).toFixed(1)}`).join(' ');
  const area = `${line} L${x(events.length - 1).toFixed(1)},${PAD.top + innerH} L${x(0).toFixed(1)},${PAD.top + innerH} Z`;
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round(lo + ((hi - lo) * i) / 4));

  const onMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const svgX = ratio * W;
    const index = Math.round(((svgX - PAD.left) / innerW) * (events.length - 1));
    setHover(Math.max(0, Math.min(events.length - 1, index)));
  };

  const active = hover === null ? null : events[hover];
  const first = events.find(p => p.date);
  const last = events[events.length - 1];

  return (
    <section className={styles.block}>
      <h2 className={styles.blockTitle}>Progression</h2>
      <p className={styles.blockSub}>Points cumulés, partie après partie (MJ inclus).</p>

      <div className={styles.chartCard}>
        <div className={styles.chartWrap}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className={styles.chart}
            role="img"
            aria-label={`Évolution des points : de ${events[0].total} à ${last.total}`}
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          >
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--c-accent)" stopOpacity="0.32" />
                <stop offset="100%" stopColor="var(--c-accent)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {ticks.map(t => (
              <g key={t}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,.07)" />
                <text x={PAD.left - 10} y={y(t) + 4} textAnchor="end" className={styles.axisText}>{t}</text>
              </g>
            ))}

            <motion.path
              d={area}
              fill="url(#chartFill)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
            <motion.path
              d={line}
              fill="none"
              stroke="var(--c-accent)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />

            {events.map((p, i) => (
              <circle
                key={i}
                cx={x(i)}
                cy={y(p.total)}
                r={hover === i ? 6 : events.length > 40 ? 0 : 3.5}
                fill={p.kind === 'mj' ? 'var(--c-gold)' : p.kind === 'loss' ? 'var(--c-red-soft)' : p.kind === 'win' ? 'var(--c-green)' : 'var(--c-muted)'}
                stroke="var(--c-surface)"
                strokeWidth="2"
              />
            ))}

            {hover !== null && (
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={PAD.top}
                y2={PAD.top + innerH}
                stroke="rgba(255,255,255,.25)"
                strokeDasharray="3 4"
              />
            )}

            <text x={PAD.left} y={H - 8} className={styles.axisText}>
              {first ? formatDate(first.date, false) : ''}
            </text>
            <text x={W - PAD.right} y={H - 8} textAnchor="end" className={styles.axisText}>
              {last.date ? formatDate(last.date, false) : ''}
            </text>
          </svg>

          {active && (
            <div
              className={styles.tooltip}
              style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(active.total) / H) * 100}%` }}
            >
              <span className={styles.tooltipTitle}>{active.label}</span>
              {active.date && <span className={styles.tooltipDate}>{formatDate(active.date)}</span>}
              {active.delta !== null && (
                <span className={active.delta >= 0 ? styles.gain : styles.loss}>{signed(active.delta)} pts</span>
              )}
              <span className={styles.tooltipTotal}>{active.total} pts au total</span>
            </div>
          )}
        </div>

        <div className={styles.legend}>
          <span><i style={{ background: 'var(--c-green)' }} />Victoire</span>
          <span><i style={{ background: 'var(--c-red-soft)' }} />Défaite</span>
          <span><i style={{ background: 'var(--c-gold)' }} />MJ</span>
        </div>
      </div>
    </section>
  );
}
