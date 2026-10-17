import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import PlayerPage from '../components/botc/player/PlayerPage';
import { useBotc } from '../hooks/useBotc';
import { BOTC_STATS_PATH } from '../lib/botcRoutes';
import styles from './Botc.module.css';

export default function BotcPlayer() {
  const { pseudo } = useParams();
  const { status, data } = useBotc();

  const entry = data
    ? data.ranking.find(r => r.player.minecraft_username?.toLowerCase() === pseudo.toLowerCase()) ?? null
    : null;

  const username = entry?.player.minecraft_username;

  useEffect(() => {
    if (username) document.title = `${username} BOTC – FICH Team`;
  }, [username]);

  return (
    <PageWrapper>
      <Link to={BOTC_STATS_PATH} className={styles.back}>← Statistiques</Link>

      {status === 'loading' && <div className={styles.loading}><span className={styles.loadingDot} /><span className={styles.loadingDot} /><span className={styles.loadingDot} /></div>}
      {status === 'error' && <p className={styles.error}>Impossible de charger les données du BOTC.</p>}

      {status === 'ok' && entry && <PlayerPage key={entry.player.id} entry={entry} data={data} />}

      {status === 'ok' && !entry && (
        <div className={styles.notFound}>
          <span className={styles.notFoundCode}>404</span>
          <h1 className={styles.notFoundTitle}>Joueur introuvable</h1>
          <p className={styles.notFoundText}>
            Aucun joueur avec le pseudo Minecraft « {pseudo} » n'a été trouvé.
          </p>
          <Link to={BOTC_STATS_PATH} className={styles.notFoundLink}>← Retour aux statistiques</Link>
        </div>
      )}
    </PageWrapper>
  );
}
