import { useEffect } from 'react';

const TITLES = {
  '/':            'Accueil — FICH Team',
  '/membres':     'Membres — FICH Team',
  '/projets':     'Projets & Médias — FICH Team',
  '/partenaires': 'Partenaires — FICH Team',
  '/rejoindre':   'Rejoindre — FICH Team',
};

export function usePageTitle(pathname) {
  useEffect(() => {
    document.title = TITLES[pathname] ?? 'FICH Team';
  }, [pathname]);
}
