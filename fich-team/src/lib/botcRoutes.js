export const BOTC_STATS_PATH = '/activites/botc?tab=stats';

export function playerPath(username) {
  return `/activites/botc/stats/joueur/${encodeURIComponent(username)}`;
}
