import { Link } from 'react-router-dom';
import Skin from '../Skin';
import { playerPath } from '../../../lib/botcRoutes';
import styles from './Player.module.css';

function NavCard({ entry, direction }) {
  if (!entry) return <span className={styles.navGhost} />;
  const { player } = entry;
  const isPrev = direction === 'prev';

  return (
    <Link
      to={playerPath(player.minecraft_username)}
      className={`${styles.navCard} ${isPrev ? styles.navPrev : styles.navNext}`}
    >
      <span className={styles.navArrow}>{isPrev ? '←' : '→'}</span>
      <Skin username={player.minecraft_username} pseudo={player.pseudo} className={styles.navSkin} />
      <span className={styles.navText}>
        <span className={styles.navLabel}>{isPrev ? 'Joueur précédent' : 'Joueur suivant'}</span>
        <span className={styles.navName}>{player.pseudo}</span>
        <span className={styles.navRank}>#{entry.rank} · {entry.total} pts</span>
      </span>
    </Link>
  );
}

export default function PlayerNav({ previous, next }) {
  return (
    <nav className={styles.nav} aria-label="Navigation entre joueurs">
      <NavCard entry={previous} direction="prev" />
      <NavCard entry={next} direction="next" />
    </nav>
  );
}
