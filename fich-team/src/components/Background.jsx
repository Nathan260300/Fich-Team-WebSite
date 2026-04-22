import styles from './Background.module.css';

export default function Background({ variant = 'default' }) {
  const orb1Color = variant === 'error'
    ? 'radial-gradient(circle,#3a1010 0%,transparent 70%)'
    : 'radial-gradient(circle,#0a3060 0%,transparent 70%)';
  const orb2Color = variant === 'error'
    ? 'radial-gradient(circle,#1a0808 0%,transparent 70%)'
    : 'radial-gradient(circle,#061535 0%,transparent 70%)';
  const gridColor = variant === 'error'
    ? 'rgba(255,77,109,.03)'
    : 'rgba(61,158,255,.03)';

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
