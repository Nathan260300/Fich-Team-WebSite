import styles from './Background.module.css';

export default function Background({ variant = 'default' }) {
  const orb1Color = variant === 'error'
    ? 'radial-gradient(circle,var(--orb-1-err) 0%,transparent 70%)'
    : 'radial-gradient(circle,var(--orb-1) 0%,transparent 70%)';
  const orb2Color = variant === 'error'
    ? 'radial-gradient(circle,var(--orb-2-err) 0%,transparent 70%)'
    : 'radial-gradient(circle,var(--orb-2) 0%,transparent 70%)';
  const gridColor = variant === 'error'
    ? 'rgba(var(--rgb-red),.03)'
    : 'rgba(var(--rgb-accent),.03)';

  return (
    <div className={styles.layer} aria-hidden="true">
      <div className={styles.orb1} style={{ background: orb1Color }} />
      <div className={styles.orb2} style={{ background: orb2Color }} />
      <div className={styles.orb3} />
      <div
        className={styles.grid}
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px,transparent 1px),linear-gradient(90deg,${gridColor} 1px,transparent 1px)`,
        }}
      />
      <div className={styles.noise} />
    </div>
  );
}
