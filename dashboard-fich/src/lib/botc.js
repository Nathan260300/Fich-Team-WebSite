export const MJ_POINTS = 45;

export const TEAMS = [
  { id: 'demon', label: 'Démons', icon: '😈', color: '#ff4d6d' },
  { id: 'citadin', label: 'Citadins', icon: '🧑', color: '#3d9eff' },
  { id: 'etranger', label: 'Étrangers', icon: '🧍', color: '#4dd4c0' },
];

export const TEAM_BY_ID = Object.fromEntries(TEAMS.map(t => [t.id, t]));

function byDateDesc(a, b) {
  return new Date(b.playedAt) - new Date(a.playedAt);
}

function percent(part, total) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

export function computeBotc({ players, roles, games, gamePlayers, info }) {
  const roleMap = new Map(roles.map(r => [r.id, r]));
  const gameMap = new Map(games.map(g => [g.id, g]));

  const baseDemons = info?.base_demon_wins ?? 0;
  const baseCitadins = info?.base_citadin_wins ?? 0;
  const summary = {
    total: games.length + baseDemons + baseCitadins,
    demons: games.filter(g => g.winner === 'demons').length + baseDemons,
    citadins: games.filter(g => g.winner === 'citadins').length + baseCitadins,
  };

  const entriesByPlayer = new Map(players.map(p => [p.id, []]));
  gamePlayers.forEach(gp => {
    const game = gameMap.get(gp.game_id);
    const role = roleMap.get(gp.role_id);
    const list = entriesByPlayer.get(gp.player_id);
    if (!game || !role || !list) return;
    list.push({ ...gp, role, playedAt: game.played_at });
  });

  const stats = players.map(player => {
    const entries = entriesByPlayer.get(player.id).sort(byDateDesc);
    const mjRecorded = games.filter(g => g.storyteller_id === player.id);

    const baseWins = player.base_wins ?? 0;
    const baseLosses = player.base_losses ?? 0;
    const played = baseWins + baseLosses + entries.length;
    const wins = baseWins + entries.filter(e => e.won).length;
    const total = (player.base_points ?? 0) + entries.reduce((sum, e) => sum + e.points, 0) + mjRecorded.length * MJ_POINTS;

    const perRole = new Map();
    entries.forEach(e => {
      const current = perRole.get(e.role.id) ?? { role: e.role, played: 0, wins: 0 };
      current.played += 1;
      if (e.won) current.wins += 1;
      perRole.set(e.role.id, current);
    });

    const roleList = [...perRole.values()].map(r => ({
      ...r,
      losses: r.played - r.wins,
      rate: percent(r.wins, r.played),
    }));

    const bestRole = roleList
      .filter(r => r.wins > 0)
      .sort((a, b) => b.wins - a.wins || b.rate - a.rate || b.played - a.played)[0] ?? null;

    const teams = TEAMS.map(team => {
      const teamRoles = roleList
        .filter(r => r.role.team === team.id)
        .sort((a, b) => b.played - a.played || b.wins - a.wins || a.role.name.localeCompare(b.role.name, 'fr'));
      const teamPlayed = teamRoles.reduce((s, r) => s + r.played, 0);
      const teamWins = teamRoles.reduce((s, r) => s + r.wins, 0);
      return { team, roles: teamRoles, played: teamPlayed, wins: teamWins, losses: teamPlayed - teamWins, rate: percent(teamWins, teamPlayed) };
    });

    return {
      player,
      total,
      games: played,
      wins,
      losses: played - wins,
      rate: percent(wins, played),
      average: played ? Math.round((total / played) * 10) / 10 : 0,
      lastGamePoints: entries[0]?.points ?? player.base_last_points ?? null,
      lastRoles: entries.slice(0, 3).map(e => e.role),
      bestRole: bestRole ? bestRole.role : null,
      bestRoleWins: bestRole ? bestRole.wins : 0,
      teams,
      mjGames: (player.base_mj_games ?? 0) + mjRecorded.length,
      mjRecorded,
    };
  });

  const ranking = [...stats]
    .sort((a, b) => b.total - a.total || b.wins - a.wins || a.player.pseudo.localeCompare(b.player.pseudo, 'fr'))
    .map((s, i) => ({ ...s, rank: i + 1 }));

  const storytellerRanking = stats
    .filter(s => s.mjGames > 0)
    .map(s => {
      const demons = s.mjRecorded.filter(g => g.winner === 'demons').length;
      const last = s.mjRecorded.map(g => g.played_at).sort((a, b) => new Date(b) - new Date(a))[0] ?? null;
      return {
        player: s.player,
        games: s.mjGames,
        recorded: s.mjRecorded.length,
        demons,
        citadins: s.mjRecorded.length - demons,
        demonRate: percent(demons, s.mjRecorded.length),
        last,
      };
    })
    .sort((a, b) => b.games - a.games || a.player.pseudo.localeCompare(b.player.pseudo, 'fr'))
    .map((s, i) => ({ ...s, rank: i + 1 }));

  return { summary, ranking, storytellerRanking };
}
