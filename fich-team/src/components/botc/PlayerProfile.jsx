import { motion } from 'framer-motion';
import Skin from './Skin';
import styles from '../../pages/Botc.module.css';

function StatBox({ label, value, tone }) {
  return (
    <div className={styles.statBox}>
      <span className={`${styles.statValue} ${tone ? styles[tone] : ''}`}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function TeamColumn({ data, index }) {
  const { team, roles, played, wins, losses, rate } = data;

  return (
    <motion.div
      className={styles.teamCol}
      style={{ '--team': team.color }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.teamHead}>
        <span className={styles.teamTitle}>{team.icon} {team.label}</span>
        <span className={styles.teamSummary}>
          {played} partie{played > 1 ? 's' : ''} · {rate}%
        </span>
        <div className={styles.meter}><span style={{ width: `${rate}%` }} /></div>
        <span className={styles.teamRecord}>{wins} V · {losses} D</span>
      </div>

      {roles.length === 0 && <p className={styles.teamEmpty}>Aucun rôle joué</p>}

      <ul className={styles.roleRows}>
        {roles.map(r => (
          <li key={r.role.id} className={styles.roleRow}>
            <div className={styles.roleTop}>
              <span className={styles.roleName}>{r.role.name}</span>
              <span className={styles.roleRate}>{r.rate}%</span>
            </div>
            <div className={styles.meter}><span style={{ width: `${r.rate}%` }} /></div>
            <div className={styles.roleNumbers}>
              <span>{r.played} jouée{r.played > 1 ? 's' : ''}</span>
              <span>{r.wins} victoire{r.wins > 1 ? 's' : ''}</span>
              <span>{r.wins} gagnée{r.wins > 1 ? 's' : ''} / {r.losses} perdue{r.losses > 1 ? 's' : ''}</span>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function PlayerProfile({ entry }) {
  const { player } = entry;
  const columns = entry.teams;

  return (
    <div className={styles.profile}>
      <div className={styles.profileHead}>
        <Skin
          username={player.minecraft_username}
          pseudo={player.pseudo}
          variant="body"
          className={styles.profileBody}
          fallbackClass={styles.profileFallback}
        />
        <div className={styles.profileIdentity}>
          <span className={styles.profileRank}>Classement #{entry.rank}</span>
          <h3 className={styles.profileName}>{player.pseudo}</h3>
          {player.minecraft_username && <span className={styles.profileMc}>⛏ {player.minecraft_username}</span>}
          {player.highlight && <p className={styles.profileQuote}>« {player.highlight} »</p>}
        </div>
      </div>

      <div className={styles.statGrid}>
        <StatBox label="Parties" value={entry.games} />
        <StatBox label="Victoires" value={entry.wins} tone="gain" />
        <StatBox label="Défaites" value={entry.losses} tone="loss" />
        <StatBox label="% victoire" value={`${entry.rate}%`} />
        <StatBox label="Points totaux" value={entry.total} />
        <StatBox label="Moy. / partie" value={entry.average} />
        <StatBox label="Fois MJ" value={entry.mjGames} />
      </div>

      <div className={styles.teamGrid} style={{ '--cols': columns.length }}>
        {columns.map((data, i) => <TeamColumn key={data.team.id} data={data} index={i} />)}
      </div>
    </div>
  );
}
