import Skin from './Skin';
import { formatDate } from '../../lib/dates';
import s from '../../pages/shared.module.css';
import styles from './Botc.module.css';

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function StatsTab({ computed }) {
  const { summary, ranking, storytellerRanking } = computed;
  const { total, demons, citadins } = summary;
  const demonPct = total ? Math.round((demons / total) * 100) : 50;

  return (
    <div>
      <div className={s.card}>
        <h2 className={s.sectionTitle}>Statistiques générales</h2>
        <div className={styles.versus}>
          <div>
            <span className={styles.versusLabel}>🟥 Démons</span>
            <strong className={styles.versusNum} style={{ color: 'var(--c-red)' }}>{demons}</strong>
          </div>
          <div className={styles.versusMiddle}>
            <div className={styles.versusBar}>
              <span style={{ width: `${demonPct}%`, background: 'var(--c-red)' }} />
              <span style={{ width: `${100 - demonPct}%`, background: 'var(--c-accent)' }} />
            </div>
            <small>{total} partie{total > 1 ? 's' : ''} · {total ? `${demonPct}% / ${100 - demonPct}%` : '—'}</small>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className={styles.versusLabel}>🟦 Citadins</span>
            <strong className={styles.versusNum} style={{ color: 'var(--c-accent)' }}>{citadins}</strong>
          </div>
        </div>
      </div>

      <div className={s.card}>
        <h2 className={s.sectionTitle}>Classement des joueurs</h2>
        {ranking.length === 0 ? (
          <p className={s.empty}>Aucun joueur.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Joueur</th>
                  <th>Points</th>
                  <th>Parties</th>
                  <th>V / D</th>
                  <th>% victoire</th>
                  <th>Moy.</th>
                  <th>MJ</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map(entry => (
                  <tr key={entry.player.id}>
                    <td>{MEDALS[entry.rank] ?? entry.rank}</td>
                    <td>
                      <span className={styles.cellPlayer}>
                        <Skin username={entry.player.minecraft_username} pseudo={entry.player.pseudo} size={32} />
                        {entry.player.pseudo}
                      </span>
                    </td>
                    <td><strong>{entry.total}</strong></td>
                    <td>{entry.games}</td>
                    <td>{entry.wins} / {entry.losses}</td>
                    <td>{entry.rate}%</td>
                    <td>{entry.average}</td>
                    <td>{entry.mjGames}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={s.card}>
        <h2 className={s.sectionTitle}>Classement des MJ</h2>
        {storytellerRanking.length === 0 ? (
          <p className={s.empty}>Aucun MJ.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>MJ</th>
                  <th>Parties</th>
                  <th>🟥 Démons</th>
                  <th>🟦 Citadins</th>
                  <th>Dernière</th>
                </tr>
              </thead>
              <tbody>
                {storytellerRanking.map(entry => (
                  <tr key={entry.player.id}>
                    <td>{MEDALS[entry.rank] ?? entry.rank}</td>
                    <td>
                      <span className={styles.cellPlayer}>
                        <Skin username={entry.player.minecraft_username} pseudo={entry.player.pseudo} size={32} />
                        {entry.player.pseudo}
                      </span>
                    </td>
                    <td><strong>{entry.games}</strong></td>
                    <td>{entry.recorded > 0 ? entry.demons : '—'}</td>
                    <td>{entry.recorded > 0 ? entry.citadins : '—'}</td>
                    <td>{entry.last ? formatDate(entry.last) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
