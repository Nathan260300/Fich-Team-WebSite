import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — FICH Dashboard` : 'FICH Dashboard';
  }, [title]);
}