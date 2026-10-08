import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { computeBotc } from '../lib/botc';

export function useBotc() {
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      supabase.from('botc_players').select('*'),
      supabase.from('botc_roles').select('*'),
      supabase.from('botc_games').select('*'),
      supabase.from('botc_game_players').select('*'),
      supabase.from('botc_rules').select('*').order('sort_order', { ascending: true }),
      supabase.from('botc_info').select('*').eq('id', 1).maybeSingle(),
    ]).then(([players, roles, games, gamePlayers, rules, info]) => {
      if (cancelled) return;
      const failed = [players, roles, games, gamePlayers, rules, info].some(r => r.error);
      if (failed) { setState({ status: 'error', data: null }); return; }

      const computed = computeBotc({
        players: players.data ?? [],
        roles: roles.data ?? [],
        games: games.data ?? [],
        gamePlayers: gamePlayers.data ?? [],
        info: info.data,
      });

      setState({
        status: 'ok',
        data: {
          ...computed,
          rules: rules.data ?? [],
          description: info.data?.description ?? '',
        },
      });
    });

    return () => { cancelled = true; };
  }, []);

  return state;
}
