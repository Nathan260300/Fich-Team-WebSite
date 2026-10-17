import Hero from './Hero';
import KeyStats from './KeyStats';
import RecentBreakdown from './RecentBreakdown';
import ProgressChart from './ProgressChart';
import TeamBreakdown from './TeamBreakdown';
import GameHistory from './GameHistory';
import Storyteller from './Storyteller';
import PlayerNav from './PlayerNav';
import styles from './Player.module.css';

function dominantTone(teams) {
  const best = [...teams].sort((a, b) => b.wins - a.wins)[0];
  return best && best.wins > 0 ? best.team.color : 'var(--c-accent)';
}

export default function PlayerPage({ entry, data }) {
  const index = entry.rank - 1;
  const previous = data.ranking[index - 1] ?? null;
  const next = data.ranking[index + 1] ?? null;
  const ranked = data.storytellerRanking.find(s => s.player.id === entry.player.id) ?? null;

  return (
    <div className={styles.page}>
      <Hero entry={entry} total={data.ranking.length} tone={dominantTone(entry.teams)} />
      <KeyStats entry={entry} />
      <RecentBreakdown history={entry.history} />
      <ProgressChart entry={entry} />
      <TeamBreakdown teams={entry.teams} />
      <GameHistory history={entry.history} />
      <Storyteller entry={entry} ranked={ranked} />
      <PlayerNav previous={previous} next={next} />
    </div>
  );
}
