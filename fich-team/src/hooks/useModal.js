import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function stripped(search, names) {
  const params = new URLSearchParams(search);
  names.forEach(name => params.delete(name));
  return params;
}

function toSearch(params) {
  const text = params.toString();
  return text ? `?${text}` : '';
}

export function useModals(names) {
  const navigate = useNavigate();
  const location = useLocation();
  const key = names.join('|');
  const list = useMemo(() => key.split('|'), [key]);

  const params = new URLSearchParams(location.search);
  const active = list.find(name => params.get(name)) ?? null;
  const value = active ? params.get(active) : null;
  const pushed = location.state?.modal === true;

  const open = useCallback((name, next) => {
    const nextParams = stripped(location.search, list);
    nextParams.set(name, String(next));
    const alreadyOpen = list.some(item => new URLSearchParams(location.search).get(item));
    navigate(
      { pathname: location.pathname, search: toSearch(nextParams) },
      { replace: alreadyOpen && pushed, state: { modal: true } },
    );
  }, [navigate, location.pathname, location.search, list, pushed]);

  const swap = useCallback((name, next) => {
    const nextParams = stripped(location.search, list);
    nextParams.set(name, String(next));
    navigate(
      { pathname: location.pathname, search: toSearch(nextParams) },
      { replace: true, state: location.state },
    );
  }, [navigate, location.pathname, location.search, location.state, list]);

  const close = useCallback(() => {
    if (pushed) {
      navigate(-1);
      return;
    }
    navigate(
      { pathname: location.pathname, search: toSearch(stripped(location.search, list)) },
      { replace: true },
    );
  }, [navigate, pushed, location.pathname, location.search, list]);

  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape' && active) close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [active, close]);

  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  return { active, value, open, swap, close };
}

export function useTab(validIds, getDefault) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const raw = params.get('tab');
  const tab = validIds.includes(raw) ? raw : getDefault(params);

  const setTab = useCallback(id => {
    navigate({ pathname: location.pathname, search: `?tab=${id}` }, { replace: true });
  }, [navigate, location.pathname]);

  return [tab, setTab];
}

export function useChannels() {
  return {
    fetchChannels: async () => {
      const res = await fetch('/channels.json');
      if (!res.ok) throw new Error('Failed to fetch channels');
      return res.json();
    }
  };
}

export function useScrollHeader() {
  return {
    onScroll: (setScrolled) => {
      const handler = () => setScrolled(window.scrollY > 10);
      window.addEventListener('scroll', handler, { passive: true });
      return () => window.removeEventListener('scroll', handler);
    }
  };
}
