import { useEffect } from 'react';

export function useNoIndex() {
  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    if (!meta) return undefined;
    const previous = meta.getAttribute('content');
    meta.setAttribute('content', 'noindex, nofollow');
    return () => {
      if (previous !== null) meta.setAttribute('content', previous);
    };
  }, []);
}
