import { useEffect } from 'react';

const TITLES = {
  '/':          'Accueil — FICH Team',
  '/qui':       'Qui — FICH Team',
  '/projets':   'Projets & Médias — FICH Team',
  '/reseaux':   'Réseaux — FICH Team',
  '/rejoindre': 'Rejoindre — FICH Team',
};

export function usePageTitle(pathname) {
  useEffect(() => {
    document.title = TITLES[pathname] ?? 'FICH Team';
  }, [pathname]);
}