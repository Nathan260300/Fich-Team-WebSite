import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TEAM_BY_ID } from '../../lib/botc';
import { mdComponents } from './Markdown';
import styles from '../../pages/Botc.module.css';

export default function RoleDetails({ role }) {
  const team = TEAM_BY_ID[role.team];
  const hasDescription = (role.description ?? '').trim().length > 0;

  return (
    <div className={styles.roleDetails} style={{ '--team': team?.color }}>
      {team && <span className={styles.roleDetailsTeam}>{team.icon} {team.label}</span>}
      <h3 className={styles.roleDetailsName}>{role.name}</h3>
      <div className={`${styles.description} ${styles.roleProse}`}>
        {hasDescription
          ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{role.description}</ReactMarkdown>
          : <p className={styles.muted}>La description de ce rôle sera bientôt disponible.</p>}
      </div>
    </div>
  );
}