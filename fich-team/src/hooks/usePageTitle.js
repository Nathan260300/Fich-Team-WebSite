import { useEffect } from 'react';
import { LEGAL_PAGES } from '../data/legalPages';

const TITLES = {
  '/':          'Accueil — FICH Team',
  '/qui':       'Qui — FICH Team',
  '/projets':   'Projets & Médias — FICH Team',
  '/reseaux':   'Réseaux — FICH Team',
  '/activites': 'Activités — FICH Team',
  '/activites/botc': 'Blood on the Clocktower — FICH Team',
  '/rejoindre': 'Rejoindre — FICH Team',
  ...Object.fromEntries(LEGAL_PAGES.map(p => [p.path, `${p.label} — FICH Team`])),
};

const PLAYER_PREFIX = '/activites/botc/stats/joueur/';

function readPseudo(pathname) {
  const raw = pathname.slice(PLAYER_PREFIX.length).split('/')[0];
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function usePageTitle(pathname) {
  useEffect(() => {
    if (pathname.startsWith(PLAYER_PREFIX)) {
      document.title = `${readPseudo(pathname)} BOTC – FICH Team`;
      return;
    }
    document.title = TITLES[pathname] ?? 'FICH Team';
  }, [pathname]);
}
