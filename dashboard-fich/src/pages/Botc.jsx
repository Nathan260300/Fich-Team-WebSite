import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { useBotcData } from '../hooks/useBotcData';
import { computeBotc } from '../lib/botc';
import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import InfoTab from '../components/botc/InfoTab';
import RulesTab from '../components/botc/RulesTab';
import PlayersTab from '../components/botc/PlayersTab';
import RolesTab from '../components/botc/RolesTab';
import GamesTab from '../components/botc/GamesTab';
import StatsTab from '../components/botc/StatsTab';
import s from './shared.module.css';

export default function Botc() {
  usePageTitle('BOTC');
  const [tab, setTab] = useState('info');
  const { status, data, error, reload } = useBotcData();

  const computed = useMemo(() => (data ? computeBotc(data) : null), [data]);

  const tabs = [
    { id: 'info', label: '🩸 Présentation' },
    { id: 'rules', label: '📖 Règles', count: data?.rules.length },
    { id: 'players', label: '👥 Joueurs', count: data?.players.length },
    { id: 'roles', label: '🎭 Rôles', count: data?.roles.length },
    { id: 'games', label: '🎲 Parties', count: data?.games.length },
    { id: 'stats', label: '📊 Statistiques' },
  ];

  return (
    <div>
      <Link to="/activities" style={{ fontSize: '0.82rem', color: 'var(--c-muted)', display: 'inline-block', marginBottom: 12 }}>
        ← Activités
      </Link>
      <PageHeader
        title="Blood on the Clocktower"
        desc="Gérer la présentation, les règles, les joueurs, les rôles, les parties et les classements du BOTC."
      />

      {status === 'loading' && <div className={s.loading}>Chargement…</div>}
      {status === 'error' && <p className={s.error}>Impossible de charger les données du BOTC : {error}</p>}

      {status === 'ok' && data && (
        <>
          <Tabs tabs={tabs} value={tab} onChange={setTab} group="botc" />
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {tab === 'info' && <InfoTab info={data.info} reload={reload} />}
              {tab === 'rules' && <RulesTab rules={data.rules} reload={reload} />}
              {tab === 'players' && (
                <PlayersTab players={data.players} gamePlayers={data.gamePlayers} ranking={computed.ranking} reload={reload} />
              )}
              {tab === 'roles' && <RolesTab roles={data.roles} gamePlayers={data.gamePlayers} reload={reload} />}
              {tab === 'games' && (
                <GamesTab
                  games={data.games}
                  gamePlayers={data.gamePlayers}
                  players={data.players}
                  roles={data.roles}
                  reload={reload}
                />
              )}
              {tab === 'stats' && <StatsTab computed={computed} />}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
