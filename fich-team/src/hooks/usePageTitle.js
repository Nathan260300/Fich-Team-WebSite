import { useEffect } from 'react';
import { LEGAL_PAGES } from '../data/legalPages';

const TITLES = {
  '/':          'Accueil — FICH Team',
  '/qui':       'Qui — FICH Team',
  '/projets':   'Projets & Médias — FICH Team',
  '/reseaux':   'Réseaux — FICH Team',
  '/rejoindre': 'Rejoindre — FICH Team',
  ...Object.fromEntries(LEGAL_PAGES.map(p => [p.path, `${p.label} — FICH Team`])),
};

export function usePageTitle(pathname) {
  useEffect(() => {
    document.title = TITLES[pathname] ?? 'FICH Team';
  }, [pathname]);
}
