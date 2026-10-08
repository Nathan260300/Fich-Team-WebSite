import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useBotcData() {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  const load = useCallback(async () => {
    const [players, roles, games, gamePlayers, rules, info] = await Promise.all([
      supabase.from('botc_players').select('*').order('pseudo'),
      supabase.from('botc_roles').select('*').order('name'),
      supabase.from('botc_games').select('*').order('played_at', { ascending: false }),
      supabase.from('botc_game_players').select('*'),
      supabase.from('botc_rules').select('*').order('sort_order'),
      supabase.from('botc_info').select('*').eq('id', 1).maybeSingle(),
    ]);

    const failed = [players, roles, games, gamePlayers, rules, info].find(r => r.error);
    if (failed) {
      setState({ status: 'error', data: null, error: failed.error.message });
      return;
    }

    setState({
      status: 'ok',
      error: null,
      data: {
        players: players.data ?? [],
        roles: roles.data ?? [],
        games: games.data ?? [],
        gamePlayers: gamePlayers.data ?? [],
        rules: rules.data ?? [],
        info: info.data ?? { id: 1, description: '', base_demon_wins: 0, base_citadin_wins: 0 },
      },
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
