import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Ring from './Ring';
import { plural } from './format';
import styles from './Player.module.css';

function TeamCard({ data, index }) {
  const { team, roles, played, wins, losses, rate } = data;

  return (
    <motion.article
      className={styles.teamCard}
      style={{ '--team': team.color }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className={styles.teamHeader}>
        <Ring value={rate} color={team.color} size={84} stroke={8}>
          <span className={styles.ringValueSmall}>{rate}%</span>
        </Ring>
        <div className={styles.teamHeadText}>
          <h3 className={styles.teamName}>{team.icon} {team.label}</h3>
          <span className={styles.teamMeta}>{plural(played, 'partie', 'parties')}</span>
          <span className={styles.teamMeta}>{wins} V · {losses} D</span>
        </div>
      </header>

      {roles.length === 0 ? (
        <p className={styles.teamEmpty}>Aucun rôle joué dans ce camp.</p>
      ) : (
        <ul className={styles.teamRoles}>
          {roles.map(r => (
            <li key={r.role.id} className={styles.teamRole}>
              <div className={styles.teamRoleTop}>
                <Link to={`/activites/botc?tab=roles&role=${encodeURIComponent(r.role.slug)}`} className={styles.teamRoleName}>
                  {r.role.name}
                </Link>
                <span className={styles.teamRoleRate}>{r.rate}%</span>
              </div>
              <div className={styles.meter}><span style={{ width: `${r.rate}%` }} /></div>
              <span className={styles.teamRoleNumbers}>
                {plural(r.played, 'partie', 'parties')} · {r.wins} V / {r.losses} D
              </span>
            </li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}

export default function TeamBreakdown({ teams }) {
  return (
    <section className={styles.block}>
      <h2 className={styles.blockTitle}>Par camp</h2>
      <p className={styles.blockSub}>Taux de victoire et rôles joués dans chaque camp.</p>
      <div className={styles.teamGrid}>
        {teams.map((data, i) => <TeamCard key={data.team.id} data={data} index={i} />)}
      </div>
    </section>
  );
}
